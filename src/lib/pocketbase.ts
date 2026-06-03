import PocketBase from "pocketbase";

const POCKETBASE_URL =
  import.meta.env.PUBLIC_POCKETBASE_URL ?? "https://swaanpb.tebrouri.fr";

export const pb = new PocketBase(POCKETBASE_URL);

export async function login(email: string, password: string) {
  return await pb.collection("users").authWithPassword(email, password);
}

export async function logout() {
  pb.authStore.clear();
}

export function getCurrentUser() {
  return pb.authStore.isValid ? pb.authStore.record : null;
}

export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}
