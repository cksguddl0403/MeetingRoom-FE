<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { RouterLink } from "vue-router"
import { Button } from "@/components/ui/button"

type NoticeCategory = "일반" | "시스템" | "점검" | "이벤트"

interface Notice {
  id: number
  title: string
  category: NoticeCategory
  author: string
  createdAt: string
  views: number
  isPinned: boolean
}

const notices: Notice[] = [
  {
    id: 1,
    title: "[중요] 4월 정기 점검 안내",
    category: "점검",
    author: "관리자",
    createdAt: "2026-03-01",
    views: 412,
    isPinned: true,
  },
  {
    id: 2,
    title: "회의실 예약 정책 변경 안내",
    category: "시스템",
    author: "운영팀",
    createdAt: "2026-02-27",
    views: 289,
    isPinned: true,
  },
  {
    id: 3,
    title: "신규 회의실 오픈 안내 (노바 2)",
    category: "일반",
    author: "총무팀",
    createdAt: "2026-02-23",
    views: 154,
    isPinned: false,
  },
  {
    id: 4,
    title: "봄맞이 예약 이벤트 안내",
    category: "이벤트",
    author: "마케팅팀",
    createdAt: "2026-02-21",
    views: 198,
    isPinned: false,
  },
  {
    id: 5,
    title: "화상회의 장비 사용 가이드 업데이트",
    category: "일반",
    author: "관리자",
    createdAt: "2026-02-18",
    views: 127,
    isPinned: false,
  },
  {
    id: 6,
    title: "일부 회의실 네트워크 장애 복구 완료",
    category: "시스템",
    author: "인프라팀",
    createdAt: "2026-02-16",
    views: 236,
    isPinned: false,
  },
]

const categories: Array<NoticeCategory | "전체"> = [
  "전체",
  "일반",
  "시스템",
  "점검",
  "이벤트",
]

const keyword = ref("")
const selectedCategory = ref<NoticeCategory | "전체">("전체")
const currentPage = ref(1)
const pageSize = 4

const filteredNotices = computed(() => {
  return notices.filter((notice) => {
    const matchesCategory =
      selectedCategory.value === "전체" || notice.category === selectedCategory.value
    const matchesKeyword =
      keyword.value.trim() === "" ||
      notice.title.toLowerCase().includes(keyword.value.trim().toLowerCase())
    return matchesCategory && matchesKeyword
  })
})

const pinnedNotices = computed(() => {
  return filteredNotices.value.filter((notice) => notice.isPinned)
})

const regularNotices = computed(() => {
  return filteredNotices.value.filter((notice) => !notice.isPinned)
})
const sortedNotices = computed(() => [...pinnedNotices.value, ...regularNotices.value])
const totalPages = computed(() => Math.max(1, Math.ceil(sortedNotices.value.length / pageSize)))
const paginatedNotices = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedNotices.value.slice(start, start + pageSize)
})
const pageNumbers = computed(() =>
  Array.from({ length: totalPages.value }, (_, index) => index + 1),
)

const goToPage = (page: number) => {
  currentPage.value = page
}

watch([keyword, selectedCategory], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

const categoryBadgeClass = (category: NoticeCategory) => {
  if (category === "점검") return "bg-amber-100 text-amber-700"
  if (category === "시스템") return "bg-blue-100 text-blue-700"
  if (category === "이벤트") return "bg-fuchsia-100 text-fuchsia-700"
  return "bg-zinc-100 text-zinc-700"
}
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-5">
    <header class="flex items-end justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight">공지사항</h1>
        <p class="text-sm text-muted-foreground">
          회의실 이용과 시스템 운영 관련 공지 목록입니다.
        </p>
      </div>
    </header>

    <div class="rounded-lg border bg-card p-4 shadow-sm">
      <div class="grid gap-3 md:grid-cols-[1fr_180px]">
        <input
          v-model="keyword"
          type="text"
          placeholder="제목으로 검색"
          class="h-10 rounded-md border bg-background px-3 text-sm"
        />
        <select
          v-model="selectedCategory"
          class="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <h2 class="text-base font-medium">목록</h2>
      <p class="text-sm text-muted-foreground">총 {{ filteredNotices.length }}건</p>
    </div>

    <div v-if="filteredNotices.length === 0" class="rounded-lg border bg-card p-10 text-center">
      <p class="text-sm text-muted-foreground">조회 결과가 없습니다.</p>
    </div>

    <div v-else class="space-y-3">
      <article v-for="notice in paginatedNotices" :key="notice.id" class="rounded-lg border bg-card p-4 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-2">
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
            <h3 class="text-base font-semibold">{{ notice.title }}</h3>
          </div>
          <Button variant="ghost" size="sm" as-child>
            <RouterLink :to="`/notices/${notice.id}`">상세보기</RouterLink>
          </Button>
        </div>
        <div class="mt-3 text-sm text-muted-foreground">
          {{ notice.author }} · {{ notice.createdAt }} · 조회 {{ notice.views }}
        </div>
      </article>

      <div class="flex items-center justify-center gap-1 pt-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          @click="goToPage(1)"
        >
          처음
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          이전
        </Button>
        <Button
          v-for="page in pageNumbers"
          :key="page"
          :variant="page === currentPage ? 'default' : 'outline'"
          size="sm"
          @click="goToPage(page)"
        >
          {{ page }}
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          다음
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="goToPage(totalPages)"
        >
          끝
        </Button>
      </div>
    </div>
  </section>
</template>
