import sass from "rollup-plugin-sass";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { wasm } from "@rollup/plugin-wasm";
import bundleSize from "rollup-plugin-bundle-size";

import pkg from "./package.json";

export default {
	input: "src/index.js",
	output: [
		{
			file: pkg.main,
			format: "cjs",
			exports: "named",
			sourcemap: true,
			strict: false,
		},
	],
	plugins: [bundleSize(), resolve(), wasm(), commonjs(), sass({ insert: true })],
	external: ["react", "react-dom", "@ffmpeg/ffmpeg", "html2canvas"],
};
