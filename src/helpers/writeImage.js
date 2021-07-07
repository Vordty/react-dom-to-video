export const writeImage = async (image, index, ffmpeg, options) => {
	console.log("writeImage options", options);
	const { IMG_PREFIX = "frame", IMG_TYPE = "png" } = options;

	if (!ffmpeg.isLoaded()) await ffmpeg.load();

	const arrayBuffer = convertDataURIToBinary(image);

	const filename = `${IMG_PREFIX}-${index.toString().padStart(3, "0")}.${IMG_TYPE}`;
	await ffmpeg.FS(
		"writeFile",
		`${IMG_PREFIX}-${index.toString().padStart(3, "0")}.${IMG_TYPE}`,
		arrayBuffer,
	);

	return filename;
};

const BASE64_MARKER = ";base64,";

export const convertDataURIToBinary = (dataURI) => {
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
