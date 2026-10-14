import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import type { User } from "../store";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(config).every(Boolean);

const auth = isFirebaseConfigured
  ? getAuth(getApps().length ? getApp() : initializeApp(config))
  : null;

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export function toCineHubUser(user: FirebaseUser): NonNullable<User> {
  return {
    uid: user.uid,
    name: user.displayName || user.email?.split("@")[0] || "Người dùng CineHub",
    email: user.email || "",
    photoURL: user.photoURL || undefined,
    provider: "google",
  };
}

export function watchGoogleAuth(onUser: (user: FirebaseUser | null) => void) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, onUser);
}

export async function signInWithGoogle() {
  if (!auth) {
    throw new Error("Thiếu cấu hình Firebase. Hãy thêm các biến VITE_FIREBASE_* vào file .env.local rồi khởi động lại ứng dụng.");
  }

  try {
    const result = await signInWithPopup(auth, provider);
    return toCineHubUser(result.user);
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error && typeof error.code === "string"
      ? error.code
      : undefined;
    if (code === "auth/popup-closed-by-user") {
      throw new Error("Bạn đã đóng cửa sổ đăng nhập Google trước khi hoàn tất.");
    }
    if (code === "auth/popup-blocked") {
      throw new Error("Trình duyệt đã chặn cửa sổ đăng nhập. Hãy cho phép popup rồi thử lại.");
    }
    if (code === "auth/unauthorized-domain") {
      throw new Error("Tên miền hiện tại chưa được cấp quyền trong Firebase Authentication.");
    }
    if (code === "auth/operation-not-allowed") {
      throw new Error("Google Sign-In chưa được bật trong Firebase Authentication.");
    }
    if (code === "auth/network-request-failed") {
      throw new Error("Không thể kết nối Firebase. Hãy kiểm tra mạng và thử lại.");
    }
    throw error;
  }
}

export async function signOutGoogle() {
  if (auth) await signOut(auth);
}
