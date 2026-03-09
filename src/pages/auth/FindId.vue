<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { Button } from "@/components/ui/button";

const form = ref({
  name: "",
  email: "",
});

const verificationCode = ref("");
const isLookupDone = ref(false);
const isMatchFound = ref(false);
const isCodeSent = ref(false);
const isCodeVerified = ref(false);
const remainingSeconds = ref(0);
const statusMessage = ref("");
const foundUserId = ref("");
let timer: ReturnType<typeof setInterval> | null = null;

const canResend = computed(() => isCodeSent.value && remainingSeconds.value === 0);
const verifyButtonDisabled = computed(
  () => verificationCode.value.length !== 6 || !isCodeSent.value,
);
const sendButtonLabel = computed(() => {
  if (!isCodeSent.value) {
    return "인증번호 발송";
  }

  if (canResend.value) {
    return "재전송";
  }

  const minutes = Math.floor(remainingSeconds.value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds.value % 60).toString().padStart(2, "0");
  return `재전송 (${minutes}:${seconds})`;
});

function clearTimer() {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = null;
}

function startCodeTimer() {
  clearTimer();
  isCodeSent.value = true;
  remainingSeconds.value = 300;

  timer = setInterval(() => {
    if (remainingSeconds.value <= 1) {
      remainingSeconds.value = 0;
      clearTimer();
      return;
    }

    remainingSeconds.value -= 1;
  }, 1000);
}

function handleLookup() {
  isLookupDone.value = true;
  isCodeVerified.value = false;
  isCodeSent.value = false;
  verificationCode.value = "";
  clearTimer();
  statusMessage.value = "";
  foundUserId.value = "";

  // TODO: API 연동 시 이름/이메일 일치 여부를 실제 응답으로 대체
  if (form.value.name.trim() && form.value.email.trim()) {
    isMatchFound.value = true;
    statusMessage.value = "일치하는 회원 정보를 찾았습니다. 인증번호를 발송하세요.";
    return;
  }

  isMatchFound.value = false;
  statusMessage.value = "입력한 정보와 일치하는 회원을 찾지 못했습니다.";
}

function handleSendCode() {
  if (!isMatchFound.value) {
    return;
  }

  if (isCodeSent.value && !canResend.value) {
    return;
  }

  startCodeTimer();
  statusMessage.value = "입력한 이메일로 인증번호 6자리를 발송했습니다.";
}

function handleCodeInput(event: Event) {
  const target = event.target as HTMLInputElement;
  verificationCode.value = target.value.replace(/\D/g, "").slice(0, 6);
}

function handleVerifyCode() {
  if (verifyButtonDisabled.value) {
    return;
  }

  // TODO: API 연동 시 서버 검증 결과로 변경
  const isValidCode = verificationCode.value === "123456";
  if (!isValidCode) {
    isCodeVerified.value = false;
    statusMessage.value = "인증번호가 올바르지 않습니다. 다시 확인해 주세요.";
    return;
  }

  isCodeVerified.value = true;
  foundUserId.value = "meetingroom_user01";
  statusMessage.value = "인증이 완료되었습니다. 아이디를 확인해 주세요.";
}

onUnmounted(() => {
  clearTimer();
});
</script>

<template>
  <div class="min-h-screen px-6 py-10">
    <section
      class="mx-auto w-full max-w-xl rounded-2xl bg-card p-8 text-card-foreground shadow-2xl"
    >
      <h1 class="mb-8 text-4xl font-extrabold tracking-tight">아이디 찾기</h1>

      <form class="space-y-5" @submit.prevent>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">이름</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="회원가입 시 입력한 이름"
            class="h-12 w-full rounded-md border border-input bg-background px-4 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">이메일</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="회원가입 시 입력한 이메일"
            class="h-12 w-full rounded-md border border-input bg-background px-4 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          />
        </div>

        <Button
          type="button"
          class="h-12 w-full bg-indigo-500 text-base font-semibold text-white hover:bg-indigo-500/90"
          @click="handleLookup"
        >
          조회
        </Button>

        <p
          v-if="isLookupDone"
          :class="
            isMatchFound
              ? 'text-sm text-emerald-600'
              : 'text-sm text-destructive'
          "
        >
          {{ statusMessage }}
        </p>

        <div
          v-if="isMatchFound"
          class="space-y-4 rounded-lg border border-border bg-muted/20 p-4"
        >
          <div class="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
            <input
              :value="verificationCode"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="인증번호 6자리 입력"
              class="h-12 rounded-md border border-input bg-background px-4 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
              @input="handleCodeInput"
            />
            <Button
              type="button"
              class="h-12 w-full bg-indigo-500 text-base font-semibold text-white hover:bg-indigo-500/90 md:w-44"
              :disabled="isCodeSent && !canResend"
              @click="handleSendCode"
            >
              {{ sendButtonLabel }}
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            class="h-11 w-full text-base font-semibold"
            :disabled="verifyButtonDisabled"
            @click="handleVerifyCode"
          >
            인증번호 확인
          </Button>
        </div>

        <div
          v-if="isCodeVerified"
          class="rounded-lg border border-emerald-200 bg-emerald-50 p-4"
        >
          <p class="text-sm font-medium text-emerald-700">아이디 조회 결과</p>
          <p class="mt-1 text-lg font-bold text-emerald-800">{{ foundUserId }}</p>
          <RouterLink
            to="/auth/sign-in"
            class="mt-3 inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            로그인으로 이동
          </RouterLink>
        </div>
      </form>
    </section>
  </div>
</template>
