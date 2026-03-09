<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { RouterLink } from "vue-router"
import { Button } from "@/components/ui/button"

type InquiryCategory = "예약" | "비품" | "계정" | "시스템" | "기타"

interface RequesterInfo {
  id: number
  name: string
  department: string
}

interface Inquiry {
  id: number
  category: InquiryCategory
  title: string
  content: string
  createdAt: string
  isPublic: boolean
  requester: RequesterInfo
}

const currentUserId = 101

const inquiries: Inquiry[] = [
  {
    id: 1,
    category: "예약",
    title: "회의실 예약 취소가 반영되지 않습니다.",
    content: "오리온 회의실 예약을 취소했는데 캘린더에 계속 표시됩니다.",
    createdAt: "2026-03-04",
    isPublic: true,
    requester: { id: 101, name: "김다은", department: "기획팀" },
  },
  {
    id: 2,
    category: "비품",
    title: "화상 카메라 연결 오류 문의",
    content: "노바 회의실 카메라가 인식되지 않아 회의 진행이 어렵습니다.",
    createdAt: "2026-03-03",
    isPublic: false,
    requester: { id: 102, name: "박지호", department: "개발팀" },
  },
  {
    id: 3,
    category: "계정",
    title: "비밀번호 재설정 메일 미수신",
    content: "아이디 찾기 후 비밀번호 재설정 메일이 오지 않습니다.",
    createdAt: "2026-03-02",
    isPublic: false,
    requester: { id: 101, name: "김다은", department: "기획팀" },
  },
  {
    id: 4,
    category: "시스템",
    title: "모바일에서 화면이 깨져 보입니다.",
    content: "예약 목록에서 버튼이 겹치고 스크롤이 비정상적으로 작동합니다.",
    createdAt: "2026-02-28",
    isPublic: true,
    requester: { id: 103, name: "이현우", department: "영업팀" },
  },
  {
    id: 5,
    category: "기타",
    title: "정기 점검 시간 문의",
    content: "월간 점검은 보통 몇 시에 진행되는지 확인 부탁드립니다.",
    createdAt: "2026-02-27",
    isPublic: true,
    requester: { id: 104, name: "최민서", department: "총무팀" },
  },
]

const categories: Array<InquiryCategory | "전체"> = [
  "전체",
  "예약",
  "비품",
  "계정",
  "시스템",
  "기타",
]

const selectedCategory = ref<InquiryCategory | "전체">("전체")
const keyword = ref("")
const visibilityFilter = ref<"전체" | "공개" | "비공개">("전체")
const onlyMine = ref(false)
const currentPage = ref(1)
const pageSize = 4

const filteredInquiries = computed(() => {
  return inquiries.filter((inquiry) => {
    const matchesCategory =
      selectedCategory.value === "전체" || inquiry.category === selectedCategory.value
    const matchesKeyword =
      keyword.value.trim() === "" ||
      inquiry.title.toLowerCase().includes(keyword.value.trim().toLowerCase()) ||
      inquiry.content.toLowerCase().includes(keyword.value.trim().toLowerCase())
    const matchesVisibility =
      visibilityFilter.value === "전체" ||
      (visibilityFilter.value === "공개" && inquiry.isPublic) ||
      (visibilityFilter.value === "비공개" && !inquiry.isPublic)
    const matchesMine = !onlyMine.value || inquiry.requester.id === currentUserId

    return matchesCategory && matchesKeyword && matchesVisibility && matchesMine
  })
})
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredInquiries.value.length / pageSize)),
)
const paginatedInquiries = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredInquiries.value.slice(start, start + pageSize)
})
const pageNumbers = computed(() =>
  Array.from({ length: totalPages.value }, (_, index) => index + 1),
)

const goToPage = (page: number) => {
  currentPage.value = page
}

watch([selectedCategory, keyword, visibilityFilter, onlyMine], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPages) => {
  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

const canReadInquiry = (inquiry: Inquiry) => {
  return inquiry.isPublic || inquiry.requester.id === currentUserId
}

const visibleTitle = (inquiry: Inquiry) => {
  return canReadInquiry(inquiry) ? inquiry.title : "비공개 문의입니다."
}

const visibleContent = (inquiry: Inquiry) => {
  return canReadInquiry(inquiry)
    ? inquiry.content
    : "작성자와 관리자만 제목 및 내용을 확인할 수 있습니다."
}

const categoryBadgeClass = (category: InquiryCategory) => {
  if (category === "예약") return "bg-blue-100 text-blue-700"
  if (category === "비품") return "bg-emerald-100 text-emerald-700"
  if (category === "계정") return "bg-violet-100 text-violet-700"
  if (category === "시스템") return "bg-amber-100 text-amber-700"
  return "bg-zinc-100 text-zinc-700"
}
</script>

<template>
  <section class="mx-auto w-full max-w-5xl space-y-5">
    <header class="flex items-end justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold tracking-tight">문의 목록</h1>
        <p class="text-sm text-muted-foreground">
          카테고리, 공개 여부, 키워드로 문의를 조회할 수 있습니다.
        </p>
      </div>
      <Button as-child>
        <RouterLink to="/inquiries/new">문의 등록</RouterLink>
      </Button>
    </header>

    <div class="rounded-lg border bg-card p-4 shadow-sm">
      <div class="grid gap-3 md:grid-cols-[1fr_160px_160px_auto]">
        <input
          v-model="keyword"
          type="text"
          placeholder="제목 또는 내용 검색"
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
        <select
          v-model="visibilityFilter"
          class="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="전체">전체 공개여부</option>
          <option value="공개">공개</option>
          <option value="비공개">비공개</option>
        </select>
        <label class="inline-flex items-center gap-2 rounded-md border px-3 text-sm">
          <input v-model="onlyMine" type="checkbox" class="size-4" />
          내 문의만
        </label>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <h2 class="text-base font-medium">목록</h2>
      <p class="text-sm text-muted-foreground">총 {{ filteredInquiries.length }}건</p>
    </div>

    <div v-if="filteredInquiries.length === 0" class="rounded-lg border bg-card p-10 text-center">
      <p class="text-sm text-muted-foreground">조회 결과가 없습니다.</p>
    </div>

    <div v-else class="space-y-3">
      <article
        v-for="inquiry in paginatedInquiries"
        :key="inquiry.id"
        class="rounded-lg border bg-card p-4 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                :class="categoryBadgeClass(inquiry.category)"
              >
                {{ inquiry.category }}
              </span>
              <span
                class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                :class="inquiry.isPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-700'"
              >
                {{ inquiry.isPublic ? "공개" : "비공개" }}
              </span>
            </div>
            <h3 class="text-base font-semibold">{{ visibleTitle(inquiry) }}</h3>
            <p class="text-sm text-muted-foreground">{{ visibleContent(inquiry) }}</p>
          </div>
          <Button variant="ghost" size="sm">상세보기</Button>
        </div>

        <div class="mt-3 border-t pt-3 text-sm text-muted-foreground">
          문의자 {{ inquiry.requester.name }} ({{ inquiry.requester.department }}) ·
          {{ inquiry.createdAt }}
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
