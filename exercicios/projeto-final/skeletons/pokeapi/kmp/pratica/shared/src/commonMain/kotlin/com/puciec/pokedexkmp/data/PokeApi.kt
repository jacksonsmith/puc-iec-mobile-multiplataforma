package com.puciec.pokedexkmp.data

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

private const val BASE_URL = "https://pokeapi.co/api/v2"

class PokeApi {
    private val client = HttpClient {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    suspend fun fetchList(limit: Int = 151): List<PokemonSummary> {
        val response: PokemonListResponse = client.get("$BASE_URL/pokemon") {
            parameter("limit", limit)
            parameter("offset", 0)
        }.body()
        return response.results.map { it.toSummary() }
    }

    suspend fun fetchDetail(id: Int): PokemonDetailResponse =
        client.get("$BASE_URL/pokemon/$id").body()

    suspend fun fetchNamesByType(type: String): Set<String> {
        val response: PokemonTypeResponse = client.get("$BASE_URL/type/$type").body()
        return response.pokemon.map { it.pokemon.name }.toSet()
    }
}
