package com.puciec.themealkmp.data

import kotlinx.serialization.Serializable

@Serializable
data class MealListResponse(
    val meals: List<MealSummary>? = null,
)

@Serializable
data class MealSummary(
    val idMeal: String,
    val strMeal: String,
    val strMealThumb: String? = null,
)

@Serializable
data class MealDetailResponse(
    val meals: List<MealDetail>? = null,
)

@Serializable
data class MealDetail(
    val idMeal: String,
    val strMeal: String,
    val strCategory: String? = null,
    val strArea: String? = null,
    val strMealThumb: String? = null,
)
