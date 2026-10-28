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

// ─────────────────────────────────────────────────────────────────────────────
// App — Composable raiz compartilhado entre Android, iOS e Web.
//
// A busca de dados (TmdbApi) já está pronta — o exercício é construir a UI.
// tmdbToken vem do BuildKonfig.TMDB_TOKEN (gerado do local.properties pra todas as plataformas).
// ─────────────────────────────────────────────────────────────────────────────

@Composable
fun App(tmdbToken: String = "") {
    MaterialTheme {
        var movies by remember { mutableStateOf<List<Movie>>(emptyList()) }
        var isLoading by remember { mutableStateOf(false) }
        var error by remember { mutableStateOf<String?>(null) }

        val api = remember(tmdbToken) { TmdbApi(tmdbToken) }

        LaunchedEffect(Unit) {
            if (tmdbToken.isBlank()) return@LaunchedEffect
            isLoading = true
            try {
                movies = api.popularMovies().results
            } catch (e: Exception) {
                error = e.message ?: "Erro desconhecido"
            } finally {
                isLoading = false
            }
        }

        Surface(modifier = Modifier.fillMaxSize()) {
            // ── TODO 1 ──────────────────────────────────────────────────────
            // Troque a linha abaixo por um `when` que mostra, nesta ordem:
            //   - tmdbToken em branco       -> TokenMissingMessage()
            //   - isLoading == true         -> CircularProgressIndicator() centralizado
            //   - error != null             -> ErrorMessage(error!!)
            //   - caso contrário            -> MovieList(movies)
            // ────────────────────────────────────────────────────────────────
            when {
                tmdbToken.isBlank() -> TokenMissingMessage()
                isLoading -> Box(
                    Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center,
                ) {
                    CircularProgressIndicator()
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
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("Nenhum filme encontrado.")
        }
        return
    }

    // ── TODO 2 ──────────────────────────────────────────────────────────────
    // Monte um LazyColumn (fillMaxSize, contentPadding 16dp,
    // verticalArrangement spacedBy 12dp) com:
    //   - um item de cabeçalho: Text("${movies.size} filmes populares")
    //   - um items(movies) { movie -> MovieCard(movie) }
    // ────────────────────────────────────────────────────────────────────────
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Text(
                text = "${movies.size} filmes populares",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
            )
        }
        items(movies) { movie ->
            MovieCard(movie)
        }
    }
}

@Composable
private fun MovieCard(movie: Movie) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Box(
                modifier = Modifier
                    .size(width = 56.dp, height = 84.dp)
                    .clip(RoundedCornerShape(6.dp))
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = movie.title.firstOrNull()?.uppercase() ?: "?",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                )
            }
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                Text(
                    text = movie.title,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Text(
                    text = movie.overview,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    style = MaterialTheme.typography.bodyMedium,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("⭐ ${movie.voteAverage}")
                    Text(movie.releaseDate.take(4))
                }
            }
        }
    }
}

@Composable
private fun TokenMissingMessage() {
    Box(Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text("Token TMDB não configurado", fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Spacer(Modifier.height(8.dp))
            Text(
                "Adicione tmdb.token=<seu-token> em local.properties e sincronize o Gradle.",
                style = MaterialTheme.typography.bodyMedium,
            )
        }
    }
}

@Composable
private fun ErrorMessage(msg: String) {
    Box(Modifier.fillMaxSize().padding(24.dp), contentAlignment = Alignment.Center) {
        Text("Erro: $msg", color = MaterialTheme.colorScheme.error)
    }
}
