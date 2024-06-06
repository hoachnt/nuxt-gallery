export default defineNuxtPlugin(() => {
  const images = ref();

  async function getImages() {
    const { data: files } = await useFetch("/api/images");

    images.value = files.value;
  }

  return {
    provide: {
      file: {
        getImages,
        images,
      },
    },
  };
});
