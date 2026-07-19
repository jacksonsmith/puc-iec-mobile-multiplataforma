package com.puciec.pokedexkmp

import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.puciec.pokedexkmp.data.PokeApi
import com.puciec.pokedexkmp.data.PokemonDetailResponse
import com.puciec.pokedexkmp.data.capitalize

@Composable
fun DetailScreen(
    api: PokeApi,
    favoritesStore: FavoritesStore,
    pokemonId: Int,
    onBack: () -> Unit,
) {
    var detail by remember { mutableStateOf<PokemonDetailResponse?>(null) }
    var imageBitmap by remember { mutableStateOf<ImageBitmap?>(null) }
    var isFavorite by remember { mutableStateOf(favoritesStore.load().contains(pokemonId)) }
    var error by remember { mutableStateOf<String?>(null) }

    suspend fun loadPokemonDetail(pokemonId: Int) {
        detail = api.fetchDetail(pokemonId)

        val imageBytes = api.fetchImageBytes(detail!!.sprites.frontDefault)

        imageBitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
            .asImageBitmap()
    }

    LaunchedEffect(pokemonId) {
        try {
            loadPokemonDetail(pokemonId)
        } catch (e: Exception) {
            error = e.message ?: "Erro desconhecido"
        }
    }

    Column(Modifier.fillMaxSize().testTag("detail-screen").padding(16.dp)) {
        Text(
            text = "< Voltar",
            modifier = Modifier.testTag("detail-back-button").clickable { onBack() },
        )
        when {
            error != null -> Text(error!!)
            detail == null || imageBitmap == null -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
            else -> {
                val d = detail!!
                Row(
                    Modifier.fillMaxWidth().padding(top = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Text(
                        text = capitalize(d.name),
                        style = MaterialTheme.typography.headlineMedium,
                        modifier = Modifier.testTag("detail-title"),
                    )
                    Text(
                        text = if (isFavorite) "♥" else "♡",
                        modifier = Modifier
                            .testTag("detail-favorite-button")
                            .clickable {
                                val toggle: Set<Int> = favoritesStore.toggle(pokemonId)

                                isFavorite = toggle.contains(pokemonId)
                            },
                        style = MaterialTheme.typography.headlineMedium,
                    )
                }
                Image(
                    bitmap = imageBitmap!!,
                    contentDescription = d.name,
                    modifier = Modifier
                        .size(250.dp)
                        .align(Alignment.CenterHorizontally)
                )
                Text(d.types.joinToString(", ") { it.type.name })
                Text("Altura: ${d.height / 10.0} m")
                Text("Peso: ${d.weight / 10.0} kg")
            }
        }
    }
}
