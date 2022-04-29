import { BoxGeometry, Group, Mesh, MeshMatcapMaterial, Vector3 } from "three";

const models = [
	{
		name: "player",
		scale: 0.6,
		meshOffset: [0, 0, 0],
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
];

export const createObject = name => {
	const model = models.find(model => model.name === name);
	if (!model) throw new Error("No model found for " + name);

	const mesh = createMesh(model);
	return mesh;
};

const createMesh = model => {
	const group = new Group();
	const { elements, rotation, scale, meshOffset, groupOffset } = model;

	if (!elements?.length) throw new Error("No elements found for " + model.name);

	elements.forEach(element => {
		console.log(element);
		const { name, from, to, color } = element;

		// create material
		const materialColor = parseInt(color, 16);
		const material = new MeshMatcapMaterial({ color: materialColor }); // convert from string hex to int

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
		group.add(mesh);
	});

	if (rotation) group.rotation.set(...rotation);
	if (scale) group.scale.set(scale, scale, scale);
	if (groupOffset) group.position.set(...groupOffset);

	const wrapper = new Group();
	wrapper.add(group);

	return wrapper;
};
