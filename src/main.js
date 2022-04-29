import { AxesHelper, Clock, PerspectiveCamera, WebGLRenderer } from "three";
import { worldSize } from "./global.js";
import { LaneManager } from "./lane.js";
import { Player } from "./player.js";
import { scene } from "./scene.js";

console.log("Hello World");

const canvas = document.querySelector("#c");
const renderer = new WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const axis = new AxesHelper();
camera.position.set(-5, 6, worldSize / 2);
camera.rotation.set(-Math.PI / 2, -Math.PI / 3, -Math.PI * 0.5);
camera.updateProjectionMatrix();
// const controls = new OrbitControls(camera, canvas);
scene.add(camera);
scene.add(axis);

const laneManager = new LaneManager();
const player = new Player(laneManager);

player.onLaneAdvance = () => {
	camera.position.x += 1;
	laneManager.addLane();
};

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new Clock();

const render = () => {
	// controls?.update();
	const delta = clock.getDelta();
	laneManager.update(delta);
	player.update(delta);
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};
render();
