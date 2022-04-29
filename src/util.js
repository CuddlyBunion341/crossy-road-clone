export const random = (min, max) => Math.random() * (max - min) + min;
export const randomInt = (min, max) => random(min, max) << 0;
export const randomSign = () => (Math.random() < 0.5 ? -1 : 1);
export const wrap = (value, min, max) => {
	if (value < min) return max;
	if (value > max) return min;
	return value;
};
export const inRange = (value, min, max) => value >= min && value <= max;
export const randomElement = array => array[randomInt(0, array.length)];
export const randomElementWeighted = (array, weights) => {
	const total = weights.reduce((a, b) => a + b);
	const random = random(0, total);
	let current = 0;
	for (let i = 0; i < array.length; i++) {
		current += weights[i];
		if (random < current) return array[i];
	}
};
export const subtractArray = (a, b) => a.map((x, i) => x - b[i]);
