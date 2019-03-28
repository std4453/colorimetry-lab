import load from './load';

const zero = { X: 0, Y: 0, Z: 0 };
const snap = wl => Math.floor(wl * 10);
const interpolate = wl => wl * 10 - Math.floor(wl * 10);

const preprocess = (data) => {
    const map = [];
    for (const [wl, X, Y, Z] of data) map[snap(wl)] = { X, Y, Z };
    return map;
};

const loadData = async () => {
    const raw = (await load('public/data/color_matching_functions.csv')).map(arr => arr.map(n => parseFloat(n)));
    return preprocess(raw);
};

const async_wave_length_to_xyz = async () => {
    const data = await loadData();
    return (wl) => {
        const snapped = snap(wl);
        const { X: X1, Y: Y1, Z: Z1 } = data[snapped] || zero;
        const { X: X2, Y: Y2, Z: Z2 } = data[snapped + 1] || zero;
        const t = interpolate(wl);
        return {
            X: X2 * t + X1 * (1 - t),
            Y: Y2 * t + Y1 * (1 - t),
            Z: Z2 * t + Z1 * (1 - t),
        };
    };
};

export default async_wave_length_to_xyz;
