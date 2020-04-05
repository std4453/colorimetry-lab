import papa from 'papaparse';
import text from './assets/color_matching_functions.csv';

const zero = { X: 0, Y: 0, Z: 0 };
const snap = wl => Math.floor(wl * 10);
const interpolate = wl => wl * 10 - Math.floor(wl * 10);

const raw = papa.parse(text).data.map(arr => arr.map(n => parseFloat(n)));
const data = [];
for (const [wl, X, Y, Z] of raw) data[snap(wl)] = { X, Y, Z };

function wave_length_to_xyz(wl) {
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

export { wave_length_to_xyz };

function xyz_to_lab(XYZ) {
    function f(t) {
        const delta = 6 / 29;
        return t > Math.pow(delta, 3) ? Math.pow(t, 1 / 3) : t / (3 * delta * delta) + 4 / 29;
    }
    const { X, Y, Z } = XYZ;
    const Xn = 95.047 / 100, Yn = 100.0 / 100, Zn = 108.883 / 100;
    const L = 116 * f(Y / Yn) - 16;
    const A = 500 * (f(X / Xn) - f(Y / Yn));
    const B = 200 * (f(Y / Yn) - f(Z / Zn));
    return { L, A, B };
}

export { xyz_to_lab };

function xyz_to_lms(XYZ) {
    const { X, Y, Z } = XYZ;
    const L = 0.7328 * X + 0.4296 * Y - 0.1624 * Z;
    const M = -0.7036 * X + 1.6975 * Y + 0.0061 * Z;
    const S = 0.0030 * X + 0.0136 * Y + 0.9834 * Z;
    return { L, M, S };
}

export { xyz_to_lms };

function lms_to_xyz(LMS) {
    const { L, M, S } = LMS;
    const X = 1.09612382084 * L - 0.278869000218 * M + 0.182745179383 * S;
    const Y = 0.454369041975 * L + 0.473533154307 * M + 0.0720978037172 * S;
    const Z = -9.62760873843e-3 * L - 5.69803121611e-3 * M + 1.01532563995 * S;
    return { X: X, Y: Y, Z: Z };
}

function lms_to_xyz_matrix(T) {
    return function (LMS) {
        const { L, M, S } = LMS;
        return {
            X: T[0][0] * L + T[0][1] * M + T[0][2] * S,
            Y: T[1][0] * L + T[1][1] * M + T[1][2] * S,
            Z: T[2][0] * L + T[2][1] * M + T[2][2] * S
        };
    }
}

export const lms_to_xyz_vonkries1 = lms_to_xyz_matrix([[1.91019683405, -1.11212389279, 0.201907956768], [0.370950088249, 0.629054257393, -8.05514218436e-6], [0., 0., 1.]]);
export const lms_to_xyz_vonkries2 = lms_to_xyz_matrix([[1.86006661251, -1.1294800781, 0.219898303049], [0.361222924921, 0.638804306467, -7.12750153053e-6], [0., 0., 1.08908734481]])
export const lms_to_xyz_ciecam97a = lms_to_xyz_matrix([[0.986992905467, -0.147054256421, 0.159962651664], [0.432305269723, 0.518360271537, 0.0492912282129], [-8.52866457518e-3, 0.0400428216541, 0.968486695788]])
export const lms_to_xyz_ciecam97b = lms_to_xyz_matrix([[0.930752207661, -0.166680465649, 0.178557676521], [0.425125853562, 0.469465316214, 0.0797766065421], [-0.308880672076, 0.080619906613, 0.929585079439]])
export const lms_to_xyz_ciecam02 = lms_to_xyz;

function xyz_to_rgb({ X, Y, Z }) {
    const R = 0.41847 * X - 0.15866 * Y - 0.082835 * Z;
    const G = -0.091169 * X + 0.25243 * Y + 0.015708 * Z;
    const B = 0.00092090 * X - 0.0025498 * Y + 0.17860 * Z;
    return { R, G, B };
}

export { xyz_to_rgb };

function xyz_to_sRGB_uncorrected({ X, Y, Z }) {
    const R =  3.2406 * X + -1.5372 * Y + -0.4986 * Z;
    const G = -0.9689 * X +  1.8758 * Y +  0.0415 * Z;
    const B =  0.0557 * X + -0.2040 * Y +  1.0570 * Z;
    return { R, G, B };
}

export { xyz_to_sRGB_uncorrected };

function sRGB_uncorrected_to_xyz({ R, G, B }) {
    const X = 0.4124 * R + 0.3576 * G + 0.1805 * B;
    const Y = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    const Z = 0.0193 * R + 0.1192 * G + 0.9505 * B;
    return { X, Y, Z };
};

export { sRGB_uncorrected_to_xyz };

function xyz_to_xyY({ X, Y, Z }) {
    return { x: X / (X + Y + Z), y: Y / (X + Y + Z), Y };
}

export { xyz_to_xyY };

function temp_to_xy(T) {
    const x = T <= 4000
        ? -0.2661239 * 1e9 / Math.pow(T, 3) - 0.2343589 * 1e6 / Math.pow(T, 2) + 0.8776956 * 1e3 / T + 0.179910
        : -3.0258469 * 1e9 / Math.pow(T, 3) + 2.1070379 * 1e6 / Math.pow(T, 2) + 0.2226347 * 1e3 / T + 0.240390;
    const y = T <= 2222
        ? -1.1063814 * Math.pow(x, 3) - 1.34811020 * Math.pow(x, 2) + 2.18555832 * x - 0.20219683
        : (T <= 4000
        ? -0.9549476 * Math.pow(x, 3) - 1.37418593 * Math.pow(x, 2) + 2.09137015 * x - 0.16748867
        : +3.0817580 * Math.pow(x, 3) - 5.87338670 * Math.pow(x, 2) + 3.75112997 * x - 0.37001483);
    return { x, y };
}

export { temp_to_xy };
