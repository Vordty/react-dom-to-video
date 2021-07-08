export const generateVideo = async (ffmpeg, images, options) => {
	const { prefix = "frame", type = "png" } = options;

	if (!ffmpeg.isLoaded()) await ffmpeg.load();

	// run image array buffers to a video conversion
	await ffmpeg.run(
		"-framerate",
		"1",
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
		"abcd.webm",
	);

	const outputVideoBinary = ffmpeg.FS("readFile", "abcd.webm");

	images.forEach((filename) => {
		ffmpeg.FS("unlink", filename);
	});
	ffmpeg.FS("unlink", "abcd.webm");

	const videoSource = URL.createObjectURL(
		new Blob([outputVideoBinary.buffer], { type: "video/webm" }),
	);

	const linkElement = document.createElement("a");
	linkElement.href = videoSource;
	linkElement.download = "abcd.webm";
	linkElement.click();
};
