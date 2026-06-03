import {
    getOffres,
    getSignes,
    getJeux,
    getModules,
    getModuleById,
    getLessons,
    getLessonById,
    login,
    logout,
    isAuthValid,
    getCurrentUser,
    createNewUser,
    registerUser,
} from "./backend.mjs";

console.log("\n=== Test getOffres ===");
const offres = await getOffres();
console.log(offres);

console.log("\n=== Test getSignes (tous) ===");
const signes = await getSignes();
console.log(signes);

console.log("\n=== Test getSignes (recherche 'bonjour') ===");
const signesSearch = await getSignes(null, null, "bonjour");
console.log(signesSearch);

console.log("\n=== Test getJeux ===");
const jeux = await getJeux();
console.log(jeux);

console.log("\n=== Test getModules ===");
const modules = await getModules();
console.log(modules);

/*
console.log("\n=== Test getModuleById ===");
const module = await getModuleById("REMPLACE_PAR_UN_VRAI_ID");
console.log(module);
*/

console.log("\n=== Test getLessons (toutes) ===");
const lessons = await getLessons();
console.log(lessons);

/*
console.log("\n=== Test getLessonById ===");
const lesson = await getLessonById("REMPLACE_PAR_UN_VRAI_ID");
console.log(lesson);
*/

console.log("\n=== Test login (mauvais mot de passe) ===");
try {
    await login("faux@email.fr", "mauvaismdp");
} catch (error) {
    console.log("Connexion refusée (normal) :", error.message);
}

console.log("\n=== Test isAuthValid avant connexion ===");
console.log("isAuthValid :", isAuthValid());
console.log("getCurrentUser :", getCurrentUser());

/*
// Pour tester avec un vrai compte, décommente et remplis les infos :
console.log("\n=== Test login (vrai compte) ===");
await login("ton@email.fr", "TonMotDePasse!");
console.log("isAuthValid après connexion :", isAuthValid());
console.log("Utilisateur connecté :", getCurrentUser());
logout();
console.log("isAuthValid après logout :", isAuthValid());
*/

/*
console.log("\n=== Test createNewUser ===");
try {
    const newUser = await createNewUser({
        email: "testswaan@example.com",
        password: "Azerty123!",
        passwordConfirm: "Azerty123!",
        name: "Test",
        prenom: "Swaan",
        actif: true,
        role: "collaborateur",
    });
    console.log("Utilisateur créé :", newUser.id);
} catch (error) {
    console.log("Erreur création utilisateur :", error.message);
}
*/

/*
console.log("\n=== Test registerUser ===");
try {
    const user = await registerUser("Dupont", "Marie", "marie@example.com", "Azerty123!", "MMI");
    console.log("Inscription OK :", user.id);
    console.log("isAuthValid après inscription :", isAuthValid());
    logout();
} catch (error) {
    console.log("Erreur inscription :", error.message);
}
*/
