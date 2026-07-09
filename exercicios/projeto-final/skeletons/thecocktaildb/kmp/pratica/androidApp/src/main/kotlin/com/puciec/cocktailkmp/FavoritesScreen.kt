package com.puciec.cocktailkmp

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
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
import com.puciec.cocktailkmp.data.TheCocktailDbApi
import com.puciec.cocktailkmp.data.DrinkSummary

@Composable
fun FavoritesScreen(
    api: TheCocktailDbApi,
    favoritesStore: FavoritesStore,
    onSelect: (String) -> Unit
) {
    var favorites by remember { mutableStateOf<List<DrinkSummary>?>(null) }

    LaunchedEffect(Unit) {
        val all = api.fetchList()
        val favoriteIDs = favoritesStore.load()
        favorites = all.filter { favoriteIDs.contains(it.idDrink) }
    }

    val current = favorites
    when {
        current == null -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }

        current.isEmpty() -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("Nenhum favorito ainda.")
        }

        else -> LazyColumn(Modifier
            .fillMaxSize()
            .statusBarsPadding()) {
            items(current, key = { it.idDrink }) { drink ->
                Text(
                    text = drink.strDrink,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("favorite-item-${drink.idDrink}")
                        .clickable { onSelect(drink.idDrink) }
                        .padding(16.dp),
                    style = MaterialTheme.typography.bodyLarge,
                )
            }
        }
    }
}
