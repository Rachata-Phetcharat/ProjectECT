// composables/useTheme.ts
type ThemeName = "light" | "dark";

const GUEST_KEY = "theme:guest";
const USER_KEY_PREFIX = "theme:user:";

export const useTheme = () => {
  const theme = useState<ThemeName>("theme", () => "light");

  // ใช้ session เพื่อรู้ว่าใครล็อกอินอยู่
  const { user, isLoggedIn } = useSession();

  // key สำหรับ user ปัจจุบัน (ใช้ users_id เป็นหลัก)
  const currentUserKey = computed<string | null>(() => {
    if (!isLoggedIn.value || !user.value) return null;

    const u = user.value as any;
    if (u?.users_id != null) return String(u.users_id);

    // เผื่ออนาคตเปลี่ยนรูปแบบ
    if (u?.id != null) return String(u.id);
    if (u?.username) return String(u.username);
    if (u?.email) return String(u.email);

    return null;
  });

  const applyTheme = (name: ThemeName) => {
    if (!process.client) return;

    const root = document.documentElement;
    root.classList.remove("theme-dark");
    if (name === "dark") {
      root.classList.add("theme-dark");
    }
  };

  const setTheme = (name: ThemeName) => {
    theme.value = name;
    if (!process.client) return;

    applyTheme(name);

    const key = currentUserKey.value;

    if (key) {
      // ผู้ใช้ล็อกอิน → เก็บแยกตาม user
      localStorage.setItem(USER_KEY_PREFIX + key, name);
    } else {
      // guest (ยังไม่ล็อกอิน) → เก็บค่า default ของ guest ไว้เฉย ๆ
      localStorage.setItem(GUEST_KEY, name);
    }
  };

  const loadTheme = () => {
    if (!process.client) return;

    const key = currentUserKey.value;
    let saved: ThemeName | null = null;

    if (key) {
      // ถ้าล็อกอิน → ลองโหลดของ user ก่อน
      saved = localStorage.getItem(USER_KEY_PREFIX + key) as ThemeName | null;
    } else {
      // ยังไม่ล็อกอิน → โหลดธีมของ guest
      saved = localStorage.getItem(GUEST_KEY) as ThemeName | null;
    }

    if (saved !== "dark" && saved !== "light") {
      saved = "light";
    }

    theme.value = saved;
    applyTheme(saved);
  };

  // เวลา user เปลี่ยน (login/logout/สลับบัญชี) → โหลดธีมให้ใหม่
  if (process.client) {
    watch(
      () => currentUserKey.value,
      () => {
        loadTheme();
      },
      { immediate: true }
    );
  }

  return { theme, setTheme, loadTheme };
};
