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
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.data.Movie
import org.example.project.data.TmdbApi
import kotlin.math.roundToInt

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
            // TODO 1 — um estado por vez, nesta prioridade: sem token > carregando > erro > lista.
            // `error!!` é necessário: `error` é uma var delegada (by remember), então o
            // compilador não faz smart cast depois do `error != null`.
            when {
                tmdbToken.isBlank() -> TokenMissingMessage()
                isLoading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
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

    // TODO 2 — LazyColumn só compõe os cards visíveis na tela (equivalente ao FlatList do RN).
    // `key = id` mantém o estado de cada card ligado ao filme, não à posição na lista.
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
        items(movies, key = { it.id }) { movie -> MovieCard(movie) }
    }
}

@Composable
private fun MovieCard(movie: Movie) {
    // TODO 3 — Card > Row: placeholder de poster à esquerda, textos à direita.
    Card(modifier = Modifier.fillMaxWidth()) {
        Row(Modifier.padding(12.dp)) {
            Box(
                modifier = Modifier
                    .size(width = 56.dp, height = 84.dp)
                    .clip(RoundedCornerShape(6.dp))
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = movie.title.firstOrNull()?.uppercase() ?: "?",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                )
            }
            Spacer(Modifier.width(12.dp))
            Column(Modifier.weight(1f)) {
                Text(
                    text = movie.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    // A TMDB devolve overview vazio quando o filme não tem sinopse em pt-BR.
                    text = movie.overview.ifBlank { "Sinopse indisponível em português." },
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("⭐ ${formatVote(movie.voteAverage)}", style = MaterialTheme.typography.labelLarge)
                    if (movie.releaseDate.isNotBlank()) {
                        Text(movie.releaseDate.take(4), style = MaterialTheme.typography.labelLarge)
                    }
                }
            }
        }
    }
}

// "8.7" com 1 casa decimal em todas as plataformas. String.format só existe na JVM,
// e na Web 7.0.toString() vira "7" — por isso a conta em décimos.
private fun formatVote(vote: Double): String {
    val tenths = (vote * 10).roundToInt()
    return "${tenths / 10}.${tenths % 10}"
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

// Preview do hands-on da aula 5: mostra o card no painel Split do Android Studio, sem emulador.
@Preview
@Composable
private fun MovieCardPreview() {
    MaterialTheme {
        MovieCard(Movie(1, "Matrix", "Um hacker descobre a verdade.", null, "1999-03-31", 8.7))
    }
}
