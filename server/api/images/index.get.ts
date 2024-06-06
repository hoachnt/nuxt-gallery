import { createDirectus, rest, readFiles } from "@directus/sdk";

export default eventHandler(async () => {
  const directus = createDirectus("https://directus.hoachnt.com/").with(rest());
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
