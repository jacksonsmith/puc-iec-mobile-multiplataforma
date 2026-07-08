package com.puciec.themealkmp

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
import com.puciec.themealkmp.data.TheMealDbApi
import com.puciec.themealkmp.data.MealSummary

private val CATEGORIES = listOf("Dessert", "Beef", "Seafood", "Vegetarian")

@Composable
fun ListScreen(api: TheMealDbApi, onSelect: (String) -> Unit) {
    var all by remember { mutableStateOf<List<MealSummary>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    var searchText by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf<String?>(null) }
    var categoryNames by remember { mutableStateOf<Set<String>?>(null) }

    LaunchedEffect(Unit) {
        // TODO 1 (feature 1 — lista): chamar api.fetchList(), guardar em `all`.
        // Tratar erro em `error` (try/catch) e marcar `loading = false` no final.
        loading = false
    }

    // TODO 3 (feature 3 — busca) + TODO 4 (feature 4 — categoria): filtrar
    // `all` por `categoryNames` (quando não-nulo, `names.contains(it.strMeal)`)
    // e por `searchText` (substring case-insensitive do `strMeal`).
    val filtered = all

    if (loading) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator() }
        return
    }
    if (error != null) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text(error!!) }
        return
    }

    Box(Modifier.fillMaxSize().testTag("item-list-screen")) {
        LazyColumn(Modifier.fillMaxSize()) {
            item {
                OutlinedTextField(
                    value = searchText,
                    onValueChange = { searchText = it },
                    label = { Text("Buscar receita") },
                    modifier = Modifier.fillMaxWidth().padding(12.dp).testTag("search-input"),
                )
            }
            item {
                LazyRow(
                    Modifier.fillMaxWidth().padding(horizontal = 12.dp),
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
                            label = { Text(category) },
                            modifier = Modifier.testTag("category-chip-${category.lowercase()}"),
                        )
                    }
                }
            }
            items(filtered, key = { it.idMeal }) { meal ->
                Text(
                    text = meal.strMeal,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("item-card-${meal.idMeal}")
                        .clickable { onSelect(meal.idMeal) }
                        .padding(16.dp),
                    style = MaterialTheme.typography.bodyLarge,
                )
            }
        }
    }

    LaunchedEffect(selectedCategory) {
        // TODO 4 (feature 4 — categoria/filtro): quando `selectedCategory` não
        // é null, chamar api.fetchNamesByCategory(category) e guardar em
        // `categoryNames`.
    }
}
