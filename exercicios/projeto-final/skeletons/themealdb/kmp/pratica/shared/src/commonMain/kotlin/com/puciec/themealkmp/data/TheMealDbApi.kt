package com.puciec.themealkmp.data

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.parameter
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

private const val BASE_URL = "https://www.themealdb.com/api/json/v1/1"

class TheMealDbApi {
    private val client = HttpClient {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    suspend fun fetchList(): List<MealSummary> {
        val response: MealListResponse = client.get("$BASE_URL/search.php") {
            parameter("s", "")
        }.body()
        return response.meals ?: emptyList()
    }

    suspend fun fetchDetail(id: String): MealDetail {
        val response: MealDetailResponse = client.get("$BASE_URL/lookup.php") {
            parameter("i", id)
        }.body()
        return response.meals!!.first()
    }

    // A própria API filtra por categoria — sem precisar de endpoint separado
    // de "tipo" como o PokeAPI.
    suspend fun fetchNamesByCategory(category: String): Set<String> {
        val response: MealListResponse = client.get("$BASE_URL/filter.php") {
            parameter("c", category)
        }.body()
        return (response.meals ?: emptyList()).map { it.strMeal }.toSet()
    }
}
