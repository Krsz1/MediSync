export default {
    testEnvironment: "node",
    moduleFileExtensions: ["js", "json"],
    transform: {
        "^.+\\.js$": "babel-jest",  // Asegúrate de tener babel-jest instalado
    },
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/build/",
    ],
    // Asegúrate de que Jest entienda los módulos ES
    transformIgnorePatterns: [
        "/node_modules/(?!@firebase/.*)"  // Ignorar la transformación de los módulos que no deben ser transformados por Babel
    ],
};
