import { DEFAULT_OPTIONS } from "../constants";

export const normalizeOptions = (options) => {
	const outputOptions = {};

	outputOptions.frame = {
		...DEFAULT_OPTIONS.frame,
		...options.frame,
	};

	outputOptions.html2canvas = {
		...DEFAULT_OPTIONS.html2canvas,
		...options.html2canvas,
	};

	outputOptions.video = {
		...DEFAULT_OPTIONS.video,
		...options.video,
	};

	return outputOptions;
};
