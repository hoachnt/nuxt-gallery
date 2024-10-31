import { createDirectus, rest, deleteFile } from "@directus/sdk";

export default defineEventHandler(async (event) => {
	await requireUserSession(event);

	if (typeof process.env.NUXT_PUBLIC_DIRECTUS_URL !== "string") {
		throw createError({
			statusCode: 500,
			statusMessage: "DIRECTUS_URL is not defined",
		});
	}

	const directus = createDirectus(process.env.NUXT_PUBLIC_DIRECTUS_URL).with(
		rest()
	);
	const id = getRouterParam(event, "id");

	if (id === undefined) return;

	const result = await directus.request(deleteFile(id));

	return result;
});
