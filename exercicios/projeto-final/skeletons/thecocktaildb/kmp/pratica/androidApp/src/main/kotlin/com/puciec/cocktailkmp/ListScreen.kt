package com.puciec.cocktailkmp

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
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
import com.puciec.cocktailkmp.data.capitalize

private val CATEGORIES = listOf("shot", "beer", "shake")

private fun apiCategory(slug: String): String = when (slug) {
    "shot" -> "Shot"
    "beer" -> "Beer"
    "shake" -> "Shake"
    else -> "Cocktail"
}

@Composable
fun ListScreen(api: TheCocktailDbApi, onSelect: (String) -> Unit) {
    var all by remember { mutableStateOf<List<DrinkSummary>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    var searchText by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf<String?>(null) }
    var categoryNames by remember { mutableStateOf<Set<String>?>(null) }

    LaunchedEffect(Unit) {
        try {
            all = api.fetchList()
        } catch (e: Exception) {
            error = e.message
        } finally {
            loading = false
        }
    }

    val filtered = all.filter { it.strDrink.contains(searchText, ignoreCase = true) }

    if (loading) {
        Box(
            Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) { CircularProgressIndicator() }
        return
    }
    if (error != null) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text(error!!) }
        return
    }

    Box(
        Modifier
            .fillMaxSize()
            .testTag("item-list-screen")
    ) {
        LazyColumn(Modifier.fillMaxSize()) {
            item {
                OutlinedTextField(
                    value = searchText,
                    onValueChange = { searchText = it },
                    label = { Text("Buscar drink") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp)
                        .testTag("search-input"),
                )
            }
            item {
                LazyRow(
                    Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    item {
                        FilterChip(
                            selected = selectedCategory == null,
                            onClick = { selectedCategory = null; categoryNames = null },
                            label = { Text("Todos") },
                            modifier = Modifier.testTag("category-chip-all"),
                        )
                    }
                    items(CATEGORIES) { category ->
                        FilterChip(
                            selected = selectedCategory == category,
                            onClick = { selectedCategory = category },
                            label = { Text(capitalize(category)) },
                            modifier = Modifier.testTag("category-chip-$category"),
                        )
                    }
                }
            }
            items(filtered, key = { it.idDrink }) { drink ->
                Text(
                    text = drink.strDrink,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("item-card-${drink.idDrink}")
                        .clickable { onSelect(drink.idDrink) }
                        .padding(16.dp),
                    style = MaterialTheme.typography.bodyLarge,
                )
            }
        }
    }

    LaunchedEffect(selectedCategory) {
        try {
            all = if (selectedCategory == null) {
                api.fetchList()
            } else {
                api.fetchList(apiCategory(selectedCategory!!))
            }
        } catch (e: Exception) {
            error = e.message
        }
    }
}
