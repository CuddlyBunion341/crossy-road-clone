const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(**dirname + "/public"));
app.use("/build/", express.static(path.join(**dirname, "node_modules/three/build")));
app.use("/jsm/", express.static(path.join(\_\_dirname, "node_modules/three/examples/jsm")));

app.listen(3000, () => {
console.log("Server started on port 3000");
console.log("Open http://localhost:3000/index.html in your browser");
});