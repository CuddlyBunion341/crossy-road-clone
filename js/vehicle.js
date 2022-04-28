import { BoxGeometry, Group, Mesh, MeshMatcapMaterial } from "three";

export class Vehicle {
	constructor(type, direction, speed) {
		this.type = type;
		this.direction = direction;
		this.speed = speed;
		this.position = 0;

		this.group = new Group();
		this.group.add(new Mesh(new BoxGeometry(0.5, 0.5, 0.5), new MeshMatcapMaterial({ color: 0x00ff00 })));
	}
	contains(col) {
		// todo: check if col is in vehicle
		return false;
	}

	update(delta) {
		// todo: wrap around
		this.position += this.speed * this.direction * delta;
		this.group.position.z = this.position;
	}
}
