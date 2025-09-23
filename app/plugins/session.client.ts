// plugins/session.client.ts
export default defineNuxtPlugin(async () => {
  const { checkSession } = useSession();
  await checkSession().catch(() => {});
});
