package com.puciec.ghiblikmp

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
import com.puciec.ghiblikmp.data.GhibliApi
import com.puciec.ghiblikmp.data.FilmSummary
import com.puciec.ghiblikmp.data.capitalize

private val DIRECTORS = mapOf(
    "miyazaki" to "Hayao Miyazaki",
    "takahata" to "Isao Takahata",
)

@Composable
fun ListScreen(api: GhibliApi, onSelect: (String) -> Unit) {
    var all by remember { mutableStateOf<List<FilmSummary>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    var searchText by remember { mutableStateOf("") }
    var selectedDirectorSlug by remember { mutableStateOf<String?>(null) }
    var titlesForDirector by remember { mutableStateOf<Set<String>?>(null) }

    LaunchedEffect(Unit) {
        // TODO 1 (feature 1 — lista): chamar api.fetchList(), guardar em `all`.
        // Tratar erro em `error` (try/catch) e marcar `loading = false` no final.
        loading = false
    }

    // TODO 3 (feature 3 — busca) + TODO 4 (feature 4 — categoria): filtrar
    // `all` por `titlesForDirector` (quando não-nulo, `titles.contains(it.title)`)
    // e por `searchText` (substring case-insensitive do `title`).
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
                    label = { Text("Buscar filme") },
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
                            selected = selectedDirectorSlug == null,
                            onClick = { selectedDirectorSlug = null; titlesForDirector = null },
                            label = { Text("Todos") },
                            modifier = Modifier.testTag("category-chip-all"),
                        )
                    }
                    items(DIRECTORS.keys.toList()) { slug ->
                        FilterChip(
                            selected = selectedDirectorSlug == slug,
                            onClick = { selectedDirectorSlug = slug },
                            label = { Text(capitalize(slug)) },
                            modifier = Modifier.testTag("category-chip-$slug"),
                        )
                    }
                }
            }
            items(filtered, key = { it.id }) { film ->
                Text(
                    text = film.title,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("item-card-${film.id}")
                        .clickable { onSelect(film.id) }
                        .padding(16.dp),
                    style = MaterialTheme.typography.bodyLarge,
                )
            }
        }
    }

    LaunchedEffect(selectedDirectorSlug) {
        // TODO 4 (feature 4 — categoria/filtro): quando `selectedDirectorSlug`
        // não é null, chamar api.fetchTitlesByDirector(DIRECTORS[slug]!!) e
        // guardar em `titlesForDirector`.
    }
}
