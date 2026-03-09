<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";

const form = ref({
  loginId: "tanine",
  name: "김탄인",
  email: "tanine@example.com",
  currentPassword: "",
  newPassword: "",
});
</script>

<template>
  <section
    class="mx-auto w-full max-w-2xl space-y-6 rounded-lg border bg-card p-6 shadow-sm"
  >
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold tracking-tight">회원 정보 수정</h1>
      <p class="text-sm text-muted-foreground">
        기본 정보와 비밀번호를 수정할 수 있습니다.
      </p>
    </header>

    <div class="grid gap-4">
      <label class="space-y-1">
        <span class="text-sm font-medium">로그인 아이디</span>
        <input
          :value="form.loginId"
          type="text"
          readonly
          class="h-10 w-full cursor-not-allowed rounded-md border bg-muted px-3 text-sm text-muted-foreground"
        />
      </label>

      <label class="space-y-1">
        <span class="text-sm font-medium">이름</span>
        <input
          v-model="form.name"
          type="text"
          class="h-10 w-full rounded-md border bg-background px-3 text-sm"
          placeholder="이름"
        />
      </label>

      <label class="space-y-1">
        <span class="text-sm font-medium">이메일</span>
        <input
          v-model="form.email"
          type="email"
          class="h-10 w-full rounded-md border bg-background px-3 text-sm"
          placeholder="이메일"
        />
      </label>
    </div>

    <div class="space-y-4 rounded-md border bg-background p-4">
      <h2 class="text-base font-semibold">비밀번호 변경</h2>
      <p class="text-sm text-muted-foreground">
        새 비밀번호를 설정하려면 기존 비밀번호를 함께 입력해야 합니다.
      </p>

      <div class="grid gap-4">
        <label class="space-y-1">
          <span class="text-sm font-medium">기존 비밀번호</span>
          <input
            v-model="form.currentPassword"
            type="password"
            class="h-10 w-full rounded-md border bg-card px-3 text-sm"
            placeholder="기존 비밀번호"
          />
        </label>

        <label class="space-y-1">
          <span class="text-sm font-medium">새 비밀번호</span>
          <input
            v-model="form.newPassword"
            type="password"
            class="h-10 w-full rounded-md border bg-card px-3 text-sm"
            placeholder="새 비밀번호"
          />
        </label>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <Button variant="outline">
        <RouterLink to="/mypage">취소</RouterLink>
      </Button>
      <Button>변경사항 저장</Button>
    </div>
  </section>
</template>
