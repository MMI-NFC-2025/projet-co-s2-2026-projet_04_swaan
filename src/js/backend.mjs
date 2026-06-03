import PocketBase from "pocketbase";

const pbUrl =
    import.meta.env?.PUBLIC_POCKETBASE_URL ||
    "https://swaanpb.tebrouri.fr";

const pb = new PocketBase(pbUrl);

export { pb };

// Image
export function getImageUrl(record, imageField) {
    const image = record?.[imageField] || imageField;
    if (!record || !image) return "";
    return pb.files.getURL(record, image);
}

// Offres
export async function getOffres() {
    try {
        return await pb.collection("offres").getFullList({ sort: "created" });
    } catch (error) {
        console.error("Erreur récupération offres :", error);
        return [];
    }
}

// Signes
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

// Jeux
export async function getJeux() {
    try {
        return await pb.collection("jeux").getFullList({ sort: "created" });
    } catch (error) {
        console.error("Erreur récupération jeux :", error);
        return [];
    }
}

// Modules
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

// Entreprises
export async function getCompanies() {
    try {
        return await pb.collection("companies").getFullList({ sort: "name" });
    } catch (error) {
        console.error("Erreur récupération entreprises :", error);
        return [];
    }
}

// Authentification
export async function login(email, password) {
    return await pb.collection("users").authWithPassword(email, password);
}

export async function Userauth(login, mdp) {
    return await pb.collection("users").authWithPassword(login, mdp);
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
