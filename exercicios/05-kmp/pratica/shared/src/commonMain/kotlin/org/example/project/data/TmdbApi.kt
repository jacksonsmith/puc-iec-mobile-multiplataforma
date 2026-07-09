package org.example.project.data

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json

// ─────────────────────────────────────────────────────────────────────────────
// TmdbApi — camada de dados (shared, funciona no Android via ktor-client-android)
//
// Documentação TMDB: https://developer.themoviedb.org/reference/movie-popular-list
// ─────────────────────────────────────────────────────────────────────────────

private const val BASE_URL = "https://api.themoviedb.org/3"

// Já pronto — o exercício é sobre construir a UI (App.kt), não a integração com a API.
class TmdbApi(private val token: String) {

    // HttpClient do Ktor com suporte a JSON (kotlinx.serialization)
    private val client = HttpClient {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    suspend fun popularMovies(page: Int = 1): MoviesResponse =
        client.get("$BASE_URL/movie/popular") {
            header("Authorization", "Bearer $token")
            parameter("language", "pt-BR")
            parameter("page", page)
        }.body()
}

// URL pública de poster do TMDB (w342 = largura 342px)
fun posterUrl(path: String?) = path?.let { "https://image.tmdb.org/t/p/w342$it" }
