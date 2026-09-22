package com.puciec.rickmortykmp

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import com.puciec.rickmortykmp.data.RickAndMortyApi
import com.puciec.rickmortykmp.data.CharacterDetail
import com.puciec.rickmortykmp.data.capitalize

@Composable
fun DetailScreen(
    api: RickAndMortyApi,
    favoritesStore: FavoritesStore,
    characterId: Int,
    onBack: () -> Unit,
) {
    var detail by remember { mutableStateOf<CharacterDetail?>(null) }
    var isFavorite by remember { mutableStateOf(favoritesStore.load().contains(characterId)) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(characterId) {
        try {
            detail = api.fetchDetail(characterId)
        } catch (t: Throwable) {
            error = "Não foi possível carregar o detalhe."
        }
    }

    Column(Modifier.fillMaxSize().testTag("detail-screen").padding(16.dp)) {
        Text(
            text = "< Voltar",
            modifier = Modifier.testTag("detail-back-button").clickable { onBack() },
        )
        when {
            error != null -> Text(error!!)
            detail == null -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
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
                                val ids = favoritesStore.toggle(characterId)
                                isFavorite = ids.contains(characterId)
                            },
                        style = MaterialTheme.typography.headlineMedium,
                    )
                }
                Text(d.status)
                Text("Espécie: ${d.species}")
                Text("Gênero: ${d.gender}")
            }
        }
    }
}
