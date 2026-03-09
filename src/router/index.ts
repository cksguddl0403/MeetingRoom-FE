import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../pages/dashboard/Dashboard.vue";
import RoomList from "../pages/room/RoomList.vue";
import ReservationList from "../pages/reservation/ReservationList.vue";
import NoticeList from "../pages/notice/NoticeList.vue";
import Notice from "../pages/notice/Notice.vue";
import MyPage from "../pages/mypage/MyPage.vue";
import Profile from "../pages/mypage/Profile.vue";
import User from "../pages/mypage/User.vue";
import FindId from "../pages/auth/FindId.vue";
import FindPassword from "../pages/auth/FindPassword.vue";
import SignUp from "../pages/auth/SignUp.vue";
import InquiryList from "@/pages/inquiry/InquiryList.vue";
import InquiryInput from "@/pages/inquiry/InquiryInput.vue";
import SignIn from "@/pages/auth/SignIn.vue";

const routes = [
  { path: "/", component: Dashboard },
  { path: "/rooms", component: RoomList },
  { path: "/reservations", component: ReservationList },
  { path: "/inquiries", component: InquiryList },
  { path: "/inquiries/new", component: InquiryInput },
  { path: "/notices", component: NoticeList },
  { path: "/notices/:id", component: Notice },
  { path: "/mypage", component: MyPage },
  { path: "/mypage/profile", component: Profile },
  { path: "/mypage/user", component: User },
  { path: "/auth/find-id", component: FindId },
  { path: "/auth/find-password", component: FindPassword },
  { path: "/auth/sign-up", component: SignUp },
  { path: "/auth/sign-in", component: SignIn },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
