package com.puciec.rickmortykmp.data

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

private const val BASE_URL = "https://rickandmortyapi.com/api"

class RickAndMortyApi {
    private val client = HttpClient {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    suspend fun fetchList(page: Int = 1): List<CharacterSummary> {
        val response: CharacterListResponse = client.get("$BASE_URL/character") {
            parameter("page", page)
        }.body()
        return response.results
    }

    suspend fun fetchDetail(id: Int): CharacterDetail =
        client.get("$BASE_URL/character/$id").body()

    // A própria API filtra por status — sem precisar de endpoint separado
    // de "tipo" como o PokeAPI.
    suspend fun fetchNamesByStatus(status: String): Set<String> {
        val response: CharacterListResponse = client.get("$BASE_URL/character/") {
            parameter("status", status)
        }.body()
        return response.results.map { it.name }.toSet()
    }
}
