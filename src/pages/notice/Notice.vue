<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { Button } from "@/components/ui/button";

type NoticeCategory = "일반" | "시스템" | "점검" | "이벤트";

interface NoticeDetail {
  id: number;
  title: string;
  category: NoticeCategory;
  author: string;
  createdAt: string;
  views: number;
  isPinned: boolean;
  content: string[];
}

const notices: NoticeDetail[] = [
  {
    id: 1,
    title: "[중요] 4월 정기 점검 안내",
    category: "점검",
    author: "관리자",
    createdAt: "2026-03-01",
    views: 412,
    isPinned: true,
    content: [
      "안정적인 서비스 제공을 위해 4월 정기 점검이 진행됩니다.",
      "점검 시간 동안 회의실 예약 및 공지 조회 일부 기능이 일시적으로 제한될 수 있습니다.",
      "점검 완료 후 서비스 정상화 여부를 공지사항으로 다시 안내드리겠습니다.",
    ],
  },
  {
    id: 2,
    title: "회의실 예약 정책 변경 안내",
    category: "시스템",
    author: "운영팀",
    createdAt: "2026-02-27",
    views: 289,
    isPinned: true,
    content: [
      "중복 예약 방지를 위해 예약 가능 시간이 일부 조정되었습니다.",
      "기존보다 사전 예약 가능 기간이 단축되며, 당일 예약은 승인 절차가 간소화됩니다.",
      "자세한 정책은 사내 가이드 문서를 참고해 주세요.",
    ],
  },
  {
    id: 3,
    title: "신규 회의실 오픈 안내 (노바 2)",
    category: "일반",
    author: "총무팀",
    createdAt: "2026-02-23",
    views: 154,
    isPinned: false,
    content: [
      "신규 회의실 '노바 2'가 오픈되어 예약 가능합니다.",
      "최대 수용 인원은 8명이며, 화상회의 장비와 대형 모니터가 기본 제공됩니다.",
    ],
  },
  {
    id: 4,
    title: "봄맞이 예약 이벤트 안내",
    category: "이벤트",
    author: "마케팅팀",
    createdAt: "2026-02-21",
    views: 198,
    isPinned: false,
    content: [
      "봄맞이 예약 이벤트 기간 동안 우수 회의 운영팀을 선정합니다.",
      "선정된 팀에는 사내 카페 쿠폰이 제공되며, 자세한 기준은 공지 내용을 확인해 주세요.",
    ],
  },
  {
    id: 5,
    title: "화상회의 장비 사용 가이드 업데이트",
    category: "일반",
    author: "관리자",
    createdAt: "2026-02-18",
    views: 127,
    isPinned: false,
    content: [
      "화상회의 장비 연결 및 테스트 절차를 최신 버전으로 업데이트했습니다.",
      "회의 시작 전 최소 5분 전에 테스트를 권장드립니다.",
    ],
  },
  {
    id: 6,
    title: "일부 회의실 네트워크 장애 복구 완료",
    category: "시스템",
    author: "인프라팀",
    createdAt: "2026-02-16",
    views: 236,
    isPinned: false,
    content: [
      "일부 회의실에서 발생한 네트워크 장애가 모두 복구되었습니다.",
      "동일 이슈 재발 방지를 위해 장비 점검 주기를 강화할 예정입니다.",
    ],
  },
];

const route = useRoute();

const noticeId = computed(() => Number(route.params.id));
const notice = computed(() => notices.find((item) => item.id === noticeId.value));

const categoryBadgeClass = (category: NoticeCategory) => {
  if (category === "점검") return "bg-amber-100 text-amber-700";
  if (category === "시스템") return "bg-blue-100 text-blue-700";
  if (category === "이벤트") return "bg-fuchsia-100 text-fuchsia-700";
  return "bg-zinc-100 text-zinc-700";
};
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-5">
    <header class="flex items-center justify-between gap-3">
      <h1 class="text-2xl font-semibold tracking-tight">공지사항 상세</h1>
      <Button variant="outline" as-child>
        <RouterLink to="/notices">목록으로</RouterLink>
      </Button>
    </header>

    <div v-if="!notice" class="rounded-lg border bg-card p-10 text-center shadow-sm">
      <p class="text-base font-medium">존재하지 않는 공지입니다.</p>
      <p class="mt-1 text-sm text-muted-foreground">목록으로 돌아가 다시 확인해 주세요.</p>
      <Button class="mt-5" as-child>
        <RouterLink to="/notices">공지 목록으로 이동</RouterLink>
      </Button>
    </div>

    <article v-else class="rounded-lg border bg-card p-6 shadow-sm">
      <div class="space-y-4 border-b pb-5">
        <div class="flex flex-wrap items-center gap-2">
          <span
            v-if="notice.isPinned"
            class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
          >
            고정
          </span>
          <span
            class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
            :class="categoryBadgeClass(notice.category)"
          >
            {{ notice.category }}
          </span>
        </div>

        <h2 class="text-2xl font-semibold leading-tight">{{ notice.title }}</h2>

        <p class="text-sm text-muted-foreground">
          {{ notice.author }} · {{ notice.createdAt }} · 조회 {{ notice.views }}
        </p>
      </div>

      <div class="space-y-4 py-6 text-[15px] leading-7 text-foreground/90">
        <p v-for="(paragraph, index) in notice.content" :key="index">
          {{ paragraph }}
        </p>
      </div>

      <div class="flex justify-end border-t pt-5">
        <Button variant="outline" as-child>
          <RouterLink to="/notices">목록</RouterLink>
        </Button>
      </div>
    </article>
  </section>
</template>
