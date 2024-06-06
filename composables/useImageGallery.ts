import type { UseSwipeDirection } from "@vueuse/core";

export function useImageGallery() {
  interface IImage {
    id: string;
    title: string;
    type: string;
    folder: null | string;
  }

  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig();
  const imageToDownload = ref<HTMLImageElement>();
  const router = useRouter();
  const route = useRoute();

  const currentIndex: ComputedRef<number> = computed(() =>
    nuxtApp.$file.images.value!.findIndex(
      (image: IImage) => image.id === route.params.slug[0]
    )
  );
  const isFirstImg: ComputedRef<boolean> = computed(
    () => nuxtApp.$file.images.value![0].id === route.params.slug[0]
  );
  const isLastImg: ComputedRef<boolean> = computed(
    () =>
      nuxtApp.$file.images.value![nuxtApp.$file.images.value!.length - 1].id ===
      route.params.slug[0]
  );

  const initSwipe = (el: Ref<HTMLImageElement | null>) => {
    useSwipe(el, {
      passive: false,

      onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection) {
        if (direction === "left") {
          if (isLastImg.value) router.push("/");
          else
            router.push(
              `/detail/${
                nuxtApp.$file.images.value![currentIndex.value + 1].id
              }`
            );
        } else {
          if (isFirstImg.value) router.push("/");
          else
            router.push(
              `/detail/${
                nuxtApp.$file.images.value![currentIndex.value - 1].id
              }`
            );
        }
      },
    });
  };

  const applyFilters = async (
    poster: HTMLImageElement,
    contrast: number,
    blur: number,
    invert: number,
    saturate: number,
    hueRotate: number,
    sepia: number
  ) => {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");

    canvas.width = poster?.naturalWidth;
    canvas.height = poster?.naturalHeight;

    context!.filter = `contrast(${contrast}%) blur(${blur}px) invert(${invert}%)
      saturate(${saturate}%) hue-rotate(${hueRotate}deg) sepia(${sepia}%)`;

    context!.drawImage(poster!, 0, 0, canvas.width, canvas.height);

    const modifiedImage = new Image();

    modifiedImage.src = canvas.toDataURL("image/png");
    imageToDownload.value = modifiedImage;

    return imageToDownload;
  };

  const downloadImage = async (
    filename: string,
    poster: HTMLImageElement,
    contrast: number,
    blur: number,
    invert: number,
    saturate: number,
    hueRotate: number,
    sepia: number
  ) => {
    await applyFilters(
      poster,
      contrast,
      blur,
      invert,
      saturate,
      hueRotate,
      sepia
    );

    if (!imageToDownload.value) {
      return;
    }

    await useFetch(imageToDownload.value.src, {
      baseURL: `${config.public.imageApi}/ipx/_/tmdb/`,
    }).then((response) => {
      const blob = response.data.value as Blob;
      const url: string = URL.createObjectURL(blob);
      const link: HTMLAnchorElement = document.createElement("a");

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.click();
    });
  };

  const magnifierImage = (
    e: MouseEvent,
    containerEl: HTMLElement,
    imageEl: HTMLImageElement,
    magnifierEl: HTMLElement,
    zoomFactor: number = 2
  ) => {
    if (magnifierEl.style.filter !== imageEl.style.filter)
      magnifierEl.style.filter = imageEl.style.filter;

    const imageRect = imageEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    const x = e.pageX - containerRect.left;
    const y = e.pageY - containerRect.top;

    const imgWidth = imageRect.width;
    const imgHeight = imageRect.height;

    const zoomedWidth = imgWidth * (zoomFactor === 1 ? 1.5 : zoomFactor);
    const zoomedHeight = imgHeight * (zoomFactor === 1 ? 1.5 : zoomFactor);

    let xperc = (x / imgWidth) * 100;
    let yperc = (y / imgHeight) * 100;

    if (x > 0.01 * imgWidth) xperc += 0.15 * xperc;

    if (y >= 0.01 * imgHeight) yperc += 0.15 * yperc;

    magnifierEl.style.backgroundSize = `${zoomedWidth}px ${zoomedHeight}px`;
    magnifierEl.style.backgroundPositionX = `${xperc - 9}%`;
    magnifierEl.style.backgroundPositionY = `${yperc - 9}%`;
    magnifierEl.style.left = `${x - 50}px`;
    magnifierEl.style.top = `${y - 50}px`;
    magnifierEl.style.zIndex = "9999";
  };

  return {
    downloadImage,
    applyFilters,
    magnifierImage,
    initSwipe,
    currentIndex,
    isFirstImg,
    isLastImg,
  };
}
