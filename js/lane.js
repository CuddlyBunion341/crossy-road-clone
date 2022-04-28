import { BoxGeometry, Group, Mesh, MeshMatcapMaterial } from "three";
import { worldSize } from "./global.js";
import { scene } from "./scene.js";

export const LaneManager = function () {
	this.lanes = [];
	this.currentLane = 0;

	const init = () => {
		for (let i = 0; i < 20; i++) {
			this.addLane();
		}
	};

	this.addLane = () => {
		const newLane = this.currentLane++;
		const lane = new Lane(newLane, Math.random() < 0.5 ? 0 : 1); // random height
		this.lanes.push(lane);
	};

	this.update = delta => {
		this.lanes.forEach(lane => lane.update(delta));
	};

	this.getLane = row => this.lanes[row];

	this.collision = (row, col) => this.lanes?.[row].collision(col);

	this.disposeLane = row => this.lanes?.[row].dispose();

	init();
};

class Lane {
	constructor(row, height) {
		this.group = new Group();
		this.row = row;
		this.height = height;
		this.init(scene);
		this.active = true;
	}
	init() {
		this.group.position.set(this.row, 0, 0);
		const floor = new Mesh(new BoxGeometry(1, 0.1, worldSize), new MeshMatcapMaterial({ color: 0xffffff }));
		floor.position.set(0.5, -0.05 + 0.1 * this.height, worldSize / 2);
		this.group.add(floor);
		scene.add(this.group);
	}
	dispose() {
		scene.remove(group);
		this.active = false;
	}
	update(delta) {}
	collision(col) {}
}
