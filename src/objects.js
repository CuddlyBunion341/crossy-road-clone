import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { randomElement, subtractArray } from "./util";

const models = [
	{
		name: "player",
		scale: 0.6,
		meshOffset: [-0.8, 0, 0.8],
		rotation: Math.PI * 0.5,
		elements: [
			{ name: "leftfoot", from: [1, 0, -3], to: [3, 1, 1], color: "ffa500" },
			{ name: "rightfoot", from: [-3, 0, -3], to: [-1, 1, 1], color: "ffa500" },
			{ name: "leftleg", from: [1, 1, -2], to: [2, 2, 1], color: "ffa500" },
			{ name: "rightleg", from: [-2, 1, -2], to: [-1, 2, 1], color: "ffa500" },
			{ name: "belly", from: [-3, 2, -3], to: [3, 6, 0], color: "ffffff" },
			{ name: "bellytop", from: [-3, 6, -3], to: [3, 11, -1], color: "ffffff" },
			{ name: "head", from: [-3, 11, -3], to: [3, 14, 1], color: "800080" },
			{ name: "back", from: [-3, 2, 0], to: [3, 6, 2], color: "800080" },
			{ name: "beak", from: [-1, 11, -5], to: [1, 12, -3], color: "ffa500" },
			{ name: "righteye", from: [2.25, 12, -2], to: [3.25, 13, -1], color: "add8e6" },
			{ name: "lefteye", from: [-3.25, 12, -2], to: [-2.25, 13, -1], color: "add8e6" },
			{ name: "leftarm", from: [-4, 4, -2], to: [-3, 8, 0], color: "800080" },
			{ name: "rightarm", from: [3, 4, -2], to: [4, 8, 0], color: "800080" },
			{ name: "backtop", from: [-3, 6, -1], to: [3, 11, 1], color: "800080" },
		],
	},
	{
		name: "car",
		rotation: 0,
		scale: 1.6,
		meshOffset: [0, 0, 0.5],
		groupOffset: [0, 0, 0],
		get elements() {
			const carColors = ["ff0000", "ffa500", "ffff00", "00ff00", "00ffff", "0000ff", "ff00ff"];
			const color = randomElement(carColors);
			return [
				{ name: "frontwheel", from: [-5, 0, 3], to: [5, 3, 6], color: "808080" },
				{ name: "backwheel", from: [-5, 0, -6], to: [5, 3, -3], color: "808080" },
				{ name: "body", from: [-4, 1, -8], to: [4, 5, 8], color: color },
				{ name: "cabin", from: [-3, 5, -6], to: [3, 8, 4], color: "add8e6" },
			];
		},
	},
	{
		name: "truck",
		rotation: Math.PI * 0.5,
		scale: 1.6,
		meshOffset: [-0.5, 0, 0],
		groupOffset: [-0.1, 0, 0],
		elements: [
			{ name: "backwheel", from: [4, 0, -5], to: [7, 3, 5], color: "000000" },
			{ name: "frontwheel", from: [-11, 0, -5], to: [-8, 3, 5], color: "000000" },
			{ name: "cabinwheel", from: [-18, 0, -5], to: [-15, 3, 5], color: "000000" },
			{ name: "floor", from: [-12, 1, -4], to: [8, 3, 4], color: "c0c0c0" },
			{ name: "trailer", from: [-12, 3, -6], to: [8, 11, 6], color: "c0c0c0" },
			{ name: "cabin", from: [-20, 1, -4], to: [-13, 8, 4], color: ["ffa500", "ff0000", "ff00ff"] },
			{ name: "roof1", from: [-17, 8, -3], to: [-13, 9, 3], color: "c0c0c0" },
			// { name: "roof2", from: [-16, 9, -3], to: [-13, 10, 3], color: "c0c0c0" },
			{ name: "join1", from: [-13, 1, -3], to: [-12, 2, 3], color: "c0c0c0" },
			{ name: "join2", from: [-13, 2, -2], to: [-12, 4, 2], color: "c0c0c0" },
		],
	},
	{
		name: "tree",
		scale: 1,
		meshOffset: [0.5, 0, 0.5],
		groupOffset: [0, 0, 0],
		get elements() {
			// a elements getter for dynamic objects
			const trunkSize = randomElement([3, 5, 7]);
			const leaveSize = randomElement([16, 18, 20]);
			return [
				{ name: "trunk", from: [-2, 0, -2], to: [2, trunkSize, 2], color: "8b4513" },
				{ name: "leaves", from: [-5, trunkSize, -5], to: [5, leaveSize, 5], color: "00ff00" },
			];
		},
	},
	{
		name: "rock",
		elements: [{ name: "rock", from: [3, 0, 3], to: [13, 9, 13], color: "808080" }],
	},
].map(model => {
	Object.defineProperty(model, "dimensions", {
		get: function () {
			const { elements } = this;
			const { min, max } = elements.reduce(
				({ min, max }, { from, to }) => {
					const [x1, y1, z1] = from;
					const [x2, y2, z2] = to;
					return {
						min: [Math.min(min[0], x1, x2), Math.min(min[1], y1, y2), Math.min(min[2], z1, z2)],
						max: [Math.max(max[0], x1, x2), Math.max(max[1], y1, y2), Math.max(max[2], z1, z2)],
					};
				},
				{ min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] }
			);
			return subtractArray(max, min);
		},
	});
	return model;
});

export const createObject = name => {
	const model = models.find(model => model.name === name);
	if (!model) throw new Error("No model found for " + name);

	const group = createGroup(model);
	return { group, model };
};

const createGroup = model => {
	const group = new Group();
	const { elements, rotation, scale, meshOffset, groupOffset } = model;

	if (!elements?.length) throw new Error("No elements found for " + model.name);

	elements.forEach(element => {
		const { name, from, to, color } = element;

		// create material
		const materialColor = parseInt(color, 16);
		const material = new MeshStandardMaterial({ color: materialColor }); // convert from string hex to int

		// create geometry
		const [x1, y1, z1] = from.map(v => v / 16);
		const [x2, y2, z2] = to.map(v => v / 16);

		const dx = x2 - x1;
		const dy = y2 - y1;
		const dz = z2 - z1;

		const geometry = new BoxGeometry(dx, dy, dz);

		// create mesh
		const mesh = new Mesh(geometry, material);
		mesh.position.set(x1 + dx / 2, y1 + dy / 2, z1 + dz / 2);
		mesh.name = name;

		// offset mesh
		if (meshOffset) mesh.position.add(new Vector3(...meshOffset));

		// shadows
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		group.add(mesh);
	});

	if (rotation) group.rotation.set(0, rotation, 0);
	if (scale) group.scale.set(scale, scale, scale);
	if (groupOffset) group.position.set(...groupOffset);

	const wrapper = new Group();
	wrapper.add(group);

	return wrapper;
};

export class GameObject {
	constructor(name, props) {
		this.name = name;

		const object = createObject(name);
		this.group = object.group;
		this.dims = object.model.dimensions;
		this.rotation = 0;
	}

	static create(name, props) {
		// alternative constructor
		return new GameObject(name, props);
	}

	move(x, y, z) {
		this.group.position.add(new Vector3(x, y, z));
	}

	moveTo(x, y, z) {
		this.group.position.set(x, y, z);
	}

	rotate(angle) {
		this.rotation = this.group.rotation.y = angle;
	}

	get position() {
		return this.group.position;
	}

	clone() {
		return new GameObject(this.name, this);
	}

	dispose() {
		if (scene) this.container.remove(this.group);
		this.group.dispose();
	}

	addToContainer(container) {
		container.add(this.group);
		this.container = container;
	}
}
