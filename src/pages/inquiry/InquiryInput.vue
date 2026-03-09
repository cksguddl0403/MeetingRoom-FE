<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { Button } from "@/components/ui/button";

type InquiryCategory = "예약" | "비품" | "계정" | "시스템" | "기타";

const categories: InquiryCategory[] = ["예약", "비품", "계정", "시스템", "기타"];
interface AttachedImage {
  file: File;
  previewUrl: string;
}

const form = ref({
  category: "예약" as InquiryCategory,
  title: "",
  content: "",
  isPublic: true,
});
const attachedImages = ref<AttachedImage[]>([]);

const titleLength = computed(() => form.value.title.length);
const contentLength = computed(() => form.value.content.length);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files ? Array.from(target.files) : [];

  attachedImages.value.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  attachedImages.value = files
    .filter((file) => file.type.startsWith("image/"))
    .map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
};

const removeAttachedFile = (index: number) => {
  const target = attachedImages.value[index];
  if (target) {
    URL.revokeObjectURL(target.previewUrl);
  }

  attachedImages.value = attachedImages.value.filter((_, fileIndex) => fileIndex !== index);
};

onUnmounted(() => {
  attachedImages.value.forEach((image) => URL.revokeObjectURL(image.previewUrl));
});
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-5">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">문의 등록</h1>
      <p class="text-sm text-muted-foreground">
        문의 내용을 입력해 주시면 담당자가 확인 후 답변드립니다.
      </p>
    </header>

    <form class="space-y-5 rounded-lg border bg-card p-5 shadow-sm" @submit.prevent>
      <div class="grid gap-5 md:grid-cols-[220px_1fr]">
        <div class="space-y-2">
          <label class="text-sm font-medium">카테고리</label>
          <select
            v-model="form.category"
            class="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium">제목</label>
            <span class="text-xs text-muted-foreground">{{ titleLength }}/80</span>
          </div>
          <input
            v-model="form.title"
            type="text"
            maxlength="80"
            placeholder="문의 제목을 입력하세요"
            class="h-10 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium">내용</label>
          <span class="text-xs text-muted-foreground">{{ contentLength }}/1000</span>
        </div>
        <textarea
          v-model="form.content"
          rows="10"
          maxlength="1000"
          placeholder="문의 내용을 상세히 입력해 주세요."
          class="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div class="space-y-3 rounded-md border bg-background p-4">
        <div class="flex items-center justify-between">
          <label for="inquiry-files" class="text-sm font-medium">이미지 첨부</label>
          <span class="text-xs text-muted-foreground">여러 이미지 선택 가능</span>
        </div>
        <input
          id="inquiry-files"
          type="file"
          multiple
          accept="image/*"
          class="block w-full cursor-pointer rounded-md border border-dashed bg-muted/30 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
          @change="handleFileChange"
        />
        <p class="text-xs text-muted-foreground">
          JPG, PNG, WEBP 등 이미지 파일만 업로드할 수 있습니다.
        </p>

        <div v-if="attachedImages.length > 0" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(image, index) in attachedImages"
            :key="`${image.file.name}-${index}`"
            class="overflow-hidden rounded-md border bg-card"
          >
            <img
              :src="image.previewUrl"
              :alt="image.file.name"
              class="h-36 w-full object-cover"
            />
            <div class="flex items-center justify-between gap-2 border-t p-2">
              <p class="truncate text-xs text-muted-foreground">{{ image.file.name }}</p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                class="h-7 px-2 text-muted-foreground hover:text-foreground"
                @click="removeAttachedFile(index)"
              >
                삭제
              </Button>
            </div>
          </article>
        </div>
      </div>

      <div class="rounded-md border bg-muted/20 p-3">
        <label class="inline-flex items-center gap-2 text-sm">
          <input v-model="form.isPublic" type="checkbox" class="size-4" />
          공개 문의로 등록합니다.
        </label>
        <p class="mt-1 text-xs text-muted-foreground">
          비공개로 등록하면 작성자와 관리자만 문의 내용을 확인할 수 있습니다.
        </p>
      </div>

      <div class="flex items-center justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" as-child>
          <RouterLink to="/inquiries">취소</RouterLink>
        </Button>
        <Button type="submit">문의 등록</Button>
      </div>
    </form>
  </section>
</template>
