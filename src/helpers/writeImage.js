export const writeImage = async (image, index, ffmpeg, options) => {
	const { filename = "frame", filetype = "png" } = options;

	if (!ffmpeg.isLoaded()) await ffmpeg.load();

	const arrayBuffer = convertDataURIToBinary(image);

	const filepath = `${filename}-${index.toString().padStart(7, "0")}.${filetype}`;
	await ffmpeg.FS("writeFile", filepath, arrayBuffer);

	return filepath;
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
