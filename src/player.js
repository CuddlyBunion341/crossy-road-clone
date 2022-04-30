import * as TWEEN from "@tweenjs/tween.js";
import { worldSize } from "./global.js";
import { GameObject } from "./objects.js";
import { scene } from "./scene.js";
import { inRange } from "./util.js";

const directions = {
	north: { dx: 0, dy: 1, angle: Math.PI },
	south: { dx: 0, dy: -1, angle: 0 },
	east: { dx: 1, dy: 0, angle: Math.PI * 0.5 },
	west: { dx: -1, dy: 0, angle: Math.PI * 1.5 },
};

const initialLane = 3;
const initialCol = (worldSize / 2) << 0;

export class Player {
	constructor(laneManager) {
		this.laneManager = laneManager;
		this.alive = true;
		this.score = 0;
		this.lane = initialLane;
		this.col = initialCol;
		this.moving = false;
		this.height = 1;

		this.initMesh();
		this.addListeners();
	}

	initMesh() {
		const playerObject = new GameObject("player");
		playerObject.moveTo(this.lane, 0.1, this.col);
		playerObject.addToContainer(scene);
		this.object = playerObject;
	}

	update(delta) {
		const collision = this.laneManager.collision(this.lane, this.col);
		if (collision) this.die();
	}

	move(direction) {
		if (!this.alive) return;
		const { dx, dy, angle } = direction;

		if (!inRange(this.col + dx, 0, worldSize) || this.lane + dy < 0) return; // out of bounds
		if (this.moving) return; // already moving

		const nextLane = this.laneManager.getLane(this.lane + dy);
		const collides = nextLane.collision(this.col + dx);

		if (collides) {
			switch (nextLane.constructor.name) {
				case "VehicleLane":
					// this.die();
					break;
				case "ObstacleLane":
					return; // dont move
			}
		}

		// this.rotate(angle); // not working

		const position = {
			x: this.lane,
			y: 0,
			z: this.col,
		};

		this.moving = new TWEEN.Tween(position)
			.to(
				{
					x: this.lane + dy,
					y: Math.PI, // arc
					z: this.col + dx,
				},
				100
			)
			.onUpdate(() => {
				this.object.moveTo(position.x, Math.sin(position.y) * 0.5 + nextLane.height * 0.1, position.z);
			})
			.start()
			.onComplete(() => {
				this.moving = false;
			});

		this.col += dx;
		this.lane += dy;

		if (this.lane - initialLane > this.score) {
			this.score = this.lane - initialLane;
			this.onLaneAdvance();
		}

		this.onMove();
	}

	rotate(angle) {
		this.object.rotate(angle);
	}

	die() {
		this.alive = false;
		this.object.flatten();
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
		this.object.dispose();
	}
}

window.Player = Player;
