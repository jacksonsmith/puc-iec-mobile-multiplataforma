package com.puciec.cocktailkmp.data

import kotlinx.serialization.Serializable

@Serializable
data class DrinkListResponse(
    val drinks: List<DrinkSummary>? = null,
)

@Serializable
data class DrinkSummary(
    val idDrink: String,
    val strDrink: String,
    val strDrinkThumb: String? = null,
)

@Serializable
data class DrinkDetailResponse(
    val drinks: List<DrinkDetail>? = null,
)

@Serializable
data class DrinkDetail(
    val idDrink: String,
    val strDrink: String,
    val strCategory: String? = null,
    val strAlcoholic: String? = null,
    val strGlass: String? = null,
    val strDrinkThumb: String? = null,
)

fun capitalize(value: String): String =
    if (value.isEmpty()) value else value[0].uppercase() + value.substring(1)
