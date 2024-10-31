<template>
	<div>
		<section
			v-if="images"
			class="relative gap-[22px] p-4"
			ref="dropZoneRef"
		>
			<UModal
				v-model="isOpen"
				class="flex items-center justify-center relative"
				:ui="{
					container: 'items-center',
				}"
			>
				<LoginForm
					class="z-50 bg-gray-800 rounded-md"
					@close-login="isOpen = false"
				/>
				<UButton
					icon="i-heroicons-x-mark"
					class="absolute right-4 top-4"
					@click="isOpen = false"
				/>
			</UModal>

			<BottomMenu class="bottom-menu">
				<template #logo>
					<img src="/logo.svg" width="29" height="20" />
				</template>
				<template #description>
					<div class="flex gap-x-4 items-center">
						<p
							class="bottom-menu-description text-sm sm:text-base leading-tight sm:leading-normal"
						>
							Media Gallery template
						</p>
						<NuxtLink
							to="https://github.com/hoachnt/nuxt-gallery"
							target="blank"
							class="flex items-center"
						>
							<UIcon
								name="i-simple-icons-github"
								class="w-5 h-5"
							/>
						</NuxtLink>
					</div>
				</template>
				<template #buttons>
					<div class="flex gap-x-2">
						<UButton
							v-if="loggedIn"
							:loading="disconnect"
							icon="i-heroicons-power-20-solid"
							color="red"
							variant="ghost"
							@click="clearSession"
						/>
						<UButton
							v-else
							label="Sign in"
							color="green"
							variant="ghost"
							aria-label="Sign in"
							class="mr-4 sm:mr-0"
							@click="isOpen = true"
						/>
					</div>
				</template>
			</BottomMenu>
			<div
				class="w-full"
				:class="{ 'masonry-container': images && images.length }"
			>
				<div v-if="loggedIn">
					<input
						ref="fileInput"
						class="hidden"
						type="file"
						accept="image/*"
						@change="fileSelection"
					/>
					<UploadButton
						:uploading="uploadingImg"
						type="submit"
						class="mb-6"
						:is-over-drop-zone="isOverDropZone"
						@click="openFilePicker"
					/>
				</div>
				<div
					v-else
					class="text-2xl text-white flex flex-col gap-y-6 items-center justify-center h-full w-full pb-8"
				>
					<h1 class="font-medium text-5xl">
						Welcome to image gallery
					</h1>
					<p class="text-gray-400">
						You must be logged in to start uploading images
					</p>
				</div>
				<ul
					v-if="images && images.length"
					class="grid grid-cols-1 gap-6"
				>
					<li
						v-for="image in images"
						ref="mansoryItem"
						:key="image.id"
						class="relative w-full group masonry-item"
					>
						<UButton
							v-if="loggedIn"
							:loading="deletingImg === image.id"
							color="white"
							icon="i-heroicons-trash-20-solid"
							class="absolute top-4 right-4 z-[9999] opacity-0 group-hover:opacity-100"
							@click="deleteFile(image.id)"
						/>
						<NuxtLink
							:to="`/detail/${image.id}`"
							@click="active = image.id"
						>
							<NuxtImg
								v-if="image"
								provider="directus"
								width="527"
								height="430"
								format="webp"
								loading="lazy"
								:placeholder="[50, 25, 75, 5]"
								:src="image.id"
								:class="{ imageEl: image.id === active }"
								class="h-auto w-full max-h-[430px] rounded-md transition-all duration-200 border-image brightness-[.8] hover:brightness-100 will-change-[filter] object-cover"
							/>
						</NuxtLink>
					</li>
				</ul>
			</div>
		</section>
		<div v-else class="flex items-center space-x-4 z-10">
			<USkeleton
				class="h-12 w-12 bg-primary-500"
				:ui="{ rounded: 'rounded-full' }"
			/>
			<div class="space-y-2">
				<USkeleton class="h-4 w-[250px] bg-primary-500" />
				<USkeleton class="h-4 w-[200px] bg-primary-500" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const directusUrl = runtimeConfig.public.directus.url;

const dropZoneRef = ref<HTMLElement>();
const fileInput = ref<HTMLInputElement>();
const mansoryItem = ref<Array<HTMLElement>>([]);
const active = useState();
const disconnect = ref(false);
const isOpen = ref(false);
const uploadingImg = ref(false);
const deletingImg = ref("");

const { uploadImage, deleteImage, images } = useFile();
const { loggedIn, clear } = useUserSession();
const toast = useToast();

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);

function openFilePicker() {
	fileInput.value?.click();
}

async function fileSelection(event: Event) {
	const target = event.target as HTMLInputElement;
	target.files?.[0] && (await uploadFile(target.files[0]));
}

async function onDrop(files: File[] | null) {
	files && (await uploadFile(files[0]));
}

async function clearSession() {
	disconnect.value = true;

	await clear().finally(() => (disconnect.value = false));
}
async function uploadFile(file: File) {
	uploadingImg.value = true;

	await uploadImage(file)
		.catch(() =>
			toast.add({
				title: "An error occured",
				description: "Please try again",
				color: "red",
			})
		)
		.finally(() => (uploadingImg.value = false));
}
async function deleteFile(id: string) {
	deletingImg.value = id;

	await deleteImage(id)
		.catch(() =>
			toast.add({
				title: "An error occured",
				description: "Please try again",
				color: "red",
			})
		)
		.finally(() => (deletingImg.value = ""));
}
</script>

<style lang="postcss">
@media (min-width: 768px) {
	.imageEl {
		view-transition-name: vtn-image;
	}
}

@media screen and (min-width: 1024px) {
	.masonry-container {
		column-count: 3;
		column-gap: 20px;
		column-fill: balance;
		margin: 20px auto 0;
		padding: 2rem;
	}

	.masonry-item,
	.upload {
		display: inline-block;
		-webkit-column-break-inside: avoid;
		page-break-inside: avoid;
		break-inside: avoid;
		width: 100%;
	}
}
</style>
