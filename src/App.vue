<script setup lang="ts">
import type { Component } from "vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import {
  Bell,
  Building2,
  CircleHelp,
  LayoutGrid,
  LogOut,
  UserRound,
} from "lucide-vue-next";

interface NavItem {
  label: string;
  to: string;
  icon: Component;
}

const route = useRoute();

const primaryNav: NavItem[] = [
  { label: "대시보드", to: "/", icon: LayoutGrid },
  { label: "회의실", to: "/rooms", icon: Building2 },
];

const secondaryNav: NavItem[] = [
  { label: "공지사항", to: "/notices", icon: Bell },
  { label: "문의", to: "/inquiries", icon: CircleHelp },
];

const isActive = computed(() => {
  return (path: string) => {
    if (path === "/") {
      return route.path === path;
    }
    return route.path.startsWith(path);
  };
});
</script>

<template>
  <div class="min-h-screen bg-[#fbfbfc]">
    <header class="flex h-20 items-center justify-between px-14">
      <h1 class="text-4xl font-semibold leading-none tracking-tight">
        MeetingRoom
      </h1>
      <div class="flex items-center gap-8 text-lg text-foreground/80">
        <RouterLink
          to="/mypage"
          class="inline-flex items-center gap-2 hover:text-foreground"
        >
          <UserRound class="size-5" />
          <span>마이페이지</span>
        </RouterLink>
        <button
          type="button"
          class="inline-flex items-center gap-2 hover:text-foreground"
        >
          <LogOut class="size-5" />
          <span>로그아웃</span>
        </button>
      </div>
    </header>

    <div class="flex">
      <aside class="w-72 px-4 pt-10">
        <nav class="space-y-6">
          <ul class="space-y-2">
            <li v-for="item in primaryNav" :key="item.to">
              <RouterLink
                :to="item.to"
                class="flex items-center gap-3 rounded-lg px-5 py-3 text-lg font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                :class="isActive(item.to) ? 'text-[#5750d8]' : ''"
              >
                <component :is="item.icon" class="size-5" />
                <span>{{ item.label }}</span>
              </RouterLink>
            </li>
          </ul>

          <div class="border-t" />

          <ul class="space-y-2">
            <li v-for="item in secondaryNav" :key="item.to">
              <RouterLink
                :to="item.to"
                class="flex items-center gap-3 rounded-lg px-5 py-3 text-lg font-medium text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                :class="isActive(item.to) ? 'text-[#5750d8]' : ''"
              >
                <component :is="item.icon" class="size-5" />
                <span>{{ item.label }}</span>
              </RouterLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main class="flex-1 p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
