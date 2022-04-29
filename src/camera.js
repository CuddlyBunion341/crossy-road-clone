export class CameraController {
	constructor(camera) {
		this.camera = camera;
		this.speed = 0.3;
		this.active = true;
		this.playerLane = 0;
	}

	jump() {
		this.playerLane++;
		this.camera.position.x = this.playerLane;
	}

	update(delta) {
		if (!this.active) return;
		this.camera.position.x += this.speed * delta;
		// test if camera is in front of player
		if (this.camera.position.x > this.playerLane + 1.5) {
			this.active = false;
			this.onCatchup();
		}
	}

	onCatchup() {}
}
