import { useState, useEffect, useMemo } from "react";
import { createFFmpeg } from "@ffmpeg/ffmpeg";

import { takeScreenshot } from "../helpers/takeScreenshot";
import { writeImage } from "../helpers/writeImage";
import { stitchFramesToVideo, downloadVideo } from "../helpers/videoManipulation";

import { normalizeOptions } from "../helpers/common/formatters";

let ffmpeg;

export const useVideoCapture = (node, trigger, options) => {
	const globalOptions = useMemo(() => normalizeOptions(options), [options]);

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
			generateFrame();
			return;
		}
	}, [trigger]);

	const generateFrame = async () => {
		const image = await takeScreenshot(node, {
			html2canvas: globalOptions.html2canvas,
			frame: globalOptions.frame,
		});
		const imageObject = addFrame(image, globalOptions.frame);

		return imageObject;
	};

	const addFrame = async (image) => {
		const imageFilePath = await writeImage(image, frames.length, ffmpeg, globalOptions.frame);
		const imageObject = {
			src: image,
			path: imageFilePath,
		};

		setFrames((frames) => [...frames, imageObject]);

		return imageObject;
	};

	const generateVideo = async () => {
		stopWatching();

		const videoSource = await stitchFramesToVideo(
			ffmpeg,
			frames.map((frame) => frame.path),
			{
				frame: globalOptions.frame,
				video: globalOptions.video,
			},
		);

		setVideoSource(videoSource);
		return videoSource;
	};

	const exportVideo = (videoSource, exportOptions) => {
		downloadVideo(videoSource, exportOptions);
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
