import async_wave_length_to_xyz from './wave_length';
import { xyz_to_rgb } from './convert';

const startWL = 380;
const endWL = 750;
const height = 100;
const width = 1110;
const step = .1;

const normalizeRGB = ({ R, G, B }) => {
    const max = Math.max(R, G, B, 0);
    if (max > 0.01) return { R: R / max, G: G / max, B: B / max };
    return { R, G, B };
};
const scaleRGB = scale => ({ R, G, B }) => ({ R: R * scale, G: G * scale, B: B * scale });
const clamp = n => Math.round(Math.min(Math.max(0, n), 1) * 256);
const clampRGB = ({ R, G, B }) => ({ R: clamp(R), G: clamp(G), B: clamp(B) });
const toColorString = ({ R, G, B }) => `rgb(${R.toFixed(1)}, ${G.toFixed(1)}, ${B.toFixed(1)})`;

const use = (input, layers) => {
    let result = input;
    for (const layer of layers) result = layer(result);
    return result;
};

const spectrum = async ({ ctx }) => {
    const wave_length_to_xyz = await async_wave_length_to_xyz();
    const unit = width / (endWL - startWL);
    for (let i = startWL; i < endWL; i += step) {
        ctx.fillStyle = use(i, [
            wave_length_to_xyz,
            xyz_to_rgb,
            scaleRGB(3),
            // normalizeRGB,
            clampRGB,
            toColorString,
        ]);
        ctx.fillRect((i - startWL) * unit, 0, unit, height);
    }
};

export default spectrum;