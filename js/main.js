import { OrbitControls } from "OrbitControls";
import { AxesHelper, Clock, PerspectiveCamera, WebGLRenderer } from "three";
import { LaneManager } from "./lane.js";
import { Player } from "./player.js";
import { scene } from "./scene.js";

const canvas = document.querySelector("#c");
const renderer = new WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const axis = new AxesHelper();
const controls = new OrbitControls(camera, canvas);
camera.position.set(1, 1, 1);
scene.add(camera);
scene.add(axis);

const laneManager = new LaneManager();
const player = new Player();



window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new Clock();

const render = () => {
	controls.update();
	const delta = clock.getDelta();
	laneManager.update(delta);
	player.update(delta);
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};
render();
