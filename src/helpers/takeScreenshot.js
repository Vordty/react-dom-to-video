import html2canvas from "html2canvas";

export const takeScreenshot = (node, options) => {
	if (!options?.html2canvas) options.html2canvas = {};
	if (!options?.export) options.export = {};

	if (!node) {
		throw new Error("Provided node missing.");
	}

	return html2canvas(node, {
		...options?.html2canvas,
	})
		.then((canvas) => {
			const croppedCanvas = document.createElement("canvas");
			const croppedCanvasContext = croppedCanvas.getContext("2d");

			const cropPositionTop = 0;
			const cropPositionLeft = 0;
			const cropWidth = canvas.width;
			const cropHeight = canvas.height;

			croppedCanvas.width = cropWidth;
			croppedCanvas.height = cropHeight;

			croppedCanvasContext.drawImage(canvas, cropPositionLeft, cropPositionTop);

			const { type = "image/png", quality = 1 } = options?.export;

			const base64Image = croppedCanvas.toDataURL(type, quality);

			return base64Image;
		})
		.catch((error) => console.log(error));
};
