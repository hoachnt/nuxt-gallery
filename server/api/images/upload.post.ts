import { createDirectus, rest, uploadFiles } from "@directus/sdk";

export default eventHandler(async (event) => {
	await requireUserSession(event);

	const formDataBody = await readMultipartFormData(event);

	if (typeof process.env.NUXT_PUBLIC_DIRECTUS_URL !== "string") {
		throw createError({
			statusCode: 500,
			statusMessage: "DIRECTUS_URL is not defined",
		});
	}

	const directus = createDirectus(process.env.NUXT_PUBLIC_DIRECTUS_URL).with(
		rest()
	);
	const formData = new FormData();

	formDataBody?.forEach((value) => {
		if (value.name && value.data) {
			if (value.name === "file") {
				const blob = new Blob([value.data], { type: value.type });
				formData.append(value.name, blob);
			} else {
				formData.append(value.name, value.data.toString());
			}
		}
	});

	const result = await directus.request(uploadFiles(formData));

	return result;
});
