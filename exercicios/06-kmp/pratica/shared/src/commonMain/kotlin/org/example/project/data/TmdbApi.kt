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

class TmdbApi(private val token: String) {

    // HttpClient do Ktor com suporte a JSON (kotlinx.serialization)
    private val client = HttpClient {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    // ── TODO 1 ────────────────────────────────────────────────────────────────
    // Implemente a função abaixo.
    //
    // Endpoint: GET $BASE_URL/movie/popular?language=pt-BR&page=1
    // Header:   Authorization: Bearer $token
    //
    // Dica: use client.get(...) { header("Authorization", "Bearer $token") }
    //       e depois .body<MoviesResponse>() pra deserializar o JSON.
    //
    // suspend fun popularMovies(page: Int = 1): MoviesResponse { ... }
    // ─────────────────────────────────────────────────────────────────────────

    suspend fun popularMovies(page: Int = 1): MoviesResponse {
        // TODO 1: substitua o stub abaixo pela chamada real ao Ktor
        return MoviesResponse(page = 1, results = emptyList(), totalPages = 0, totalResults = 0)
    }
}

// URL pública de poster do TMDB (w342 = largura 342px)
fun posterUrl(path: String?) = path?.let { "https://image.tmdb.org/t/p/w342$it" }
