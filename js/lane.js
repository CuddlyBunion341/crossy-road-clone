import { BoxGeometry, Group, Mesh, MeshMatcapMaterial } from "three";
import { worldSize } from "./global.js";
import { scene } from "./scene.js";
import { randomSign } from "./util.js";
import { Vehicle } from "./vehicle.js";

export class LaneManager {
	constructor() {
		this.lanes = [];
		this.currentLane = 0;

		for (let i = 0; i < 20; i++) {
			this.addLane();
		}
	}

	addLane() {
		const newLane = this.currentLane++;
		const lane =
			newLane <= 8
				? new EmptyLane(newLane)
				: Math.random() < 0.5
				? new VehicleLane(newLane)
				: new ObstacleLane(newLane);
		this.lanes.push(lane);
	}

	update(delta) {
		this.lanes.forEach(lane => lane.update(delta));
	}
	getLane(row) {
		return this.lanes[row];
	}
	collision(row, col) {
		return this.lanes?.[row].collision(col);
	}
	disposeLane(row) {
		this.lanes?.[row].dispose();
		this.lanes.splice(row, 1);
	}
}

// Main lane class
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

// Specific lane classes
class ObstacleLane extends Lane {
	constructor(row) {
		super(row, 1);
		this.obstacles = Array.from({ length: worldSize }, (_, i) => {
			if (Math.random() < 0.2) {
				// 20% chance of obstacle
				const obstacle = new Mesh(new BoxGeometry(0.8, 0.8, 0.8), new MeshMatcapMaterial({ color: 0xff0000 }));
				obstacle.position.set(0.4, 0.4, i + 0.4);
				this.group.add(obstacle);
				return obstacle;
			}
		});
	}

	collision(col) {
		return !!this.obstacles[col];
	}
}

class VehicleLane extends Lane {
	constructor(row) {
		super(row, 0);
		this.vehicleType = Math.random() < 0.2 ? "truck" : "car";
		this.direction = randomSign();
		this.vehicles = [];
		this.speed = 10;

		this.initVehicles();
	}

	initVehicles() {
		const vehicle = new Vehicle(this.vehicleType, this.direction, this.speed);
		this.group.add(vehicle.group);
		this.vehicles.push(vehicle);
	}

	collision(col) {
		return this.vehicles.some(vehicle => vehicle.contains(col));
	}

	update(delta) {
		if (this.active) this.vehicles.forEach(vehicle => vehicle.update(delta));
	}
}

class EmptyLane extends Lane {
	constructor(row) {
		super(row, 1);
	}
}
