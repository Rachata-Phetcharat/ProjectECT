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

export const useSession = () => {
  // cookies
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

  // states
  const isLoggedIn = useState<boolean>(
    "isLoggedIn",
    () => cIsLogged.value || false
  );
  const token = useState<string | null>("authToken", () => cToken.value);
  const user = useState<any | null>("user", () =>
    cName.value ? { name: cName.value } : null
  );

  const {
    public: { apiBase },
  } = useRuntimeConfig();

  const setLoggedIn = (v: boolean) => {
    isLoggedIn.value = v;
    cIsLogged.value = v;
    if (!v) {
      user.value = null;
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
  };

  // header ชุดเดียวกันทุกที่
  const authHeaders = () => {
    const h: Record<string, string> = { Accept: "application/json" };
    if (token.value) h.Authorization = `Bearer ${token.value}`;
    return h;
  };
  const looksLikeHtml = (v: unknown) =>
    typeof v === "string" && /<!DOCTYPE|<html/i.test(v);

  // ดึงชื่อจริงจาก token
  const fetchMe = async () => {
    try {
      const res = await $fetch<MeResponse>(`${apiBase}/get/userinfo/bytoken`, {
        headers: authHeaders(),
      });
      if (looksLikeHtml(res)) throw new Error("HTML returned");

      const name =
        typeof res === "string"
          ? res
          : res?.name ??
            res?.full_name ??
            res?.display_name ??
            res?.username ??
            "";
      if (name) {
        setUserName(name);
        if (!isLoggedIn.value) setLoggedIn(true);
      }
      return user.value;
    } catch {
      return user.value;
    }
  };

  // เรียกตอนเปิดแอป/รีเฟรช
  const checkSession = async () => {
    if (isLoggedIn.value && (user.value?.name || token.value)) return true;
    await fetchMe();
    return !!(isLoggedIn.value && (user.value?.name || token.value));
  };

  return {
    isLoggedIn,
    user,
    token,
    setToken,
    setLoggedIn,
    setUserName,
    fetchMe,
    checkSession,
    authHeaders,
  };
};
