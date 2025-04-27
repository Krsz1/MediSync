export default {
    testEnvironment: "node",
    moduleFileExtensions: ["js", "json"],
    transform: {
        "^.+\\.js$": "babel-jest",  
    },
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/build/",
    ],
    transformIgnorePatterns: [
        "/node_modules/(?!@firebase/.*)" 
    ],
};
