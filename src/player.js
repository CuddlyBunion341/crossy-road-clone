import { createObject } from "../objects.js";
import { worldSize } from "./global.js";
import { scene } from "./scene.js";
import { inRange } from "./util.js";

const directions = {
	north: { dx: 0, dy: 1, angle: Math.PI },
	south: { dx: 0, dy: -1, angle: 0 },
	east: { dx: 1, dy: 0, angle: Math.PI * 0.5 },
	west: { dx: -1, dy: 0, angle: Math.PI * 1.5 },
};

export class Player {
	constructor(laneManager) {
		this.laneManager = laneManager;
		this.alive = true;
		this.score = 0;
		this.lane = 3;
		this.col = (worldSize / 2) << 0;

		this.initMesh();
		this.addListeners();
	}

	initMesh() {
		// const playerObject = new Mesh(new BoxGeometry(0.5, 0.5, 0.5), new MeshBasicMaterial({ color: 0x00ff00 }));
		const playerObject = createObject("player");
		playerObject.position.set(this.lane, 0.35, this.col);
		scene.add(playerObject);
		this.mesh = playerObject;
	}

	update(delta) {}

	move(direction) {
		if (!this.alive) return;
		const { dx, dy, angle } = direction;

		if (!inRange(this.col + dx, 0, worldSize) || this.lane + dy < 0) return; // out of bounds

		const currentLane = this.laneManager.getLane(this.lane + dy);
		const collides = currentLane.collision(this.col + dx);

		if (collides) {
			switch (currentLane.constructor.name) {
				case "VehicleLane":
					this.die();
					break;
				case "ObstacleLane":
					return; // dont move
			}
		}

		this.col += dx;
		this.lane += dy;
		this.mesh.position.set(this.lane + 0.5, 0.35, this.col + 0.5);

		this.onMove();

		this.rotate(angle);
	}

	rotate(angle) {
		this.mesh.rotation.y = angle;
	}

	die() {
		this.alive = false;
		this.onDeath();
	}

	// listeners

	onKeyDown(event) {}
	onKeyUp(event) {
		const moveForward = () => this.move(directions.north);
		const moveBackward = () => this.move(directions.south);
		const moveRight = () => this.move(directions.east);
		const moveLeft = () => this.move(directions.west);

		({
			KeyW: moveForward,
			KeyS: moveBackward,
			KeyA: moveLeft,
			KeyD: moveRight,

			KeyArrowUp: moveForward,
			KeyArrowDown: moveBackward,
			KeyArrowLeft: moveLeft,
			KeyArrowRight: moveRight,
		}[event.code]?.());
	}

	addListeners() {
		window.addEventListener("keydown", this.onKeyDown.bind(this));
		window.addEventListener("keyup", this.onKeyUp.bind(this));
	}

	removeListeners() {
		window.removeEventListener("keydown", this.onKeyDown);
		window.removeEventListener("keyup", this.onKeyUp);
	}

	// custom events
	onLaneAdvance() {}
	onMove() {}
	onDeath() {}

	dispose() {
		this.removeListeners();
		scene.remove(this.mesh);
	}
}

window.Player = Player;
