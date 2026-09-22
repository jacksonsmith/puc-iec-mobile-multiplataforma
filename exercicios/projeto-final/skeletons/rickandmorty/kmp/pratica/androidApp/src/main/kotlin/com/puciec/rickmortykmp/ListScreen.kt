package com.puciec.rickmortykmp

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
import com.puciec.rickmortykmp.data.RickAndMortyApi
import com.puciec.rickmortykmp.data.CharacterSummary
import com.puciec.rickmortykmp.data.capitalize
import kotlin.coroutines.cancellation.CancellationException

private val STATUSES = listOf("alive", "dead", "unknown")

@Composable
fun ListScreen(api: RickAndMortyApi, onSelect: (Int) -> Unit) {
    var all by remember { mutableStateOf<List<CharacterSummary>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf<String?>(null) }
    var searchText by remember { mutableStateOf("") }
    var selectedStatus by remember { mutableStateOf<String?>(null) }
    var statusNames by remember { mutableStateOf<Set<String>?>(null) }
    
    LaunchedEffect(Unit) {
        try {
            all = api.fetchList()
        } catch (t: Throwable) {
            error = "Não foi possível carregar personagens."
        } finally {
            loading = false
        }
    }

    val filtered = all
        .filter { character -> statusNames?.contains(character.name) ?: true }
        .filter { character -> character.name.contains(searchText.trim(), ignoreCase = true) }

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
                    label = { Text("Buscar personagem") },
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
                            selected = selectedStatus == null,
                            onClick = { selectedStatus = null; statusNames = null },
                            label = { Text("Todos") },
                            modifier = Modifier.testTag("category-chip-all"),
                        )
                    }
                    items(STATUSES) { status ->
                        FilterChip(
                            selected = selectedStatus == status,
                            onClick = { selectedStatus = status },
                            label = { Text(capitalize(status)) },
                            modifier = Modifier.testTag("category-chip-$status"),
                        )
                    }
                }
            }
            items(filtered, key = { it.id }) { character ->
                Text(
                    text = capitalize(character.name),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("item-card-${character.id}")
                        .clickable { onSelect(character.id) }
                        .padding(16.dp),
                    style = MaterialTheme.typography.bodyLarge,
                )
            }
        }
    }

    LaunchedEffect(selectedStatus) {
        statusNames = try {
            selectedStatus?.let { api.fetchNamesByStatus(it) }
        } catch (c: CancellationException) {
            throw c
        } catch (t: Throwable) {
            null
        }
    }
}
