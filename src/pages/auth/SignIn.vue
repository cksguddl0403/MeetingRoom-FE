<script setup lang="ts">
import { ref } from "vue";
import { Eye, EyeOff } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const form = ref({
  company: "",
  userId: "",
  password: "",
});

const showPassword = ref(false);
</script>

<template>
  <div class="min-h-screen px-6 py-10">
    <section
      class="mx-auto w-full max-w-xl rounded-2xl bg-card p-8 text-card-foreground shadow-2xl"
    >
      <h1 class="mb-8 text-4xl font-extrabold tracking-tight">로그인</h1>

      <form class="space-y-5" @submit.prevent>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">회사</label>
          <select
            v-model="form.company"
            class="h-12 w-full rounded-md border border-input bg-background px-4 text-base text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          >
            <option disabled value="">회사를 선택하세요</option>
            <option value="alpha">알파 주식회사</option>
            <option value="beta">베타 테크</option>
            <option value="gamma">감마 솔루션</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">아이디</label>
          <input
            v-model="form.userId"
            type="text"
            placeholder="아이디를 입력하세요"
            class="h-12 w-full rounded-md border border-input bg-background px-4 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">비밀번호</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="비밀번호를 입력하세요"
              class="h-12 w-full rounded-md border border-input bg-background px-4 pr-12 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              @click="showPassword = !showPassword"
            >
              <Eye v-if="!showPassword" class="size-5" />
              <EyeOff v-else class="size-5" />
            </button>
          </div>
        </div>

        <div class="pt-3">
          <Button
            type="submit"
            class="h-12 w-full bg-indigo-500 text-base font-semibold text-white hover:bg-indigo-500/90"
          >
            로그인
          </Button>
        </div>
      </form>
    </section>
  </div>
</template>
