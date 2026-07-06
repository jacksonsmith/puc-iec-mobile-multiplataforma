package com.puciec.rickmortykmp.data

import kotlinx.serialization.Serializable

@Serializable
data class CharacterListResponse(
    val results: List<CharacterSummary>,
)

@Serializable
data class CharacterSummary(
    val id: Int,
    val name: String,
)

@Serializable
data class CharacterDetail(
    val id: Int,
    val name: String,
    val status: String,
    val species: String,
    val gender: String,
    val image: String,
)

fun capitalize(value: String): String =
    if (value.isEmpty()) value else value[0].uppercase() + value.substring(1)
