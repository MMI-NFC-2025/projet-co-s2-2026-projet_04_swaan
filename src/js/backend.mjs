import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

export { pb };

// ── Image ──────────────────────────────────────────────────────────────────

export async function getImageUrl(record, imageField) {
    return pb.files.getURL(record, record[imageField]);
}

// ── Offres ─────────────────────────────────────────────────────────────────

export async function getOffres() {
    try {
        return await pb.collection("offres").getFullList({ sort: "created" });
    } catch (error) {
        console.error("Erreur récupération offres :", error);
        return [];
    }
}

// ── Signes ─────────────────────────────────────────────────────────────────

export async function getSignes(categorie, niveau, search) {
    try {
        const filters = [];
        if (categorie) filters.push(`categorie = "${categorie}"`);
        if (niveau) filters.push(`niveau = ${niveau}`);
        if (search) filters.push(`mots ~ "${search}"`);

        return await pb.collection("signe").getFullList({
            sort: "mots",
            filter: filters.join(" && "),
        });
    } catch (error) {
        console.error("Erreur récupération signes :", error);
        return [];
    }
}

// ── Jeux ───────────────────────────────────────────────────────────────────

export async function getJeux() {
    try {
        return await pb.collection("jeux").getFullList({ sort: "created" });
    } catch (error) {
        console.error("Erreur récupération jeux :", error);
        return [];
    }
}

// ── Modules ────────────────────────────────────────────────────────────────

export async function getModules() {
    try {
        return await pb.collection("modules").getFullList({ sort: "order" });
    } catch (error) {
        console.error("Erreur récupération modules :", error);
        return [];
    }
}

export async function getModuleById(id) {
    try {
        return await pb.collection("modules").getOne(id);
    } catch (error) {
        console.error("Erreur récupération module :", error);
        return null;
    }
}

// ── Leçons ─────────────────────────────────────────────────────────────────

export async function getLessons(moduleId) {
    try {
        const filter = moduleId ? `module_id = "${moduleId}"` : "";
        return await pb.collection("lessons").getFullList({ sort: "order", filter });
    } catch (error) {
        console.error("Erreur récupération leçons :", error);
        return [];
    }
}

export async function getLessonById(id) {
    try {
        return await pb.collection("lessons").getOne(id);
    } catch (error) {
        console.error("Erreur récupération leçon :", error);
        return null;
    }
}

// ── Auth ───────────────────────────────────────────────────────────────────

export async function login(email, password) {
    return await pb.collection("users").authWithPassword(email, password);
}

export async function createNewUser(userData) {
    return await pb.collection("users").create(userData);
}

export async function registerUser(nom, prenom, email, password, company) {
    const user = await pb.collection("users").create({
        email,
        password,
        passwordConfirm: password,
        name: nom,
        prenom,
        actif: true,
        role: "collaborateur",
        company: company || "",
    });
    await login(email, password);
    return user;
}

export function logout() {
    pb.authStore.clear();
}

export function isAuthValid() {
    return pb.authStore.isValid;
}

export function getCurrentUser() {
    return pb.authStore.isValid ? pb.authStore.record : null;
}

export function isAdmin() {
    const user = getCurrentUser();
    return user?.role === "admin";
}
