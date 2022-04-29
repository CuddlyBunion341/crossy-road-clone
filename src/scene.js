import { AmbientLight, Color, Fog, PointLight, Scene } from "three";

const scene = new Scene();
scene.background = new Color(0x87ceeb);
scene.fog = new Fog(0x87ceeb, 0, 20);

const light = new PointLight(0xffffff, 1);
light.position.set(10, 10, 0);
light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 40;
light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;
scene.add(light);

const ambientLight = new AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

export { scene, light };
