<script setup lang="ts">
import { ref } from "vue"
import { RouterLink } from "vue-router"
import { Upload, UserRound } from "lucide-vue-next"
import { Button } from "@/components/ui/button"

const nickname = ref("")
</script>

<template>
  <section class="mx-auto w-full max-w-2xl py-8">
    <form
      class="space-y-8 rounded-2xl border bg-card p-8 text-card-foreground shadow-sm"
      @submit.prevent
    >
      <header class="space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight">프로필 수정</h1>
        <p class="text-sm text-muted-foreground">
          프로필 이미지와 닉네임을 수정할 수 있습니다.
        </p>
      </header>

      <div class="grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
        <div class="space-y-3">
          <p class="text-sm font-medium">프로필 이미지</p>
          <div
            class="mx-auto flex size-44 items-center justify-center rounded-full border border-border bg-muted/40"
          >
            <UserRound class="size-16 text-muted-foreground" />
          </div>
          <Button
            type="button"
            variant="outline"
            class="w-full"
          >
            <Upload class="mr-2 size-4" />
            파일 추가
          </Button>
        </div>

        <div class="space-y-2">
          <label for="nickname" class="block text-sm font-medium">닉네임</label>
          <input
            id="nickname"
            v-model="nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
            class="h-11 w-full rounded-md border bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          />
          <p class="text-xs text-muted-foreground">
            변경된 닉네임은 문의 작성자 정보 및 활동 내역에 표시됩니다.
          </p>
        </div>
      </div>

      <div class="flex justify-end gap-2 border-t pt-6">
        <Button type="button" variant="outline" as-child>
          <RouterLink to="/mypage">취소</RouterLink>
        </Button>
        <Button type="submit">변경</Button>
      </div>
    </form>
  </section>
</template>
