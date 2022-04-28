import { BoxGeometry, Group, Mesh, MeshMatcapMaterial } from "three";
import { worldSize } from "./global.js";
import { wrap } from "./util.js";

export class Vehicle {
	constructor(type, direction, speed) {
		this.type = type;
		this.direction = direction;
		this.speed = speed;
		this.position = 0;

		this.group = new Group();
		const testCube = new Mesh(new BoxGeometry(0.5, 0.5, 0.5), new MeshMatcapMaterial({ color: 0x00ff00 }));
		testCube.position.set(0.25, 0.25, 0.25);
		this.group.add(testCube);
	}
	contains(col) {
		// todo: check if col is in vehicle
		return false;
	}

	update(delta) {
		// todo: wrap around
		this.position += this.speed * this.direction * delta;
		this.position = wrap(this.position, 0, worldSize);
		this.group.position.z = this.position;
	}
}
