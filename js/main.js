import { OrbitControls } from "OrbitControls";
import { AxesHelper, BoxGeometry, Mesh, MeshNormalMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
const scene = new Scene();

const canvas = document.querySelector("#c");
const renderer = new WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const axis = new AxesHelper();
const controls = new OrbitControls(camera, canvas);
camera.position.set(1, 1, 1);
scene.add(camera);
scene.add(axis);

const cube = new Mesh(new BoxGeometry(), new MeshNormalMaterial({ color: 0xff0000 }));
scene.add(cube);

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

const render = () => {
	controls.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};
render();
