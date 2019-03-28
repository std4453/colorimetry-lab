import { Node, Group, Visible, Mesh, Camera, Material } from './classes';
import { HUDCamera, OrthogonalCamera, PerspectiveCamera } from './camera';
import { PureColorMaterial } from './material';
import Tessellator from './tessellator';
import Scene from './scene';
import run from './run';

const Drei = {
    Node, Group, Visible, Mesh, Camera, Material,
    HUDCamera, OrthogonalCamera, PerspectiveCamera,
    PureColorMaterial,
    Tessellator,
    Scene,
};

export { Drei, run };
