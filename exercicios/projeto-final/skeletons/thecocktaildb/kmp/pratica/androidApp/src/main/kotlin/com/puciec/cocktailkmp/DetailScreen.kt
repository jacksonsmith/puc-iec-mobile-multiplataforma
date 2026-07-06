package com.puciec.cocktailkmp

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
import com.puciec.cocktailkmp.data.TheCocktailDbApi
import com.puciec.cocktailkmp.data.DrinkDetail

@Composable
fun DetailScreen(
    api: TheCocktailDbApi,
    favoritesStore: FavoritesStore,
    drinkId: String,
    onBack: () -> Unit,
) {
    var detail by remember { mutableStateOf<DrinkDetail?>(null) }
    var isFavorite by remember { mutableStateOf(favoritesStore.load().contains(drinkId)) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(drinkId) {
        // TODO 2 (feature 2 — detalhe): chamar api.fetchDetail(drinkId) e
        // guardar em `detail`. Tratar erro em `error` (try/catch).
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
                        text = d.strDrink,
                        style = MaterialTheme.typography.headlineMedium,
                        modifier = Modifier.testTag("detail-title"),
                    )
                    Text(
                        text = if (isFavorite) "♥" else "♡",
                        modifier = Modifier
                            .testTag("detail-favorite-button")
                            .clickable {
                                // TODO 5 (feature 5 — favoritos): chamar
                                // favoritesStore.toggle(drinkId) e atualizar
                                // `isFavorite` com o resultado.
                            },
                        style = MaterialTheme.typography.headlineMedium,
                    )
                }
                Text(d.strCategory ?: "")
                Text("Alcoólico: ${d.strAlcoholic ?: ""}")
                Text("Copo: ${d.strGlass ?: ""}")
            }
        }
    }
}
