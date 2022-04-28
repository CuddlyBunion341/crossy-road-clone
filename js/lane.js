import { Group } from "three";
import { scene } from "./scene";

class Lane {
	constructor(row, height) {
		this.group = new Group();
		this.row = row;
		this.height = height;
		this.init();
	}
	init() {
		this.group.position.set(row, 0, 0);
		const floor = new Mesh(new BoxGeometry(1, this.height, 1), new MeshBasicMaterial({ color: 0xffffff }));
		this.group.add(floor);
		scene.add(group);
	}
	dispose() {
		scene.remove(group);
	}
	update() {}
	collision(col) {}
}
