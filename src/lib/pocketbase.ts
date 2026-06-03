import PocketBase from "pocketbase";

// ── Client PocketBase ──────────────────────────────────────────────────────
// Remplace l'URL dans un fichier .env :
// PUBLIC_POCKETBASE_URL="http://127.0.0.1:8090"
const POCKETBASE_URL =
  import.meta.env.PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090";

export const pb = new PocketBase(POCKETBASE_URL);

// ── Types ──────────────────────────────────────────────────────────────────

export type Module = {
  id: string;
  title: string;
  level: 1 | 2 | 3 | 4;
  description: string;
  order: number;
};

export type Lesson = {
  id: string;
  module_id: string;
  title: string;
  content: string;
  video_url: string;
  order: number;
};

export type Game = {
  id: string;
  lesson_id: string;
  type: "quiz" | "memory" | "vrai_faux" | "champ_lexical";
  data: Record<string, unknown>;
};

export type Progress = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  completed_at: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
};

export type DictionaryEntry = {
  id: string;
  word: string;
  sign_video_url: string;
  category: string;
  level: number;
};

// Collections déjà créées dans le PocketBase du projet
export type SwaanUser = {
  id: string;
  email: string;
  name?: string;
  prenom?: string;
  actif?: boolean;
  role?: "collaborateur" | "admin";
  company?: string;
};

export type Offre = {
  id: string;
  title?: string;
  name?: string;
  nom_pack?: string;
  price?: number;
  monthly?: string;
  yearly?: string;
  prix_mois?: number;
  prix_annee?: number;
  description?: string;
  users_count?: number;
};

export type Signe = {
  id: string;
  word?: string;
  mot?: string;
  mots?: string;
  category?: string;
  categorie?: string;
  level?: number;
  niveau?: number;
  sign_video_url?: string;
  video?: string;
  image?: string;
  img_signe?: string;
  description?: string;
};

export type Jeu = {
  id: string;
  title?: string;
  enonce?: string;
  reponse_correct?: string | boolean;
  type_jeux?: "quiz" | "memory" | "vrai_faux" | "champ_lexical";
  type?: "quiz" | "memory" | "vrai_faux" | "champ_lexical";
  data?: Record<string, unknown>;
};

// ── Collections SWAAN déjà présentes ──────────────────────────────────────

export async function getOffres(): Promise<Offre[]> {
  try {
    return await pb.collection("offres").getFullList<Offre>({
      sort: "created",
    });
  } catch (error) {
    console.error("Erreur récupération offres :", error);
    return [];
  }
}

export async function getSignes(opts?: {
  category?: string;
  level?: number;
  search?: string;
}): Promise<Signe[]> {
  try {
    const filters: string[] = [];
    if (opts?.category) {
      filters.push(`categorie = "${opts.category}"`);
    }
    if (opts?.level) {
      filters.push(`niveau = ${opts.level}`);
    }
    if (opts?.search) {
      filters.push(`mots ~ "${opts.search}"`);
    }

    return await pb.collection("signe").getFullList<Signe>({
      sort: "mots",
      filter: filters.join(" && "),
    });
  } catch (error) {
    console.error("Erreur récupération signes :", error);
    return [];
  }
}

export async function getJeux(): Promise<Jeu[]> {
  try {
    return await pb.collection("jeux").getFullList<Jeu>({
      sort: "created",
    });
  } catch (error) {
    console.error("Erreur récupération jeux :", error);
    return [];
  }
}

// ── Modules ────────────────────────────────────────────────────────────────

export async function getModules(): Promise<Module[]> {
  try {
    return await pb.collection("modules").getFullList<Module>({
      sort: "order",
    });
  } catch (error) {
    console.error("Erreur récupération modules :", error);
    return [];
  }
}

export async function getModule(id: string): Promise<Module | null> {
  try {
    return await pb.collection("modules").getOne<Module>(id);
  } catch (error) {
    console.error("Erreur récupération module :", error);
    return null;
  }
}

// ── Leçons ─────────────────────────────────────────────────────────────────

