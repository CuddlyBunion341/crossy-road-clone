import { BoxGeometry, Group, Mesh, MeshMatcapMaterial } from "three";
import { worldSize } from "./global.js";

export class Lane {
	constructor(row, height, scene) {
		this.group = new Group();
		this.row = row;
		this.height = height;
		this.init(scene);
	}
	init(scene) {
		this.group.position.set(this.row, 0, 0);
		const floor = new Mesh(new BoxGeometry(1, 0.1, worldSize), new MeshMatcapMaterial({ color: 0xffffff }));
		floor.position.set(0.5, -0.05 + 0.1 * this.height, worldSize / 2);
		this.group.add(floor);
		scene.add(this.group);
	}
	dispose() {
		scene.remove(group);
	}
	update() {}
	collision(col) {}
}
