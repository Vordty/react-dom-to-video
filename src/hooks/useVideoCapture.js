import { useState, useEffect, useMemo } from "react";
import { createFFmpeg } from "@ffmpeg/ffmpeg";

import { takeScreenshot } from "../helpers/takeScreenshot";
import { writeImage } from "../helpers/writeImage";
import { stitchFramesToVideo, downloadVideo } from "../helpers/videoManipulation";

import { normalizeOptions } from "../helpers/formatters";
import { FFMPEG_CORE_PATH } from "../constants";

let ffmpeg;

const useVideoCapture = (node, trigger, options = {}) => {
	const globalOptions = useMemo(() => normalizeOptions(options), [options]);

	const [frames, setFrames] = useState([]);
	const [videoSource, setVideoSource] = useState();
	const [isWatching, setIsWatching] = useState(false);

	useEffect(() => {
		const setupFFMPEG = async () => {
			ffmpeg = createFFmpeg({
				corePath: FFMPEG_CORE_PATH,
				log: false,
			});
			if (!ffmpeg?.isLoaded()) await ffmpeg.load();
		};

		setupFFMPEG();
	}, []);

	useEffect(() => {
		if (isWatching) {
			generateFrame();
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
		if (!image) {
			stopWatching();
			throw new Error("Missing image to add as a frame.");
		}

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

		if (!(frames?.length > 0)) {
			stopWatching();
			throw new Error("Missing frames to begin conversion.");
		}

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
		if (!videoSource) {
			stopWatching();
			throw new Error("Video source missing to export.");
		}

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

export default useVideoCapture;
