import PocketBase from "pocketbase";
const pb = new PocketBase("https://swaanpb.tebrouri.fr");
export { pb };

// Image
export function getImageUrl(record, imageField) {
    if (!record || !imageField) return "";

    const fieldExists = Object.prototype.hasOwnProperty.call(record, imageField);
    if (!fieldExists && typeof imageField === "string" && !imageField.includes(".")) {
        return "";
    }

    const imageValue = fieldExists ? record[imageField] : imageField;
    const image = Array.isArray(imageValue) ? imageValue[0] : imageValue;
    if (!image) return "";

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

export function getSignWord(record) {
    return String(record?.mots || record?.mot || record?.word || "").trim();
}

function normalizeVideoKey(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

const localSignVideos = {
    aide: "Aide.mp4",
    bonjour: "Bonjour.mp4",
    bouche: "Bouche.mp4",
    cafe: "Café.mp4",
    chat: "chat.mp4",
    chien: "Chien.mp4",
    coeur: "coeur.mp4",
    eau: "Eau.mp4",
    lapin: "Lapin.mp4",
    main: "Main.mp4",
    merci: "Merci.mp4",
    non: "Non.mp4",
    oiseau: "Oiseaux.mp4",
    oiseaux: "Oiseaux.mp4",
    oui: "Oui.mp4",
    pain: "Pain.mp4",
    poisson: "poisson.mp4",
    pomme: "Pomme.mp4",
    repas: "Repas.mp4",
    tete: "tête.mp4",
    yeux: "yeux.mp4",
};

export function getLocalSignVideoUrl(signe) {
    const videoFile = localSignVideos[normalizeVideoKey(getSignWord(signe))];
    return videoFile ? `/assets/video/${encodeURIComponent(videoFile)}` : "";
}

export function normalizeSignCategory(value) {
    const category = String(value || "").trim().toLowerCase();
    if (category.includes("quotidien") || category.includes("geste")) return "quotidien";
    if (category.includes("corps")) return "corps";
    if (category.includes("animaux") || category.includes("animal")) return "animaux";
    if (category.includes("nourriture")) return "nourriture";
    return category;
}

export function getLexicalCategories() {
    return [
        { id: "quotidien", label: "Gestes du quotidien" },
        { id: "corps", label: "Corps" },
        { id: "animaux", label: "Animaux" },
        { id: "nourriture", label: "Nourriture" },
    ];
}

export function getCategoryLabels() {
    return Object.fromEntries(getLexicalCategories().map((category) => [category.id, category.label]));
}

export function getCategoryIntro(categoryId) {
    const intros = {
        quotidien: "Les signes à connaître en premier pour saluer, répondre et interagir simplement.",
        corps: "Le vocabulaire utile pour parler du corps, de la santé et des besoins immédiats.",
        animaux: "Une catégorie ludique pour enrichir le vocabulaire et travailler la mémorisation.",
        nourriture: "Les signes pratiques pour parler de repas, de boissons et de préférences.",
    };

    return intros[categoryId] || "Une sélection de signes pour enrichir votre vocabulaire LSF.";
}

export function getDictionaryCategories(signes = []) {
    return getLexicalCategories().map((category) => {
        const signe = signes.find((record) => normalizeSignCategory(record.categorie || record.category) === category.id);

        return {
            ...category,
            intro: getCategoryIntro(category.id),
            image: signe ? getImageUrl(signe, "img_signe") : "",
        };
    });
}

export function getSignVideoUrl(signe) {
    return (
        getLocalSignVideoUrl(signe) ||
        getImageUrl(signe, "video_signe") ||
        getImageUrl(signe, "video") ||
        signe?.video_url ||
        signe?.sign_video_url ||
        ""
    );
}

export function formatGameSign(record) {
    return {
        id: record.id,
        word: getSignWord(record),
        category: normalizeSignCategory(record.categorie || record.category),
        image: getImageUrl(record, "img_signe"),
    };
}

export async function getGameSignes(limit = 100) {
    const signes = await getSignes();

    return signes
        .map(formatGameSign)
        .filter((signe) => signe.word && signe.image)
        .slice(0, limit);
}

export async function getLexicalGameSignes(limit = 12) {
    const allowedCategories = getLexicalCategories().map((category) => category.id);
    const signes = await getGameSignes(100);

    return signes
        .filter((signe) => allowedCategories.includes(signe.category))
        .slice(0, limit);
}

function shuffleItems(items) {
    return [...items].sort(() => Math.random() - 0.5);
}

export async function getVraiFauxQuestions(limit = 6) {
    const signes = await getGameSignes(100);

    return shuffleItems(signes)
        .slice(0, limit)
        .map((signe, index, selectedSigns) => {
            const shouldBeTrue = index % 2 === 0;
            const wrongSign = shuffleItems(signes.filter((item) => item.word !== signe.word))[0] || selectedSigns[0] || signe;
            const proposed = shouldBeTrue ? signe.word : wrongSign.word;

            return {
                image: signe.image,
                proposed,
                isTrue: shouldBeTrue,
                hint: "Observe bien l'illustration.",
                feedback: shouldBeTrue
                    ? `Ce signe représente bien ${signe.word}.`
                    : `Faux : cette illustration correspond au signe ${signe.word}.`,
            };
        });
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

function getGamePage(type) {
    const pages = {
        memory: "/jeu-memoire",
        memoire: "/jeu-memoire",
        quiz: "/jeu-quiz",
        vrai_faux: "/jeu-vrai-faux",
        "vrai/faux": "/jeu-vrai-faux",
        champ_lexical: "/jeu-champ-lexical",
    };

    return pages[type] || "/jeux";
}

function getGameTitle(type) {
    const titles = {
        memory: "Memory",
        memoire: "Memory",
        quiz: "Quiz",
        vrai_faux: "Vrai / Faux",
        "vrai/faux": "Vrai / Faux",
        champ_lexical: "Champ lexical",
    };

    return titles[type] || String(type || "Jeu").replace("_", " ");
}

function getGameTag(type) {
    const tags = {
        memory: "Associer",
        memoire: "Associer",
        quiz: "Tester",
        vrai_faux: "Réviser",
        "vrai/faux": "Réviser",
        champ_lexical: "Catégoriser",
    };

    return tags[type] || "SWAAN";
}

function getGameSubtitle(type) {
    const subtitles = {
        memory: "Vocabulaire du quotidien",
        memoire: "Vocabulaire du quotidien",
        quiz: "Révision rapide",
        vrai_faux: "Expressions courantes",
        "vrai/faux": "Expressions courantes",
        champ_lexical: "Classer par thème",
    };

    return subtitles[type] || "Réviser les signes LSF";
}

export async function getGameCatalog() {
    const [jeuxRecords, signes] = await Promise.all([getJeux(), getGameSignes(8)]);
    const seen = new Set();

    return jeuxRecords
        .filter((game) => {
            const type = String(game.type_jeux || game.type || "quiz").toLowerCase();
            if (seen.has(type)) return false;
            seen.add(type);
            return true;
        })
        .map((game, index) => {
            const type = String(game.type_jeux || game.type || "quiz").toLowerCase();
            const signImage = signes[index % Math.max(signes.length, 1)]?.image || "";

            return {
                title: game.title || getGameTitle(type),
                subtitle: game.subtitle || getGameSubtitle(type),
                description: game.description || game.enonce || "Mini-jeu connecté à PocketBase pour travailler les signes et la progression.",
                href: game.href || getGamePage(type),
                image: game.image ? getImageUrl(game, "image") : signImage,
                status: "Disponible",
                meta: game.reponse_correct ? `Réponse : ${game.reponse_correct}` : game.meta || "SWAAN",
                tag: getGameTag(type),
            };
        });
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

export function saveLocalGameSession(session) {
    if (typeof localStorage === "undefined") return;

    const previous = JSON.parse(localStorage.getItem("swaan_game_sessions") || "[]");
    localStorage.setItem("swaan_game_sessions", JSON.stringify([session, ...previous].slice(0, 50)));
}

export async function saveGameProgress(game, score, total, minutes = 6) {
    const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0;
    const session = {
        game,
        score,
        total,
        learned: Math.min(3, score),
        minutes,
        createdAt: new Date().toISOString(),
    };

    saveLocalGameSession(session);

    if (!pb.authStore.isValid) return false;

    try {
        await pb.collection("progress").create({
            user_id: pb.authStore.record.id,
            completed: true,
            score: scorePercent,
            completed_at: session.createdAt,
        });
        await unlockUserBadges(scorePercent);
        return true;
    } catch (error) {
        console.error("Erreur sauvegarde progression :", error);
        return false;
    }
}

function normalizeText(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function shouldUnlockBadge(badge, stats, currentScore) {
    const badgeText = normalizeText(`${badge.name} ${badge.condition} ${badge.description}`);

    if (badgeText.includes("premiere") || badgeText.includes("1 jeu")) {
        return stats.sessionsCount >= 1;
    }

    if (badgeText.includes("memoire") || badgeText.includes("3 signes")) {
        return stats.signsLearned >= 3;
    }

    if (badgeText.includes("score") || badgeText.includes("70")) {
        return stats.bestScore >= 70 || currentScore >= 70;
    }

    if (badgeText.includes("regularite") || badgeText.includes("2 jours")) {
        return stats.activeDays >= 2;
    }

    return false;
}

async function unlockUserBadges(currentScore) {
    if (!pb.authStore.isValid) return;

    try {
        const userId = pb.authStore.record.id;
        const [progressRecords, badges, earnedBadges] = await Promise.all([
            pb.collection("progress").getFullList({
                sort: "-completed_at",
                filter: `user_id = "${userId}"`,
            }),
            pb.collection("badges").getFullList({ sort: "created" }),
            pb.collection("user_badges").getFullList({
                filter: `user_id = "${userId}"`,
            }),
        ]);

        const earnedIds = new Set(earnedBadges.map((item) => item.badge_id));
        const activeDays = new Set(progressRecords.map((item) => new Date(item.completed_at || item.created).toDateString())).size;
        const bestScore = progressRecords.reduce((best, item) => Math.max(best, Number(item.score || 0)), currentScore);
        const completedSessions = progressRecords.filter((item) => item.completed).length;

        const stats = {
            sessionsCount: progressRecords.length,
            signsLearned: completedSessions * 3,
            bestScore,
            activeDays,
        };

        const badgesToUnlock = badges.filter((badge) => !earnedIds.has(badge.id) && shouldUnlockBadge(badge, stats, currentScore));

        await Promise.all(
            badgesToUnlock.map((badge) =>
                pb.collection("user_badges").create({
                    user_id: userId,
                    badge_id: badge.id,
                    earned_at: new Date().toISOString(),
                })
            )
        );
    } catch (error) {
        console.error("Erreur déblocage badges :", error);
    }
}

export const defaultBadges = [
    {
        id: "premiere-session",
        name: "Première session",
        description: "Terminer un premier mini-jeu.",
        icon: "✓",
        condition: "1 jeu terminé",
        neededSessions: 1,
    },
    {
        id: "memoire-active",
        name: "Mémoire active",
        description: "Réviser au moins 3 signes.",
        icon: "S",
        condition: "3 signes travaillés",
        neededSigns: 3,
    },
    {
        id: "bon-score",
        name: "Bon score",
        description: "Atteindre 70 % de réussite.",
        icon: "%",
        condition: "70 % de réussite",
        neededSuccess: 70,
    },
    {
        id: "regularite",
        name: "Régularité",
        description: "Apprendre sur deux journées différentes.",
        icon: "2",
        condition: "2 jours actifs",
        neededDays: 2,
    },
];

export async function getCurrentUserProgressSessions() {
    if (!pb.authStore.isValid) return [];

    try {
        const records = await pb.collection("progress").getFullList({
            sort: "-completed_at",
            filter: `user_id = "${pb.authStore.record.id}"`,
        });

        return records.map((record) => ({
            game: "pocketbase",
            score: Number(record.score || 0),
            total: 100,
            learned: record.completed ? 3 : 0,
            minutes: 6,
            createdAt: record.completed_at || record.updated || record.created,
            fromPocketBase: true,
        }));
    } catch (error) {
        console.error("Erreur lecture progression :", error);
        return [];
    }
}

export async function getCurrentUserBadges() {
    try {
        const badges = await pb.collection("badges").getFullList({ sort: "created" });

        if (!pb.authStore.isValid) {
            return badges.map((badge) => ({ ...badge, earned: false }));
        }

        const earnedBadges = await pb.collection("user_badges").getFullList({
            expand: "badge_id",
            filter: `user_id = "${pb.authStore.record.id}"`,
        });
        const earnedIds = new Set(earnedBadges.map((item) => item.badge_id));

        return badges.map((badge) => ({
            id: badge.id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            condition: badge.condition,
            earned: earnedIds.has(badge.id),
        }));
    } catch (error) {
        console.error("Erreur lecture badges :", error);
        return [];
    }
}

export function buildFallbackBadges(sessions) {
    const totalScore = sessions.reduce((sum, session) => sum + Number(session.score || 0), 0);
    const totalQuestions = sessions.reduce((sum, session) => sum + Number(session.total || 0), 0);
    const totalLearned = sessions.reduce((sum, session) => sum + Number(session.learned || 0), 0);
    const successRate = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
    const activeDays = new Set(sessions.map((session) => new Date(session.createdAt).toDateString())).size;

    return defaultBadges.map((badge) => ({
        ...badge,
        earned:
            (badge.neededSessions && sessions.length >= badge.neededSessions) ||
            (badge.neededSigns && totalLearned >= badge.neededSigns) ||
            (badge.neededSuccess && successRate >= badge.neededSuccess) ||
            (badge.neededDays && activeDays >= badge.neededDays),
    }));
}
