use minifb::{Key, MouseButton, MouseMode, Window, WindowOptions};
use palette::{encoding::pixel::Pixel, Gradient, Hsv, LinSrgb};
use rayon::prelude::*;
use std::time::SystemTime;

const WIDTH: usize = 1024;
const HEIGHT: usize = 768;
const GRADIENT_SIZE: usize = 50;
const MAX_ITERATIONS: usize = 1000;

fn main() {
    let mut centre = (-0.666_f64, 0.0_f64);
    let mut zoom = 0;
    let mut mouse_left_was_down = false;
    let mut mouse_right_was_down = false;
    let mut buffer = vec![0_u32; WIDTH * HEIGHT];
    let mut stale_buffer = true;
    let mut window = Window::new("mandelbrot", WIDTH, HEIGHT, WindowOptions::default()).unwrap();

    let palette: Vec<u32> = Gradient::new(vec![
        Hsv::from(LinSrgb::new(1.0, 0.0, 0.0)),
        Hsv::from(LinSrgb::new(0.0, 1.0, 1.0)),
        Hsv::from(LinSrgb::new(1.0, 0.0, 0.0)),
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
        let mouse_left_down = window.get_mouse_down(MouseButton::Left);
        let mouse_right_down = window.get_mouse_down(MouseButton::Right);
        if mouse_left_was_down && !mouse_left_down {
            if let Some(mouse_pos) = window.get_unscaled_mouse_pos(MouseMode::Clamp) {
                centre = mouse_coords(centre, zoom, mouse_pos);
                zoom += 1;
                stale_buffer = true;
            }
        } else if mouse_right_was_down && !mouse_right_down && zoom > 0 {
            zoom -= 1;
            if zoom == 0 {
                centre = (-0.666, 0.0);
            }
            stale_buffer = true;
        }
        mouse_left_was_down = mouse_left_down;
        mouse_right_was_down = mouse_right_down;

        if stale_buffer {
            let start = SystemTime::now();
            buffer = render(centre, zoom, &palette);
            let end = SystemTime::now();
            let duration = end.duration_since(start).unwrap();
            println!("done in {:?}", duration);
            stale_buffer = false;
        }
        window.update_with_buffer(&buffer).unwrap();
    }
}

fn render(centre: (f64, f64), zoom: usize, palette: &[u32]) -> Vec<u32> {
    println!(
        "centre {:?}, zoom {}, {} iterations... ",
        centre, zoom, MAX_ITERATIONS
    );
    let (x_min, x_max, y_min, y_max) = frame_bounds(centre, zoom);
    (0..HEIGHT)
        .into_par_iter()
        .map(|row| {
            let y = (row as f64 / HEIGHT as f64) * (y_min - y_max) + y_max;
            (0..WIDTH)
                .into_par_iter()
                .map(|column| {
                    let x = (column as f64 / WIDTH as f64) * (x_max - x_min) + x_min;
                    let iterations = iterate(x, y);
                    if iterations == MAX_ITERATIONS {
                        0
                    } else {
                        palette[MAX_ITERATIONS - iterations]
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
    let mut iterations = 0;
    while x * x + y * y <= 4.0 && iterations < MAX_ITERATIONS {
        let x_new = x * x - y * y + x_0;
        let y_new = 2.0 * x * y + y_0;
        x = x_new;
        y = y_new;
        iterations += 1;
    }
    iterations
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

fn mouse_coords(centre: (f64, f64), zoom: usize, mouse_pos: (f32, f32)) -> (f64, f64) {
    let (x_min, x_max, y_min, y_max) = frame_bounds(centre, zoom);
    let x = (f64::from(mouse_pos.0) / WIDTH as f64) * (x_max - x_min) + x_min;
    let y = (f64::from(mouse_pos.1) / HEIGHT as f64) * (y_min - y_max) + y_max;
    (x, y)
}
