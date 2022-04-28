import { Scene } from "three";
import { Lane } from "./lane.js";

const scene = new Scene();

new Lane(0, 1, scene);
new Lane(1, 0, scene);
new Lane(2, 0, scene);
new Lane(3, 1, scene);

export { scene };
