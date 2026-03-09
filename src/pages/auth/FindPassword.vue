<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { Eye, EyeOff } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const form = ref({
  userId: "",
  email: "",
});

const verificationCode = ref("");
const isLookupDone = ref(false);
const isMatchFound = ref(false);
const isCodeSent = ref(false);
const isCodeVerified = ref(false);
const isResetDone = ref(false);
const remainingSeconds = ref(0);
const statusMessage = ref("");
const statusType = ref<"success" | "error">("success");
const resetForm = ref({
  newPassword: "",
  newPasswordConfirm: "",
});
const showNewPassword = ref(false);
const showNewPasswordConfirm = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const canResend = computed(() => isCodeSent.value && remainingSeconds.value === 0);
const verifyButtonDisabled = computed(
  () => verificationCode.value.length !== 6 || !isCodeSent.value,
);
const isPasswordRulePassed = computed(() =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(
    resetForm.value.newPassword,
  ),
);
const isPasswordMatched = computed(
  () =>
    !!resetForm.value.newPasswordConfirm &&
    resetForm.value.newPassword === resetForm.value.newPasswordConfirm,
);
const canSubmitReset = computed(
  () => isCodeVerified.value && isPasswordRulePassed.value && isPasswordMatched.value,
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
  isCodeSent.value = false;
  isCodeVerified.value = false;
  isResetDone.value = false;
  verificationCode.value = "";
  resetForm.value.newPassword = "";
  resetForm.value.newPasswordConfirm = "";
  clearTimer();
  statusMessage.value = "";
  statusType.value = "success";

  // TODO: API 연동 시 아이디/이메일 일치 여부를 실제 응답으로 대체
  if (form.value.userId.trim() && form.value.email.trim()) {
    isMatchFound.value = true;
    statusMessage.value = "일치하는 회원 정보를 찾았습니다. 인증번호를 발송하세요.";
    statusType.value = "success";
    return;
  }

  isMatchFound.value = false;
  statusMessage.value = "입력한 정보와 일치하는 회원을 찾지 못했습니다.";
  statusType.value = "error";
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
  statusType.value = "success";
}

function handleCodeInput(event: Event) {
  const target = event.target as HTMLInputElement;
  verificationCode.value = target.value.replace(/\D/g, "").slice(0, 6);
}

function handleVerifyCode() {
  if (verifyButtonDisabled.value) {
    return;
  }

  // TODO: API 연동 시 서버 검증 결과로 대체
  const isValidCode = verificationCode.value === "123456";
  if (!isValidCode) {
    isCodeVerified.value = false;
    statusMessage.value = "인증번호가 올바르지 않습니다. 다시 확인해 주세요.";
    statusType.value = "error";
    return;
  }

  isCodeVerified.value = true;
  statusMessage.value = "인증이 완료되었습니다. 비밀번호 재설정을 진행해 주세요.";
  statusType.value = "success";
}

function handleResetPassword() {
  if (!canSubmitReset.value) {
    return;
  }

  // TODO: API 연동 시 비밀번호 재설정 요청으로 대체
  isResetDone.value = true;
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
      <h1 class="mb-8 text-4xl font-extrabold tracking-tight">비밀번호 찾기</h1>

      <form class="space-y-5" @submit.prevent>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">아이디</label>
          <input
            v-model="form.userId"
            type="text"
            placeholder="가입한 아이디를 입력하세요"
            class="h-12 w-full rounded-md border border-input bg-background px-4 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">이메일</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="가입한 이메일을 입력하세요"
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
          :class="statusType === 'success' ? 'text-sm text-emerald-600' : 'text-sm text-destructive'"
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
          class="space-y-4 rounded-lg border border-border bg-muted/20 p-4"
        >
          <p class="text-sm font-semibold text-foreground">비밀번호 재설정</p>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground"
              >새 비밀번호</label
            >
            <div class="relative">
              <input
                v-model="resetForm.newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="영문/숫자/특수문자 포함 8자 이상"
                class="h-12 w-full rounded-md border border-input bg-background px-4 pr-12 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                @click="showNewPassword = !showNewPassword"
              >
                <Eye v-if="!showNewPassword" class="size-5" />
                <EyeOff v-else class="size-5" />
              </button>
            </div>
            <p
              :class="
                isPasswordRulePassed
                  ? 'text-xs text-emerald-600'
                  : 'text-xs text-muted-foreground'
              "
            >
              8자 이상, 영문/숫자/특수문자를 모두 포함해야 합니다.
            </p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-foreground"
              >새 비밀번호 확인</label
            >
            <div class="relative">
              <input
                v-model="resetForm.newPasswordConfirm"
                :type="showNewPasswordConfirm ? 'text' : 'password'"
                placeholder="새 비밀번호를 다시 입력하세요"
                class="h-12 w-full rounded-md border border-input bg-background px-4 pr-12 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                @click="showNewPasswordConfirm = !showNewPasswordConfirm"
              >
                <Eye v-if="!showNewPasswordConfirm" class="size-5" />
                <EyeOff v-else class="size-5" />
              </button>
            </div>
            <p
              v-if="resetForm.newPasswordConfirm"
              :class="
                isPasswordMatched
                  ? 'text-xs text-emerald-600'
                  : 'text-xs text-destructive'
              "
            >
              {{
                isPasswordMatched
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."
              }}
            </p>
          </div>

          <Button
            type="button"
            class="h-11 w-full bg-indigo-500 text-base font-semibold text-white hover:bg-indigo-500/90"
            :disabled="!canSubmitReset"
            @click="handleResetPassword"
          >
            비밀번호 변경
          </Button>
        </div>

        <div
          v-if="isResetDone"
          class="rounded-lg border border-emerald-200 bg-emerald-50 p-4"
        >
          <p class="text-sm font-medium text-emerald-700">
            비밀번호가 성공적으로 변경되었습니다.
          </p>
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
