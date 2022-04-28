export const random = (min, max) => Math.random() * (max - min) + min;
export const randomInt = (min, max) => random(min, max) << 0;
