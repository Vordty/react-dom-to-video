export const writeImage = async (image, index, ffmpeg, options) => {
	console.log("writeImage options", options);
	const { prefix = "frame", type = "png" } = options;

	if (!ffmpeg.isLoaded()) await ffmpeg.load();

	const arrayBuffer = convertDataURIToBinary(image);

	const filename = `${prefix}-${index.toString().padStart(3, "0")}.${type}`;
	await ffmpeg.FS(
		"writeFile",
		`${prefix}-${index.toString().padStart(3, "0")}.${type}`,
		arrayBuffer,
	);

	return filename;
};

const BASE64_MARKER = ";base64,";

const convertDataURIToBinary = (dataURI) => {
	const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	const base64 = dataURI.substring(base64Index);
	const raw = window.atob(base64);
	const rawLength = raw.length;
	const array = new Uint8Array(new ArrayBuffer(rawLength));

	for (let i = 0; i < rawLength; i++) {
		array[i] = raw.charCodeAt(i);
	}

	return array;
};
