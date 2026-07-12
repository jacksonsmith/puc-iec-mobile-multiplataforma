package com.puciec.pokedexkmp

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.puciec.pokedexkmp.data.PokeApi
import com.puciec.pokedexkmp.data.PokemonSummary
import com.puciec.pokedexkmp.data.capitalize

@Composable
fun FavoritesScreen(api: PokeApi, favoritesStore: FavoritesStore, onSelect: (Int) -> Unit) {
    var favorites by remember { mutableStateOf<List<PokemonSummary>?>(null) }

    LaunchedEffect(Unit) {
        // TODO 5 (feature 5 — favoritos): cruzar favoritesStore.load() (ids)
        // com api.fetchList() (dados), guardar em `favorites`.
        favorites = emptyList()
    }

    val current = favorites
    when {
        current == null -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        current.isEmpty() -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("Nenhum favorito ainda.")
        }
        else -> LazyColumn(Modifier.fillMaxSize()) {
            items(current, key = { it.id }) { pokemon ->
                Text(
                    text = capitalize(pokemon.name),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("favorite-item-${pokemon.id}")
                        .clickable { onSelect(pokemon.id) }
                        .padding(16.dp),
                    style = MaterialTheme.typography.bodyLarge,
                )
            }
        }
    }
}
