package com.puciec.rickmortykmp

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp

@Composable
fun BottomNav(active: Screen, onSelectList: () -> Unit, onSelectFavorites: () -> Unit) {
    Row(Modifier.fillMaxWidth().padding(vertical = 12.dp)) {
        Text(
            text = "Pokédex",
            modifier = Modifier.weight(1f).clickable { onSelectList() },
            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
        )
        Text(
            text = "Favoritos",
            modifier = Modifier
                .weight(1f)
                .testTag("tab-favorites")
                .clickable { onSelectFavorites() },
            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
        )
    }
}
