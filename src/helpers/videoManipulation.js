export const stitchFramesToVideo = async (ffmpeg, images, options) => {
	const { prefix = "frame", type = "png" } = options;

	if (!ffmpeg.isLoaded()) await ffmpeg.load();

	// run image array buffers to a video conversion
	await ffmpeg.run(
		"-framerate",
		`${framerate}`,
		"-f",
		"image2",
		"-i",
		`${prefix}-%03d.${type}`,
		"-vcodec",
		"libvpx-vp9",
		"-b:v",
		"0",
		"-crf",
		"15",
		"-row-mt",
		"1",
		`${filename}.webm`,
	);

	const outputVideoBinary = ffmpeg.FS("readFile", `${filename}.webm`);

	images.forEach((filename) => {
		ffmpeg.FS("unlink", filename);
	});
	ffmpeg.FS("unlink", `${filename}.webm`);

	const videoSource = URL.createObjectURL(
		new Blob([outputVideoBinary.buffer], { type: "video/webm" }),
	);

	return videoSource;
};

export const downloadVideo = (videoSource, options) => {
	const { filename } = options;

	const linkElement = document.createElement("a");
	linkElement.href = videoSource;
	linkElement.download = `${filename}.webm`;
	linkElement.click();
};
