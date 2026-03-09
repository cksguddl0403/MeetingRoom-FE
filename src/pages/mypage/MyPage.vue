<script setup lang="ts">
import { RouterLink } from "vue-router"
import { Button } from "@/components/ui/button"
</script>

<template>
  <section class="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-3xl items-center justify-center px-4">
    <div class="w-full rounded-2xl border bg-card p-8 shadow-sm">
      <header class="text-center">
        <h1 class="text-3xl font-semibold tracking-tight">마이페이지</h1>
        <p class="mt-2 text-sm text-muted-foreground">
          프로필과 회원 정보를 원하는 방식으로 수정할 수 있습니다.
        </p>
      </header>

      <div class="mt-8 grid gap-4 sm:grid-cols-2">
        <article class="rounded-xl border bg-background p-5">
          <h2 class="text-base font-semibold">프로필 수정</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            프로필 이미지와 닉네임을 변경합니다.
          </p>
          <RouterLink to="/mypage/profile" class="mt-4 block">
            <Button class="w-full">프로필 수정으로 이동</Button>
          </RouterLink>
        </article>

        <article class="rounded-xl border bg-background p-5">
          <h2 class="text-base font-semibold">회원 정보 수정</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            이름, 이메일, 비밀번호를 변경합니다.
          </p>
          <RouterLink to="/mypage/user" class="mt-4 block">
            <Button variant="outline" class="w-full">회원 정보 수정으로 이동</Button>
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>
