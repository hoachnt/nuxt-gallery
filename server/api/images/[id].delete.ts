import { createDirectus, rest, deleteFile } from "@directus/sdk";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const directus = createDirectus("https://directus.hoachnt.com").with(rest());
  const id = getRouterParam(event, "id");

  if (id === undefined) return;

  const result = await directus.request(deleteFile(id));

  return result;
});
