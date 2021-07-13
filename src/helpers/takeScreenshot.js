import html2canvas from "html2canvas";

export const takeScreenshot = async (node, options) => {
	if (!node) {
		throw new Error("Provided node missing.");
	}

	try {
		const canvas = await html2canvas(node, {
			...options?.html2canvas,
		});

		const croppedCanvas = document.createElement("canvas");
		const croppedCanvasContext = croppedCanvas.getContext("2d");

		const cropPositionTop = 0;
		const cropPositionLeft = 0;
		const cropWidth = canvas.width;
		const cropHeight = canvas.height;

		croppedCanvas.width = cropWidth;
		croppedCanvas.height = cropHeight;

		croppedCanvasContext.drawImage(canvas, cropPositionLeft, cropPositionTop);

		const { type = "image/png", quality = 1 } = options?.frame;

		const base64Image = croppedCanvas.toDataURL(type, quality);

		return base64Image;
	} catch (error) {
		console.error(error);
	}
};
