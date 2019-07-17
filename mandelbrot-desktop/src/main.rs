use minifb::{Key, MouseButton, MouseMode, Window, WindowOptions};
use std::time::SystemTime;

use mandelbrot_core::{frame_bounds, render};

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
            resize: false,
            ..WindowOptions::default()
        },
    )
    .unwrap();

    while window.is_open() && !window.is_key_down(Key::Escape) {
        let mouse_left_down = window.get_mouse_down(MouseButton::Left);
        let mouse_right_down = window.get_mouse_down(MouseButton::Right);
        // let old_window_size = window_size;
        // window_size = window.get_size();
        // if window_size != old_window_size {
        //     println!("window resized {:?}", window_size);
        //     do_render = true;
        /*} else */
        if mouse_left_was_down && !mouse_left_down {
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
            let buffer = render(
                window_size.0,
                window_size.1,
                centre.0,
                centre.1,
                zoom,
                MAX_ITERATIONS,
            );
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

fn mouse_coords(
    window_size: (usize, usize),
    centre: (f64, f64),
    zoom: usize,
    mouse_pos: (f32, f32),
) -> (f64, f64) {
    let (x_min, x_max, y_min, y_max) = frame_bounds(centre.0, centre.1, zoom);
    let x = (f64::from(mouse_pos.0) / window_size.0 as f64) * (x_max - x_min) + x_min;
    let y = (f64::from(mouse_pos.1) / window_size.1 as f64) * (y_min - y_max) + y_max;
    (x, y)
}