export async function getLessons(moduleId?: string): Promise<Lesson[]> {
  try {
    const filter = moduleId ? `module_id = "${moduleId}"` : "";
    return await pb.collection("lessons").getFullList<Lesson>({
      sort: "order",
      filter,
    });
  } catch (error) {
    console.error("Erreur récupération leçons :", error);
    return [];
  }
}

export async function getLesson(id: string): Promise<Lesson | null> {
  try {
    return await pb.collection("lessons").getOne<Lesson>(id);
  } catch (error) {
    console.error("Erreur récupération leçon :", error);
    return null;
  }
}

// ── Jeux ───────────────────────────────────────────────────────────────────

export async function getGame(id: string): Promise<Game | null> {
  try {
    return await pb.collection("games").getOne<Game>(id);
  } catch (error) {
    console.error("Erreur récupération jeu :", error);
    return null;
  }
}

export async function getGameByLesson(lessonId: string): Promise<Game | null> {
  try {
    return await pb.collection("games").getFirstListItem<Game>(
      `lesson_id = "${lessonId}"`
    );
  } catch (error) {
    console.error("Erreur récupération jeu pour la leçon :", error);
    return null;
  }
}

// ── Progression ────────────────────────────────────────────────────────────

export async function getUserProgress(userId: string): Promise<Progress[]> {
  try {
    return await pb.collection("progress").getFullList<Progress>({
      filter: `user_id = "${userId}"`,
      sort: "-completed_at",
    });
  } catch (error) {
    console.error("Erreur récupération progression :", error);
    return [];
  }
}

export async function saveProgress(data: {
  user_id: string;
  lesson_id: string;
  score: number;
  completed: boolean;
}): Promise<Progress | null> {
  try {
    // Cherche si une progression existe déjà pour cette leçon
    let existing: Progress | null = null;
    try {
      existing = await pb.collection("progress").getFirstListItem<Progress>(
        `user_id = "${data.user_id}" && lesson_id = "${data.lesson_id}"`
      );
    } catch {
      // Pas encore de progression → on crée
    }

    if (existing) {
      return await pb.collection("progress").update<Progress>(existing.id, {
        ...data,
        completed_at: new Date().toISOString(),
      });
    } else {
      return await pb.collection("progress").create<Progress>({
        ...data,
        completed_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Erreur sauvegarde progression :", error);
    return null;
  }
}

// ── Badges ─────────────────────────────────────────────────────────────────

export async function getUserBadges(userId: string): Promise<Badge[]> {
  try {
    const userBadges = await pb.collection("user_badges").getFullList({
      filter: `user_id = "${userId}"`,
      expand: "badge_id",
      sort: "-earned_at",
    });
    return userBadges.map((ub) => ub.expand?.badge_id as Badge).filter(Boolean);
  } catch (error) {
    console.error("Erreur récupération badges :", error);
    return [];
  }
}

// ── Dictionnaire ───────────────────────────────────────────────────────────

export async function getDictionary(opts?: {
  category?: string;
  level?: number;
  search?: string;
}): Promise<DictionaryEntry[]> {
  try {
    const filters: string[] = [];
    if (opts?.category) filters.push(`category = "${opts.category}"`);
    if (opts?.level)    filters.push(`level = ${opts.level}`);
    if (opts?.search)   filters.push(`word ~ "${opts.search}"`);

    return await pb.collection("dictionary").getFullList<DictionaryEntry>({
      sort: "word",
      filter: filters.join(" && "),
    });
  } catch (error) {
    console.error("Erreur récupération dictionnaire :", error);
    return [];
  }
}

// ── Auth ───────────────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  return await pb.collection("users").authWithPassword(email, password);
}

export async function registerUser(data: {
  name: string;
  prenom: string;
  email: string;
  password: string;
  company?: string;
}) {
  const user = await pb.collection("users").create<SwaanUser>({
    email: data.email,
    password: data.password,
    passwordConfirm: data.password,
    name: data.name,
    prenom: data.prenom,
    actif: true,
    role: "collaborateur",
    company: data.company,
  });

  await login(data.email, data.password);
  return user;
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

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "admin";
}
