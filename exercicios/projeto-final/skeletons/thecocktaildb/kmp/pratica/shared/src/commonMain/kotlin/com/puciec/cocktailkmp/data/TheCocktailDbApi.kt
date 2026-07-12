package com.puciec.cocktailkmp.data

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

private const val BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1"

class TheCocktailDbApi {
    private val client = HttpClient {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    // Fonte primária da lista — search.php?s= (vazio) é instável na key de
    // demo, então usamos a categoria "Cocktail" via filter.php (estável).
    suspend fun fetchList(category: String = "Cocktail"): List<DrinkSummary> {
        val response: DrinkListResponse = client.get("$BASE_URL/filter.php") {
            parameter("c", category)
        }.body()
        return response.drinks ?: emptyList()
    }

    suspend fun fetchDetail(id: String): DrinkDetail {
        val response: DrinkDetailResponse = client.get("$BASE_URL/lookup.php") {
            parameter("i", id)
        }.body()
        return response.drinks!!.first()
    }

    // Mesmo endpoint usado pra lista, só troca o valor de `c`.
    suspend fun fetchNamesByCategory(category: String): Set<String> {
        val response: DrinkListResponse = client.get("$BASE_URL/filter.php") {
            parameter("c", category)
        }.body()
        return (response.drinks ?: emptyList()).map { it.strDrink }.toSet()
    }
}
