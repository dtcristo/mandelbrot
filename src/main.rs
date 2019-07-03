use minifb::{Key, Window, WindowOptions};
use palette::{encoding::pixel::Pixel, Gradient, Hsv, LinSrgb};
use std::convert::TryFrom;

const WIDTH: u32 = 1024;
const HEIGHT: u32 = 768;

const X_MIN: f64 = -2.333;
const X_MAX: f64 = 1.0;
const Y_MIN: f64 = -1.25;
const Y_MAX: f64 = 1.25;

const MAX_ITERATIONS: u32 = 30;

fn main() {
    let buffer_size: usize = usize::try_from(WIDTH * HEIGHT).unwrap();
    let width_usize: usize = usize::try_from(WIDTH).unwrap();
    let height_usize: usize = usize::try_from(HEIGHT).unwrap();

    let mut buffer: Vec<u32> = vec![0; buffer_size];

    let mut window = Window::new(
        "mandelbrot",
        width_usize,
        height_usize,
        WindowOptions::default(),
    )
    .unwrap_or_else(|e| {
        panic!("{}", e);
    });

    let grad = Gradient::new(vec![
        Hsv::from(LinSrgb::new(0.0, 0.0, 1.0)),
        Hsv::from(LinSrgb::new(1.0, 0.0, 1.0)),
        Hsv::from(LinSrgb::new(0.000_001, 0.0, 0.0)),
    ]);

    let palette: Vec<u32> = grad
        .take(usize::try_from(MAX_ITERATIONS).unwrap())
        .map(|color| {
            let pixel: [u8; 3] = LinSrgb::from(color).into_format().into_raw();
            (u32::from(pixel[0]) << 16) | (u32::from(pixel[1]) << 8) | (u32::from(pixel[2]))
        })
        .collect();

    for p_y in 0..HEIGHT {
        let y_0: f64 = (f64::from(p_y) / f64::from(HEIGHT)) * (Y_MIN - Y_MAX) + Y_MAX;
        for p_x in 0..WIDTH {
            let x_0: f64 = (f64::from(p_x) / f64::from(WIDTH)) * (X_MAX - X_MIN) + X_MIN;
            let escape_time = iterate(x_0, y_0);
            buffer[usize::try_from(p_y * WIDTH + p_x).unwrap()] =
                palette[usize::try_from(escape_time).unwrap() - 1];
        }
    }

    while window.is_open() && !window.is_key_down(Key::Escape) {
        window.update_with_buffer(&buffer).unwrap();
    }
}

fn iterate(x_0: f64, y_0: f64) -> u32 {
    let mut x: f64 = 0.0;
    let mut y: f64 = 0.0;
    let mut iteration: u32 = 0;
    while x * x + y * y <= 4.0 && iteration < MAX_ITERATIONS {
        let x_new = x * x - y * y + x_0;
        let y_new = 2.0 * x * y + y_0;
        x = x_new;
        y = y_new;
        iteration += 1;
    }
    iteration
}
