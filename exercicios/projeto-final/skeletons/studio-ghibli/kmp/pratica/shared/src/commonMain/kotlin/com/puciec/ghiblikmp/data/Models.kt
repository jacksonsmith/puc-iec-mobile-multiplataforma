package com.puciec.ghiblikmp.data

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class FilmSummary(
    val id: String,
    val title: String,
)

@Serializable
data class FilmDetail(
    val id: String,
    val title: String,
    val director: String,
    @SerialName("release_date") val releaseDate: String,
    @SerialName("running_time") val runningTime: String,
    val image: String,
)

fun capitalize(value: String): String =
    if (value.isEmpty()) value else value[0].uppercase() + value.substring(1)
