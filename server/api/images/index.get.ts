import { createDirectus, rest, readFiles } from "@directus/sdk";

export default eventHandler(async () => {
	if (typeof process.env.NUXT_PUBLIC_DIRECTUS_URL !== "string") {
		throw createError({
			statusCode: 500,
			statusMessage: "DIRECTUS_URL is not defined",
		});
	}

	const directus = createDirectus(process.env.NUXT_PUBLIC_DIRECTUS_URL).with(
		rest()
	);
	const folder_id = "ad18f3f7-5cc6-4ba8-9450-cc955472ef4c";

	const images = await directus.request(
		readFiles({
			filter: {
				folder: {
					_eq: folder_id,
				},
			},
		})
	);

	return images;
});
