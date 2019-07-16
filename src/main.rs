use minifb::{Key, MouseButton, MouseMode, Window, WindowOptions};
use palette::{encoding::pixel::Pixel, Gradient, Hsv, LinSrgb};
use rayon::prelude::*;
use std::time::SystemTime;

const GRADIENT_SIZE: usize = 100;
const MAX_ITERATIONS: usize = 1000;

fn main() {
    let window_size = (1024, 768);
    let mut centre = (-0.666_f64, 0.0_f64);
    let mut zoom = 0;
    let mut mouse_left_was_down = false;
    let mut mouse_right_was_down = false;
    let mut do_render = true;
    let mut window = Window::new(
        "mandelbrot",
        window_size.0,
        window_size.1,
        WindowOptions {
            resize: true,
            ..WindowOptions::default()
        },
    )
    .unwrap();

    let palette: Vec<u32> = Gradient::new(vec![
        Hsv::from(LinSrgb::new(0.0, 1.0, 1.0)),
        Hsv::from(LinSrgb::new(1.0, 0.0, 0.0)),
        Hsv::from(LinSrgb::new(0.0, 1.0, 1.0)),
    ])
    .take(GRADIENT_SIZE)
    .map(|color| {
        let pixel: [u8; 3] = LinSrgb::from(color).into_format().into_raw();
        (u32::from(pixel[0]) << 16) | (u32::from(pixel[1]) << 8) | (u32::from(pixel[2]))
    })
    .cycle()
    .take(MAX_ITERATIONS)
    .collect();

    while window.is_open() && !window.is_key_down(Key::Escape) {
        let old_window_size = window_size;
        // window_size = window.get_size();
        let mouse_left_down = window.get_mouse_down(MouseButton::Left);
        let mouse_right_down = window.get_mouse_down(MouseButton::Right);
        if window_size != old_window_size {
            println!("window resized {:?}", window_size);
            do_render = true;
        } else if mouse_left_was_down && !mouse_left_down {
            if let Some(mouse_pos) = window.get_unscaled_mouse_pos(MouseMode::Clamp) {
                centre = mouse_coords(window_size, centre, zoom, mouse_pos);
                zoom += 1;
                do_render = true;
            }
        } else if mouse_right_was_down && !mouse_right_down && zoom > 0 {
            zoom -= 1;
            if zoom == 0 {
                centre = (-0.666, 0.0);
            }
            do_render = true;
        }
        mouse_left_was_down = mouse_left_down;
        mouse_right_was_down = mouse_right_down;

        if do_render {
            let start = SystemTime::now();
            let buffer = render(window_size, centre, zoom, &palette);
            let end = SystemTime::now();
            let duration = end.duration_since(start).unwrap();
            println!("done in {:?}", duration);
            window.update_with_buffer(&buffer).unwrap();
            do_render = false;
        } else {
            window.update();
        }
    }
}

fn render(
    window_size: (usize, usize),
    centre: (f64, f64),
    zoom: usize,
    palette: &[u32],
) -> Vec<u32> {
    println!(
        "centre {:?}, zoom {}, {} iterations... ",
        centre, zoom, MAX_ITERATIONS
    );

    let (x_min, x_max, y_min, y_max) = frame_bounds(centre, zoom);
    (0..window_size.1)
        .into_par_iter()
        .map(|row| {
            let y = (row as f64 / window_size.1 as f64) * (y_min - y_max) + y_max;
            (0..window_size.0)
                .into_par_iter()
                .map(|column| {
                    let x = (column as f64 / window_size.0 as f64) * (x_max - x_min) + x_min;
                    let i = iterate(x, y);
                    if i == MAX_ITERATIONS {
                        0
                    } else {
                        palette[i]
                    }
                })
                .collect::<Vec<u32>>()
        })
        .flatten()
        .collect()
}

fn iterate(x_0: f64, y_0: f64) -> usize {
    let mut x = 0.0;
    let mut y = 0.0;
    let mut i = 0;
    while i < MAX_ITERATIONS && x * x + y * y <= 4.0 {
        let x_new = x * x - y * y + x_0;
        let y_new = 2.0 * x * y + y_0;
        x = x_new;
        y = y_new;
        i += 1;
    }
    i
}

fn frame_bounds(centre: (f64, f64), zoom: usize) -> (f64, f64, f64, f64) {
    let zoom_scale = 2.0_f64.powf(zoom as f64);
    let delta_x = 1.666 * (1.0 / zoom_scale);
    let delta_y = 1.25 * (1.0 / zoom_scale);
    let x_min = centre.0 - delta_x;
    let x_max = centre.0 + delta_x;
    let y_min = centre.1 - delta_y;
    let y_max = centre.1 + delta_y;
    (x_min, x_max, y_min, y_max)
}

fn mouse_coords(
    window_size: (usize, usize),
    centre: (f64, f64),
    zoom: usize,
    mouse_pos: (f32, f32),
) -> (f64, f64) {
    let (x_min, x_max, y_min, y_max) = frame_bounds(centre, zoom);
    let x = (f64::from(mouse_pos.0) / window_size.0 as f64) * (x_max - x_min) + x_min;
    let y = (f64::from(mouse_pos.1) / window_size.1 as f64) * (y_min - y_max) + y_max;
    (x, y)
}
