<script setup lang="ts">
import { computed, ref } from "vue"
import { Button } from "@/components/ui/button"

type AssetStatus = "정상" | "고장" | "분실" | "수리 중"
type RoomStatus = "사용 가능" | "사용 중" | "점검 중"

interface Asset {
  id: number
  name: string
}

interface RoomAsset {
  id: number
  roomId: number
  assetId: number
  quantity: number
  status: AssetStatus
}

interface Room {
  id: number
  name: string
  status: RoomStatus
  maxCapacity: number
  currentOccupancy: number
}

const assets: Asset[] = [
  { id: 1, name: "프로젝터" },
  { id: 2, name: "화이트보드" },
  { id: 3, name: "회의용 마이크" },
  { id: 4, name: "화상 카메라" },
  { id: 5, name: "스피커폰" },
]

const rooms: Room[] = [
  { id: 1, name: "오리온 회의실", status: "사용 중", maxCapacity: 6, currentOccupancy: 4 },
  { id: 2, name: "아틀라스 회의실", status: "사용 가능", maxCapacity: 8, currentOccupancy: 0 },
  { id: 3, name: "루나 회의실", status: "점검 중", maxCapacity: 4, currentOccupancy: 0 },
  { id: 4, name: "노바 회의실", status: "사용 중", maxCapacity: 10, currentOccupancy: 7 },
]

const roomAssets: RoomAsset[] = [
  { id: 1, roomId: 1, assetId: 1, quantity: 1, status: "정상" },
  { id: 2, roomId: 1, assetId: 2, quantity: 2, status: "정상" },
  { id: 3, roomId: 1, assetId: 4, quantity: 1, status: "수리 중" },
  { id: 4, roomId: 2, assetId: 2, quantity: 1, status: "정상" },
  { id: 5, roomId: 2, assetId: 3, quantity: 3, status: "정상" },
  { id: 6, roomId: 2, assetId: 5, quantity: 1, status: "고장" },
  { id: 7, roomId: 3, assetId: 1, quantity: 1, status: "정상" },
  { id: 8, roomId: 3, assetId: 4, quantity: 1, status: "정상" },
  { id: 9, roomId: 3, assetId: 5, quantity: 2, status: "분실" },
  { id: 10, roomId: 4, assetId: 2, quantity: 1, status: "정상" },
  { id: 11, roomId: 4, assetId: 3, quantity: 2, status: "수리 중" },
  { id: 12, roomId: 4, assetId: 4, quantity: 1, status: "정상" },
]

const statuses: AssetStatus[] = ["정상", "고장", "분실", "수리 중"]

interface AssetRule {
  id: number
  assetId: number | null
  minimumQuantity: number | null
  status: AssetStatus | ""
}

const assetRules = ref<AssetRule[]>([
  { id: 1, assetId: null, minimumQuantity: null, status: "" },
])
const nextRuleId = ref(2)
const expandedRoomIds = ref<number[]>([])

const assetNameById = computed<Record<number, string>>(() => {
  return assets.reduce<Record<number, string>>((acc, asset) => {
    acc[asset.id] = asset.name
    return acc
  }, {})
})

const roomAssetsByRoom = computed(() => {
  return rooms.map((room) => {
    const items = roomAssets
      .filter((item) => item.roomId === room.id)
      .map((item) => ({
        ...item,
        assetName: assetNameById.value[item.assetId] ?? "알 수 없음",
      }))
    return { ...room, items }
  })
})

const filteredRooms = computed(() => {
  return roomAssetsByRoom.value.filter((room) => {
    const matchesAssetRules = assetRules.value
      .filter((rule) => rule.assetId !== null)
      .every((rule) =>
        room.items.some(
          (item) =>
            item.assetId === rule.assetId &&
            (rule.minimumQuantity == null || item.quantity >= rule.minimumQuantity) &&
            (rule.status === "" || item.status === rule.status),
        ),
      )

    return matchesAssetRules
  })
})

const addAssetRule = () => {
  assetRules.value = [
    ...assetRules.value,
    { id: nextRuleId.value, assetId: null, minimumQuantity: null, status: "" },
  ]
  nextRuleId.value += 1
}

const removeAssetRule = (ruleId: number) => {
  if (assetRules.value.length === 1) {
    assetRules.value = [{ id: 1, assetId: null, minimumQuantity: null, status: "" }]
    nextRuleId.value = 2
    return
  }
  assetRules.value = assetRules.value.filter((rule) => rule.id !== ruleId)
}

const resetFilters = () => {
  assetRules.value = [{ id: 1, assetId: null, minimumQuantity: null, status: "" }]
  nextRuleId.value = 2
}

const toggleRoomAssets = (roomId: number) => {
  if (expandedRoomIds.value.includes(roomId)) {
    expandedRoomIds.value = expandedRoomIds.value.filter((id) => id !== roomId)
    return
  }
  expandedRoomIds.value = [...expandedRoomIds.value, roomId]
}

