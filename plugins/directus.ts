import {
  createDirectus,
  rest,
  readItem,
  readItems,
  readFolder,
  readFolders,
  readFiles,
} from "@directus/sdk";
const directus = createDirectus("https://directus.hoachnt.com/").with(rest());

export default defineNuxtPlugin(() => {
  return {
    provide: {
      directus: {
        directus,
        readItem,
        readItems,
        readFolder,
        readFolders,
        readFiles,
      },
    },
  };
});
