import { useState, useEffect } from "react";

import { takeScreenshot } from "../helpers/takeScreenshot";
import { writeImage } from "../helpers/writeImage";
import { generateVideo } from "../helpers/generateVideo";

import { createFFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg;

export const useVideoCapture = (node, trigger, options) => {
	const [frames, setFrames] = useState([]);
	const [isWatching, setIsWatching] = useState(false);

	useEffect(() => {
		const setupFFMPEG = async () => {
			ffmpeg = createFFmpeg({
				corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
				log: true,
			});
			if (!ffmpeg?.isLoaded()) await ffmpeg.load();
		};

		setupFFMPEG();
	}, []);

	useEffect(() => {
		if (isWatching) {
			console.log("NODE TO CAPTURE", node);
			addFrame();
			return;
		}
	}, [trigger]);

	const addFrame = async () => {
		const image = await takeScreenshot(node, {
			html2canvas: { proxy: "http://localhost:5000/" },
		});
		const imageFilePath = await writeImage(image, frames.length, ffmpeg, {});
		setFrames((frames) => [
			...frames,
			{
				src: image,
				path: imageFilePath,
			},
		]);
		console.log("imageFilePath", imageFilePath);
	};

	const exportVideo = () => {
		stopWatching();
		generateVideo(
			ffmpeg,
			frames.map((frame) => frame.path),
			{},
		);
	};

	const startWatching = () => {
		setIsWatching(true);
	};

	const stopWatching = () => {
		setIsWatching(false);
	};

	return {
		isWatching,
		startWatching,
		stopWatching,
		addFrame,
		exportVideo,
	};
};
