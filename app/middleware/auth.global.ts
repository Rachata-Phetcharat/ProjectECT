export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, checkSession } = useSession();
  const publicRoutes = ["/", "/login", "/chat"];

  if (!isLoggedIn.value) await checkSession();

  if (to.path === "/login" && isLoggedIn.value) return navigateTo("/");
  if (!publicRoutes.includes(to.path) && !isLoggedIn.value)
    return navigateTo("/");
});
