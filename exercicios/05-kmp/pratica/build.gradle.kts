plugins {
    // this is necessary to avoid the plugins to be loaded multiple times
    // in each subproject's classloader
    alias(libs.plugins.androidApplication) apply false
    alias(libs.plugins.androidMultiplatformLibrary) apply false
    alias(libs.plugins.composeMultiplatform) apply false
    alias(libs.plugins.composeCompiler) apply false
    alias(libs.plugins.kotlinMultiplatform) apply false
}

// Projeto vive dentro do OneDrive; a sincronização trava arquivos em build/
// enquanto o Gradle escreve, causando falhas intermitentes (IOException:
// Unable to delete directory). Redireciona todas as pastas build/ para fora
// da árvore sincronizada.
val externalBuildRoot = File(System.getProperty("user.home"), ".gradle-builds/kmp-pratica-kmp")
allprojects {
    layout.buildDirectory.set(externalBuildRoot.resolve(path.removePrefix(":").ifEmpty { "root" }.replace(":", "/")))
}