const isRoomAssetsExpanded = (roomId: number) => {
  return expandedRoomIds.value.includes(roomId)
}

const roomStatusClass = (status: RoomStatus) => {
  if (status === "사용 중") {
    return "bg-blue-100 text-blue-700"
  }
  if (status === "점검 중") {
    return "bg-amber-100 text-amber-700"
  }
  return "bg-emerald-100 text-emerald-700"
}

const assetStatusClass = (status: AssetStatus) => {
  if (status === "고장") {
    return "bg-red-100 text-red-700"
  }
  if (status === "분실") {
    return "bg-zinc-200 text-zinc-700"
  }
  if (status === "수리 중") {
    return "bg-amber-100 text-amber-700"
  }
  return "bg-emerald-100 text-emerald-700"
}

const occupancyText = (room: Room) => {
  if (room.status === "사용 중") {
    return `${room.currentOccupancy}/${room.maxCapacity}`
  }
  if (room.status === "점검 중") {
    return `- / ${room.maxCapacity}`
  }
  return `0 / ${room.maxCapacity}`
}
</script>

<template>
  <section class="mx-auto w-full max-w-6xl space-y-6 p-6">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">회의실</h1>
      <p class="text-sm text-muted-foreground">
        비품 종류, 수량, 상태를 조합해 조건에 맞는 회의실을 조회할 수 있습니다.
      </p>
    </header>

    <div class="rounded-lg border bg-card p-5 text-card-foreground shadow-sm">
      <div class="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-base font-medium">필터</h2>
        </div>
        <Button variant="outline" size="sm" @click="resetFilters">초기화</Button>
      </div>

      <div class="grid gap-6">
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-sm font-medium">비품별 최소 수량 + 상태</h3>
            <Button variant="outline" size="sm" @click="addAssetRule">
              조건 추가
            </Button>
          </div>
          <div class="space-y-2">
            <div
              v-for="rule in assetRules"
              :key="rule.id"
              class="grid gap-2 rounded-md border bg-background p-3 md:grid-cols-[1.4fr_1fr_1fr_auto]"
            >
              <label class="block space-y-1 text-sm">
                <span class="text-muted-foreground">비품</span>
                <select v-model="rule.assetId" class="h-9 w-full rounded-md border px-3 text-sm">
                  <option :value="null">선택 안 함</option>
                  <option v-for="asset in assets" :key="asset.id" :value="asset.id">
                    {{ asset.name }}
                  </option>
                </select>
              </label>

              <label class="block space-y-1 text-sm">
                <span class="text-muted-foreground">최소 수량</span>
                <input
                  v-model.number="rule.minimumQuantity"
                  type="number"
                  min="1"
                  class="h-9 w-full rounded-md border px-3 text-sm"
                  placeholder="예: 2"
                />
              </label>

              <label class="block space-y-1 text-sm">
                <span class="text-muted-foreground">상태</span>
                <select v-model="rule.status" class="h-9 w-full rounded-md border px-3 text-sm">
                  <option value="">전체 상태</option>
                  <option v-for="status in statuses" :key="status" :value="status">
                    {{ status }}
                  </option>
                </select>
              </label>

              <div class="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  class="w-full md:w-auto"
                  @click="removeAssetRule(rule.id)"
                >
                  삭제
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">회의실 목록</h2>
        <p class="text-sm text-muted-foreground">
          총 {{ filteredRooms.length }}개 회의실
        </p>
      </div>

      <div v-if="filteredRooms.length === 0" class="rounded-lg border bg-card p-8 text-center">
        <p class="text-sm text-muted-foreground">조건에 맞는 회의실이 없습니다.</p>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2">
        <article
          v-for="room in filteredRooms"
          :key="room.id"
          class="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-1">
              <h3 class="text-base font-semibold">{{ room.name }}</h3>
              <p class="text-sm text-muted-foreground">
                현재 인원 {{ occupancyText(room) }}명
              </p>
            </div>
            <span
              class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
              :class="roomStatusClass(room.status)"
            >
              {{ room.status }}
            </span>
          </div>

          <div class="mt-3">
            <Button
              variant="outline"
              size="sm"
              @click="toggleRoomAssets(room.id)"
            >
              {{ isRoomAssetsExpanded(room.id) ? "비품 숨기기" : "비품 보기" }}
            </Button>
          </div>

          <ul v-if="isRoomAssetsExpanded(room.id)" class="mt-3 space-y-2">
            <li
              v-for="item in room.items"
              :key="item.id"
              class="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm"
            >
              <span class="font-medium">
                {{ item.assetName }} / 수량 {{ item.quantity }}
              </span>
              <span
                class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                :class="assetStatusClass(item.status)"
              >
                {{ item.status }}
              </span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>
