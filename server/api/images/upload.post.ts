import { createDirectus, rest, uploadFiles } from "@directus/sdk";

export default eventHandler(async (event) => {
  await requireUserSession(event);

  const formDataBody = await readMultipartFormData(event);
  const directus = createDirectus("https://directus.hoachnt.com").with(rest());
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
