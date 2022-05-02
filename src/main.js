import { AxesHelper, Clock, PerspectiveCamera, WebGLRenderer } from "three";
import { CameraController } from "./camera.js";
import { worldSize } from "./global.js";
import { LaneManager } from "./lane.js";
import { Player } from "./player.js";
import { light, scene } from "./scene.js";

const canvas = document.querySelector("#c");
const renderer = new WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.autoUpdate = true;

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const axis = new AxesHelper();
camera.position.set(0, 6, worldSize / 2);
camera.rotation.set(-Math.PI / 2, -Math.PI / 3, -Math.PI * 0.5);
camera.updateProjectionMatrix();

const cameraController = new CameraController(camera);

scene.add(camera);
scene.add(axis);

const laneManager = new LaneManager();
const player = new Player(laneManager);

player.onLaneAdvance = () => {
	laneManager.addLane();
	light.position.x += 1;
	cameraController.jump();
	console.log(player.score);
	document.querySelector("#score").innerHTML = `Score: ${player.score}`;
};

cameraController.onCatchup = () => {
	player.die();
};

player.onDeath = () => {
	cameraController.disable();
	gameOver();
};

const gameOver = () => {
	document.querySelector("#game-over").style.display = "flex";
	document.querySelector("#restart-btn").focus();
};

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new Clock();

const render = () => {
	const delta = clock.getDelta();
	laneManager.update(delta);
	player.update(delta);
	cameraController.update(delta);
	requestAnimationFrame(render);
	renderer.render(scene, camera);
};
render();
