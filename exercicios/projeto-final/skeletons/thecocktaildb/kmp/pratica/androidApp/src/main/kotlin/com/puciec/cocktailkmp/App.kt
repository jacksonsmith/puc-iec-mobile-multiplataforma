package com.puciec.cocktailkmp

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import com.puciec.cocktailkmp.data.TheCocktailDbApi

sealed class Screen {
    data object List : Screen()
    data class Detail(val drinkId: String) : Screen()
    data object Favorites : Screen()
}

@Composable
fun App(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val api = remember { TheCocktailDbApi() }
    val favoritesStore = remember { FavoritesStore(context) }

    var screen by remember { mutableStateOf<Screen>(Screen.List) }
    var origin by remember { mutableStateOf<Screen>(Screen.List) }

    MaterialTheme {
        Surface(modifier = modifier) {
            Column(Modifier.fillMaxSize()) {
                Box(Modifier.weight(1f)) {
                    when (val current = screen) {
                        is Screen.List -> ListScreen(
                            api = api,
                            onSelect = { id ->
                                origin = Screen.List
                                screen = Screen.Detail(id)
                            },
                        )
                        is Screen.Detail -> DetailScreen(
                            api = api,
                            favoritesStore = favoritesStore,
                            drinkId = current.drinkId,
                            onBack = { screen = origin },
                        )
                        is Screen.Favorites -> FavoritesScreen(
                            api = api,
                            favoritesStore = favoritesStore,
                            onSelect = { id ->
                                origin = Screen.Favorites
                                screen = Screen.Detail(id)
                            },
                        )
                    }
                }
                BottomNav(
                    active = screen,
                    onSelectList = { screen = Screen.List },
                    onSelectFavorites = { screen = Screen.Favorites },
                )
            }
        }
    }
}
