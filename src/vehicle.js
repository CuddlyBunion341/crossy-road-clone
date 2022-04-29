import { worldSize } from "./global.js";
import { GameObject } from "./objects.js";
import { inRange, wrap } from "./util.js";

export class Vehicle extends GameObject {
	constructor(type, direction, speed) {
		super(type);
		this.type = type;
		this.direction = direction;
		this.speed = speed;
		this.pos = 0;

		if (direction === -1) this.rotate(Math.PI); // flip vehicle
	}
	contains(col) {
		return inRange(col, this.pos, this.pos + this.dims[0]);
	}

	update(delta) {
		this.pos += this.speed * this.direction * delta;
		this.pos = wrap(this.pos, 0, worldSize);
		this.moveTo(0, 0, this.pos);
	}
}
