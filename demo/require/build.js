({
    appDir: "./src",
    dir: "./_dist",
    // baseUrl: "",
    optimize: "none",
    findNestedDependencies: true,
    removeCombined: true,
    mainConfigFile: './src/app.config.js',
    modules: [
        {name: "app" }
    ]
})



