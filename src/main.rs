use minifb::{Key, MouseButton, MouseMode, Window, WindowOptions};
use palette::{encoding::pixel::Pixel, Gradient, Hsv, LinSrgb};

const WIDTH: usize = 1024;
const HEIGHT: usize = 768;

fn main() {
    let mut centre: (f64, f64) = (-0.666, 0.0);
    let mut zoom: usize = 0;
    let mut mouse_was_down: bool = false;
    let mut buffer: Vec<u32> = vec![0; WIDTH * HEIGHT];
    let mut stale_buffer: bool = true;

    let mut window = Window::new("mandelbrot", WIDTH, HEIGHT, WindowOptions::default())
        .unwrap_or_else(|e| {
            panic!("{}", e);
        });

    while window.is_open() && !window.is_key_down(Key::Escape) {
        let mouse_down = window.get_mouse_down(MouseButton::Left);
        if mouse_was_down && !mouse_down {
            if let Some(mouse_pos) = window.get_unscaled_mouse_pos(MouseMode::Clamp) {
                centre = mouse_coords(centre, zoom, mouse_pos);
                zoom += 1;
                stale_buffer = true;
            }
        }
        mouse_was_down = mouse_down;

        if stale_buffer {
            render(centre, zoom, &mut buffer);
            stale_buffer = false;
        }
        window.update_with_buffer(&buffer).unwrap();
    }
}

fn render(centre: (f64, f64), zoom: usize, buffer: &mut [u32]) {
    let max_iterations = 20 + 4 * zoom;
    println!("{}", max_iterations);

    let grad = Gradient::new(vec![
        Hsv::from(LinSrgb::new(0.0, 0.0, 1.0)),
        Hsv::from(LinSrgb::new(1.0, 0.0, 1.0)),
        Hsv::from(LinSrgb::new(0.001, 0.0, 0.0)),
    ]);

    let palette: Vec<u32> = grad
        .take(20)
        .map(|color| {
            let pixel: [u8; 3] = LinSrgb::from(color).into_format().into_raw();
            (u32::from(pixel[0]) << 16) | (u32::from(pixel[1]) << 8) | (u32::from(pixel[2]))
        })
        .collect();

    let (x_min, x_max, y_min, y_max) = frame_bounds(centre, zoom);
    println!(
        "x_min: {}, x_max: {}, y_min: {}, y_max: {}",
        x_min, x_max, y_min, y_max
    );
    for p_y in 0..HEIGHT {
        let y_0: f64 = (p_y as f64 / HEIGHT as f64) * (y_min - y_max) + y_max;
        for p_x in 0..WIDTH {
            let x_0: f64 = (p_x as f64 / WIDTH as f64) * (x_max - x_min) + x_min;
            let escape_time = iterate(x_0, y_0, max_iterations);
            buffer[p_y * WIDTH + p_x] = palette[(escape_time - 1) % 20];
        }
    }
}

fn iterate(x_0: f64, y_0: f64, max_iterations: usize) -> usize {
    let mut x: f64 = 0.0;
    let mut y: f64 = 0.0;
    let mut iteration = 0;
    while x * x + y * y <= 4.0 && iteration < max_iterations {
        let x_new = x * x - y * y + x_0;
        let y_new = 2.0 * x * y + y_0;
        x = x_new;
        y = y_new;
        iteration += 1;
    }
    iteration
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
    let x_m: f64 = (f64::from(mouse_pos.0) / WIDTH as f64) * (x_max - x_min) + x_min;
    let y_m: f64 = (f64::from(mouse_pos.1) / HEIGHT as f64) * (y_min - y_max) + y_max;
    (x_m, y_m)
}
