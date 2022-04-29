import * as TWEEN from "@tweenjs/tween.js";

const animate = time => {
	requestAnimationFrame(animate);
	TWEEN.update(time);
};

animate();

export class CameraController {
	constructor(camera) {
		this.camera = camera;
		this.speed = 0.3;
		this.active = true;
		this.playerLane = 0;
		this.animation = null;
	}

	jump() {
		const from = {
			x: this.camera.position.x,
			y: this.camera.position.y,
			z: this.camera.position.z,
		};

		const to = {
			x: ++this.playerLane,
			y: this.camera.position.y,
			z: this.camera.position.z,
		};

		this.animation = new TWEEN.Tween(from)
			.to(to, 100)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(() => {
				this.camera.position.x = from.x;
				this.camera.position.y = from.y;
				this.camera.position.z = from.z;
			})
			.onComplete(() => {
				this.animation = null;
			})
			.start();
	}

	update(delta) {
		if (!this.active) return;
		if (this.animation) {
			// TWEEN.update(delta);
			return;
		}

		this.camera.position.x += this.speed * delta;
		// test if camera is in front of player
		if (this.camera.position.x > this.playerLane + 1.5) {
			this.active = false;
			this.onCatchup();
		}
	}

	onCatchup() {}
}
