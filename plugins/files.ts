import { createDirectus, rest, uploadFiles } from "@directus/sdk";

export default defineNuxtPlugin(() => {
	const images = ref();
	const router = useRouter();
	const toast = useToast();

	async function getImages() {
		const { data: files, error } = await useFetch("/api/images");

		if (error.value !== null) {
			toast.add({
				color: "red",
				title: "Failed to get images",
				description: error.value?.message,
			});
		}

		images.value = files.value;
	}

	async function uploadImage(image: File, filter: boolean = false) {
		const folder_id = "ad18f3f7-5cc6-4ba8-9450-cc955472ef4c";
		const formData = new FormData();

		formData.append("folder", folder_id);
		formData.append("file", image);

		await $fetch(`/api/images/upload`, {
			method: "POST",
			body: formData,
		}).catch((err) =>
			toast.add({
				color: "red",
				title: "Failed to upload image",
				description: err.data?.message || err.message,
			})
		);

		getImages();

		if (filter) {
			router.push("/");
		}
	}

	async function deleteImage(id: string) {
		await $fetch(`/api/images/${id}`, { method: "DELETE" });

		getImages();
	}

	return {
		provide: {
			file: {
				getImages,
				uploadImage,
				deleteImage,
				images,
			},
		},
	};
});
