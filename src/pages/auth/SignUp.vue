<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { Eye, EyeOff } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const form = ref({
  userId: "",
  password: "",
  passwordConfirm: "",
  name: "",
  nickname: "",
  email: "",
});

const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const verificationCode = ref("");
const isCodeSent = ref(false);
const remainingSeconds = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remainingSeconds.value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});

const canResend = computed(
  () => isCodeSent.value && remainingSeconds.value === 0,
);
const verificationButtonLabel = computed(() => {
  if (!isCodeSent.value) {
    return "인증 번호 발송";
  }

  if (canResend.value) {
    return "재전송";
  }

  return `재전송 (${formattedTime.value})`;
});
const isVerificationButtonDisabled = computed(() => {
  if (!form.value.email.trim()) {
    return true;
  }

  return isCodeSent.value && !canResend.value;
});

function clearTimer() {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = null;
}

function startVerificationTimer() {
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

function handleVerificationRequest() {
  if (!form.value.email.trim()) {
    return;
  }

  if (isCodeSent.value && !canResend.value) {
    return;
  }

  startVerificationTimer();
}

function handleCodeInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const onlyDigits = target.value.replace(/\D/g, "").slice(0, 6);
  verificationCode.value = onlyDigits;
}

onUnmounted(() => {
  clearTimer();
});
</script>

<template>
  <div class="min-h-screen px-6 py-10">
    <section
      class="mx-auto w-full max-w-4xl rounded-2xl bg-card p-8 text-card-foreground shadow-2xl"
    >
      <h1 class="mb-10 text-5xl font-extrabold tracking-tight">회원가입</h1>

      <form class="space-y-5" @submit.prevent>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          <input
            v-model="form.userId"
            type="text"
            placeholder="아이디"
            class="h-12 rounded-md border border-input bg-background px-4 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          />
          <Button
            type="button"
            class="h-12 w-full bg-indigo-500 text-base font-semibold text-white hover:bg-indigo-500/90 md:w-52"
          >
            중복 확인
          </Button>
        </div>

        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="비밀번호"
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

        <div class="relative">
          <input
            v-model="form.passwordConfirm"
            :type="showPasswordConfirm ? 'text' : 'password'"
            placeholder="비밀번호 확인"
            class="h-12 w-full rounded-md border border-input bg-background px-4 pr-12 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            @click="showPasswordConfirm = !showPasswordConfirm"
          >
            <Eye v-if="!showPasswordConfirm" class="size-5" />
            <EyeOff v-else class="size-5" />
          </button>
        </div>

        <input
          v-model="form.name"
          type="text"
          placeholder="이름"
          class="h-12 w-full rounded-md border border-input bg-background px-4 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
        />

        <div class="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          <input
            v-model="form.nickname"
            type="text"
            placeholder="닉네임"
            class="h-12 rounded-md border border-input bg-background px-4 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          />
          <Button
            type="button"
            class="h-12 w-full bg-indigo-500 text-base font-semibold text-white hover:bg-indigo-500/90 md:w-52"
          >
            중복 확인
          </Button>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          <input
            v-model="form.email"
            type="email"
            placeholder="이메일"
            class="h-12 rounded-md border border-input bg-background px-4 text-base placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          />
          <Button
            type="button"
            class="h-12 w-full bg-indigo-500 text-base font-semibold text-white hover:bg-indigo-500/90 md:w-52"
            :disabled="isVerificationButtonDisabled"
            @click="handleVerificationRequest"
          >
            {{ verificationButtonLabel }}
          </Button>
        </div>

        <div
          v-if="isCodeSent"
          class="space-y-3 rounded-lg border border-border bg-muted/20 p-4"
        >
          <div class="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
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
              variant="outline"
              class="h-12 w-full text-base font-semibold md:w-52"
            >
              인증 확인
            </Button>
          </div>

          <div class="flex items-center text-sm">
            <p class="font-medium text-muted-foreground">
              남은 시간
              <span class="ml-2 font-semibold text-indigo-500">{{
                formattedTime
              }}</span>
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-foreground">
            재직 증명서 첨부
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            class="block h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-indigo-500 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500/90 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none"
          />
        </div>

        <div class="pt-8">
          <Button
            type="submit"
            class="h-12 w-full bg-indigo-500 text-lg font-semibold text-white hover:bg-indigo-500/90"
          >
            회원가입
          </Button>
        </div>
      </form>
    </section>
  </div>
</template>
