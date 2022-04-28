import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
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
	constructor() {
		this.alive = true;
		this.score = 0;
		this.lane = 3;
		this.col = (worldSize / 2) << 0;

		this.initMesh();
		this.addListeners();
	}

	initMesh() {
		const playerObject = new Mesh(new BoxGeometry(0.5, 0.5, 0.5), new MeshBasicMaterial({ color: 0x00ff00 }));
		playerObject.position.set(this.lane, 0.35, this.col);
		scene.add(playerObject);
		this.mesh = playerObject;
	}

	update(delta) {}

	move(direction) {
		if (!this.alive) return;
		const { dx, dy, angle } = direction;

		if (!inRange(this.col + dx, 0, worldSize) || this.lane + dy < 0) return; // out of bounds

		this.onMove();

		this.col += dx;
		this.lane += dy;

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

	onKeyDown(event) {
		console.log("KeyDown", { code: event.code });
	}
	onKeyUp(event) {
		console.log("KeyUp", { code: event.code });
	}

	addListeners() {
		window.addEventListener("keydown", this.onKeyDown);
		window.addEventListener("keyup", this.onKeyUp);
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
