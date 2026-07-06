package com.puciec.ghiblikmp.data

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

private const val BASE_URL = "https://ghibliapi.vercel.app"

class GhibliApi {
    private val client = HttpClient {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    suspend fun fetchList(): List<FilmSummary> =
        client.get("$BASE_URL/films").body()

    suspend fun fetchDetail(id: String): FilmDetail =
        client.get("$BASE_URL/films/$id").body()

    // A própria API filtra por diretor — sem precisar de endpoint separado
    // de "categoria" como o PokeAPI.
    suspend fun fetchTitlesByDirector(director: String): Set<String> {
        val films: List<FilmSummary> = client.get("$BASE_URL/films") {
            parameter("director", director)
        }.body()
        return films.map { it.title }.toSet()
    }
}
