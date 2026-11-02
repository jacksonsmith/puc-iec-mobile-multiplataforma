
package org.example.project

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.data.Movie
import org.example.project.data.TmdbApi
import kotlin.math.roundToInt

@Composable
fun App(tmdbToken: String = "") {
    MaterialTheme {
        var movies by remember {
            mutableStateOf<List<Movie>>(emptyList())
        }
        var isLoading by remember {
            mutableStateOf(false)
        }
        var error by remember {
            mutableStateOf<String?>(null)
        }

        val api = remember(tmdbToken) {
            TmdbApi(tmdbToken)
        }

        LaunchedEffect(tmdbToken) {
            if (tmdbToken.isBlank()) return@LaunchedEffect

            isLoading = true
            error = null

            try {
                movies = api.popularMovies().results
            } catch (e: Exception) {
                error = e.message ?: "Erro desconhecido"
            } finally {
                isLoading = false
            }
        }

        Surface(
            modifier = Modifier
                .fillMaxSize()
                .safeDrawingPadding()
        ) {

            // TODO 1 - Estados da interface
            when {
                tmdbToken.isBlank() -> TokenMissingMessage()

                isLoading -> {
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator()
                    }
                }

                error != null -> ErrorMessage(error!!)

                else -> MovieList(movies)
            }
        }
    }
}

@Composable
private fun MovieList(movies: List<Movie>) {
    if (movies.isEmpty()) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text("Nenhum filme encontrado.")
        }
        return
    }

    // TODO 2 - Lista de filmes
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                text = "${movies.size} filmes populares",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
        }

        items(movies) { movie ->
            MovieCard(movie)
        }
    }
}

@Composable
private fun MovieCard(movie: Movie) {

    // TODO 3 - Card do filme
    val ano = movie.releaseDate.substringBefore("-")
        .ifBlank { "Ano indisponível" }

    val nota = (
            (movie.voteAverage * 10).roundToInt() / 10.0
            ).toString()

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 4.dp
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {

            // Placeholder do pôster
            Box(
                modifier = Modifier
                    .size(width = 56.dp, height = 84.dp)
                    .clip(RoundedCornerShape(6.dp))
                    .background(
                        MaterialTheme.colorScheme.primaryContainer
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = movie.title
                        .firstOrNull()
                        ?.uppercaseChar()
                        ?.toString() ?: "?",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme
                        .onPrimaryContainer
                )
            }

            // Informações do filme
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {

                Text(
                    text = movie.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                Text(
                    text = movie.overview.ifBlank {
                        "Sinopse não disponível."
                    },
                    style = MaterialTheme.typography.bodySmall,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "⭐ $nota",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold
                    )

                    Text(
                        text = ano,
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

@Composable
private fun TokenMissingMessage() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "Token TMDB não configurado",
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp
            )

            Spacer(Modifier.height(8.dp))

            Text(
                text = "Adicione tmdb.token=<seu-token> em local.properties e sincronize o Gradle.",
                style = MaterialTheme.typography.bodyMedium
            )
        }
    }
}

@Composable
private fun ErrorMessage(msg: String) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Erro: $msg",
            color = MaterialTheme.colorScheme.error
        )
    }
}
