import { BoxBufferGeometry, Mesh, MeshBasicMaterial, Scene } from "three";

const scene = new Scene();

const cube = new Mesh(new BoxBufferGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x00ff00 }));
scene.add(cube);

export { scene };
