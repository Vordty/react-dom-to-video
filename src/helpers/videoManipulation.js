import { DEFAULT_OPTIONS } from "../constants";

export const stitchFramesToVideo = async (ffmpeg, frames, options) => {
	const { framerate, filename, filetype, mime } = options.video;
	const { filename: frameFilename, filetype: frameFiletype } = options.frame;

	try {
		if (!ffmpeg.isLoaded()) await ffmpeg.load();

		await ffmpeg.run(
			"-framerate",
			`${framerate}`,
			"-f",
			"image2",
			"-i",
			`${frameFilename}-%07d.${frameFiletype}`,
			"-vcodec",
			"libvpx-vp9",
			"-b:v",
			"0",
			"-crf",
			"15",
			"-row-mt",
			"1",
			`${filename}.${filetype}`,
		);

		const outputVideoBinary = ffmpeg.FS("readFile", `${filename}.${filetype}`);

		ffmpeg.FS("unlink", `${filename}.${filetype}`);

		const videoSource = URL.createObjectURL(
			new Blob([outputVideoBinary.buffer], { type: mime }),
		);

		return videoSource;
	} catch (error) {
		console.error(error);
	}
};

export const downloadVideo = (videoSource, options = {}) => {
	const { filename = DEFAULT_OPTIONS.video.filename, filetype = DEFAULT_OPTIONS.video.filetype } =
		options;

	const linkElement = document.createElement("a");
	linkElement.href = videoSource;
	linkElement.download = `${filename}.${filetype}`;
	linkElement.click();
};
