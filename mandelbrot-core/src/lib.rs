use palette::{encoding::pixel::Pixel, Gradient, Hsv, LinSrgb};
use safe_transmute::to_bytes::transmute_to_bytes;
use wasm_bindgen::prelude::*;

const GRADIENT_SIZE: usize = 100;

#[wasm_bindgen]
pub fn render(
    frame_width: usize,
    frame_height: usize,
    centre_x: f64,
    centre_y: f64,
    zoom: usize,
    max_iterations: usize,
) -> Vec<u8> {
    let centre = (centre_x, centre_y);
    println!(
        "centre {:?}, zoom {}, {} iterations... ",
        centre, zoom, max_iterations
    );

    // TODO: Pre-generate palette
    let palette: Vec<u32> = Gradient::new(vec![
        Hsv::from(LinSrgb::new(0.0, 1.0, 1.0)),
        Hsv::from(LinSrgb::new(1.0, 0.0, 0.0)),
        Hsv::from(LinSrgb::new(0.0, 1.0, 1.0)),
    ])
    .take(GRADIENT_SIZE)
    .map(|color| {
        let pixel: [u8; 3] = LinSrgb::from(color).into_format().into_raw();
        // 255 << 24 | (u32::from(pixel[0]) << 16) | (u32::from(pixel[1]) << 8) | (u32::from(pixel[2]))
        255 << 24 | (u32::from(pixel[2]) << 16) | (u32::from(pixel[1]) << 8) | (u32::from(pixel[0]))
    })
    .cycle()
    .take(max_iterations)
    .collect();

    let (x_min, x_max, y_min, y_max) =
        frame_bounds(frame_width, frame_height, centre_x, centre_y, zoom);
    let data = (0..frame_height)
        .map(|row| {
            let y = (row as f64 / frame_height as f64) * (y_min - y_max) + y_max;
            (0..frame_width)
                .map(|column| {
                    let x = (column as f64 / frame_width as f64) * (x_max - x_min) + x_min;
                    let i = iterate(x, y, max_iterations);
                    if i == max_iterations {
                        // 255 << 24 | 0
                        0xFF000000
                    } else {
                        palette[i]
                    }
                })
                .collect::<Vec<u32>>()
        })
        .flatten()
        .collect::<Vec<u32>>();
    transmute_to_bytes(&data).to_vec()
}

fn iterate(c_x: f64, c_y: f64, max_iterations: usize) -> usize {
    let mut z_x = 0.0;
    let mut z_y = 0.0;
    let mut i = 0;
    while i < max_iterations && z_x * z_x + z_y * z_y <= 4.0 {
        let z_x_new = z_x * z_x - z_y * z_y + c_x;
        let z_y_new = 2.0 * z_x * z_y + c_y;
        z_x = z_x_new;
        z_y = z_y_new;
        i += 1;
    }
    i
}

pub fn frame_bounds(
    frame_width: usize,
    frame_height: usize,
    centre_x: f64,
    centre_y: f64,
    zoom: usize,
) -> (f64, f64, f64, f64) {
    let zoom_scale = 2.0_f64.powf(zoom as f64);
    let aspect_ratio = frame_width as f64 / frame_height as f64;
    let delta_x = 1.25 * aspect_ratio * (1.0 / zoom_scale);
    let delta_y = 1.25 * (1.0 / zoom_scale);
    let x_min = centre_x - delta_x;
    let x_max = centre_x + delta_x;
    let y_min = centre_y - delta_y;
    let y_max = centre_y + delta_y;
    (x_min, x_max, y_min, y_max)
}
