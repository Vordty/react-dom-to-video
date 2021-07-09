import { useState, useEffect } from "react";

import { takeScreenshot } from "../helpers/takeScreenshot";
import { writeImage } from "../helpers/writeImage";
import { stitchFramesToVideo, downloadVideo } from "../helpers/videoManipulation";

import { createFFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg;

export const useVideoCapture = (node, trigger, options) => {
	const [frames, setFrames] = useState([]);
	const [videoSource, setVideoSource] = useState();
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
			generateFrame(options?.frame);
			return;
		}
	}, [trigger]);

	const generateFrame = async (frameOptions = {}) => {
		const image = await takeScreenshot(node, {});
		const imageObject = addFrame(image, frameOptions);

		return imageObject;
	};

	const addFrame = async (image, frameOptions = {}) => {
		const imageFilePath = await writeImage(image, frames.length, ffmpeg, frameOptions);
		const imageObject = {
			src: image,
			path: imageFilePath,
		};

		setFrames((frames) => [...frames, imageObject]);

		console.log("imageObject", imageObject);
		return imageObject;
	};

	const generateVideo = async (options = {}) => {
		stopWatching();

		const videoSource = await stitchFramesToVideo(
			ffmpeg,
			frames.map((frame) => frame.path),
			options,
		);

		setVideoSource(videoSource);
		return videoSource;
	};

	const exportVideo = (videoSource, options = {}) => {
		downloadVideo(videoSource, options);
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
		frames,
		generateFrame,
		videoSource,
		generateVideo,
		exportVideo,
	};
};
