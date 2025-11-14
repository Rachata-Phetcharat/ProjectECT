// composables/useSession.ts
type MeResponse =
  | string
  | {
      id?: number | string;
      name?: string;
      full_name?: string;
      display_name?: string;
      username?: string;
      email?: string;
      role?: string;
    };

export type Me = {
  id?: number | string | null;
  name?: string | null;
  username?: string | null;
  display_name?: string | null;
  email?: string | null;
  role?: string | null;
};

export const useSession = () => {
  // === cookies ===
  const cIsLogged = useCookie<boolean>("is_logged_in", {
    default: () => false,
    sameSite: "lax",
    path: "/",
  });
  const cToken = useCookie<string | null>("auth_token", {
    default: () => null,
    sameSite: "lax",
    path: "/",
  });
  const cName = useCookie<string | null>("user_name", {
    default: () => null,
    sameSite: "lax",
    path: "/",
  });

  // === states ===
  const isLoggedIn = useState<boolean>(
    "isLoggedIn",
    () => cIsLogged.value || false
  );
  const token = useState<string | null>("authToken", () => cToken.value);
  // `user` เอาไว้ใช้งานสั้น ๆ เช่นแสดงชื่อบนเมนู
  const user = useState<{ name?: string } | null>("user", () =>
    cName.value ? { name: cName.value } : null
  );
  // `me` โปรไฟล์เต็ม ๆ ของผู้ใช้
  const me = useState<Me | null>("me", () => null);

  const {
    public: { apiBase },
  } = useRuntimeConfig();

  // === setters ===
  const setLoggedIn = (v: boolean) => {
    isLoggedIn.value = v;
    cIsLogged.value = v;
    if (!v) {
      user.value = null;
      me.value = null;
      cName.value = null;
      token.value = null;
      cToken.value = null;
    }
  };

  const setToken = (t: string | null) => {
    token.value = t;
    cToken.value = t;
  };

  const setUserName = (name: string) => {
    user.value = { ...(user.value || {}), name };
    cName.value = name;
    // ถ้ามี me อยู่แล้ว และยังไม่มี name → ใส่ให้ด้วยเพื่อให้สอดคล้อง
    if (me.value) {
      me.value = {
        ...me.value,
        name: me.value.name || name,
        display_name: me.value.display_name || name,
      };
    }
  };

  const setMe = (val: Me | null) => {
    me.value = val;
    if (val?.name || val?.display_name || val?.username) {
      const display = val.name || val.display_name || val.username || "";
      if (display) setUserName(display);
    }
    if (val) setLoggedIn(true);
  };

  // === helpers ===
  const authHeaders = () => {
    const h: Record<string, string> = { Accept: "application/json" };
    if (token.value) h.Authorization = `Bearer ${token.value}`;
    return h;
  };

  const looksLikeHtml = (s: string) => /<!DOCTYPE|<html/i.test(s);

  // แปลง response → Me
  const normalizeMe = (res: MeResponse): Me => {
    if (typeof res === "string") {
      return {
        name: res || null,
        display_name: res || null,
      };
    }
    return {
      id: res?.id ?? null,
      name:
        res?.name ??
        res?.full_name ??
        res?.display_name ??
        res?.username ??
        null,
      username: res?.username ?? null,
      display_name: res?.display_name ?? res?.full_name ?? res?.name ?? null,
      email: res?.email ?? null,
      role: res?.role ?? null,
    };
  };

  // === fetchMe ===
  const fetchMe = async () => {
    try {
      const res = await $fetch<MeResponse>(`${apiBase}/get/userinfo/bytoken`, {
        headers: authHeaders(),
      });

      // ถ้า backend ตอบ HTML กลับมา (เช่น 401 page) → ไม่ทับ state เดิม
      if (typeof res === "string" && looksLikeHtml(res)) {
        throw new Error("HTML returned");
      }

      const profile = normalizeMe(res);
      setMe(profile);
      return me.value;
    } catch {
      // อย่า reset state ทิ้ง เผื่อยังมีของเดิมอยู่จาก cookie
      return me.value;
    }
  };

  // === checkSession: เรียกตอนเปิดแอป/รีเฟรช ===
  const checkSession = async () => {
    if (isLoggedIn.value && (user.value?.name || token.value) && me.value)
      return true;
    await fetchMe();
    return !!(isLoggedIn.value && (user.value?.name || token.value));
  };

  // สำหรับ header/เมนู: ชื่อที่ควรแสดง
  const displayName = computed<string>(() => {
    return (
      me.value?.name ||
      me.value?.display_name ||
      user.value?.name ||
      "ผู้ใช้งาน"
    );
  });

  // ⭐ เพิ่ม role เป็น computed แยกออกมาให้ใช้สะดวก
  const role = computed<string | null>(() => me.value?.role ?? null);

  return {
    // state
    isLoggedIn,
    user,
    token,
    me,
    displayName,
    role, // <-- เอาออกไปใช้ข้างนอกได้แล้ว

    // setters
    setToken,
    setLoggedIn,
    setUserName,
    setMe,

    // actions
    fetchMe,
    checkSession,

    // utils
    authHeaders,
  };
};
