export const random = (min, max) => Math.random() * (max - min) + min;
export const randomInt = (min, max) => random(min, max) << 0;
export const randomSign = () => (Math.random() < 0.5 ? -1 : 1);
export const wrap = (value, min, max) => {
	if (value < min) return max;
	if (value > max) return min;
	return value;
};
