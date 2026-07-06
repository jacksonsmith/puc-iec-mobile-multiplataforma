package com.puciec.pokedexkmp.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class PokemonListResponse(
    val results: List<PokemonListEntry>,
)

@Serializable
data class PokemonListEntry(
    val name: String,
    val url: String,
)

data class PokemonSummary(
    val id: Int,
    val name: String,
)

fun PokemonListEntry.toSummary(): PokemonSummary {
    val id = url.trimEnd('/').substringAfterLast('/').toInt()
    return PokemonSummary(id = id, name = name)
}

@Serializable
data class PokemonDetailResponse(
    val id: Int,
    val name: String,
    val height: Int,
    val weight: Int,
    val types: List<PokemonTypeSlot>,
)

@Serializable
data class PokemonTypeSlot(
    val type: NamedResource,
)

@Serializable
data class NamedResource(
    val name: String,
)

@Serializable
data class PokemonTypeResponse(
    @SerialName("pokemon") val pokemon: List<PokemonTypeEntry>,
)

@Serializable
data class PokemonTypeEntry(
    val pokemon: NamedResource,
)

fun spriteUrl(id: Int): String =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/$id.png"

fun capitalize(value: String): String =
    if (value.isEmpty()) value else value[0].uppercase() + value.substring(1)
