import { request } from "http";

const run = ({ render }) => (params) => {
    const { canvas, ctx } = params;
    const frame = () => {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        render(ctx, params);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
};

export default run;
