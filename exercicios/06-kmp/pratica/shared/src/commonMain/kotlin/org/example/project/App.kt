package org.example.project

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.data.Movie
import org.example.project.data.TmdbApi

// ─────────────────────────────────────────────────────────────────────────────
// App — Composable raiz compartilhado entre Android, iOS e Web.
//
// tmdbToken vem do BuildConfig.TMDB_TOKEN (Android) ou vazio nas outras plataformas.
// ─────────────────────────────────────────────────────────────────────────────

@Composable
fun App(tmdbToken: String = "") {
    MaterialTheme {
        var movies by remember { mutableStateOf<List<Movie>>(emptyList()) }
        var isLoading by remember { mutableStateOf(false) }
        var error by remember { mutableStateOf<String?>(null) }

        val api = remember(tmdbToken) { TmdbApi(tmdbToken) }

        // ── TODO 2 ──────────────────────────────────────────────────────────
        // Busque os filmes populares ao iniciar o composable.
        //
        // Use LaunchedEffect(Unit) { ... } para executar código suspend.
        // Dentro do bloco:
        //   1. isLoading = true
        //   2. chame api.popularMovies() dentro de try/catch
        //   3. atribua o resultado a movies
        //   4. em caso de erro, atribua a mensagem a error
        //   5. isLoading = false
        // ────────────────────────────────────────────────────────────────────

        Surface(modifier = Modifier.fillMaxSize()) {
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

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        // ── TODO 3 ──────────────────────────────────────────────────────────
        // Exiba cada filme da lista usando items(movies) { movie -> ... }.
        //
        // Para cada item, mostre pelo menos:
        //   - movie.title  (nome do filme)
        //   - movie.voteAverage  (nota, ex.: "8.5 ★")
        //   - movie.releaseDate  (ano de lançamento, primeiros 4 chars)
        //
        // Sugestão: use um Card com Column dentro.
        // ────────────────────────────────────────────────────────────────────
        item {
            Text(
                text = "${movies.size} filmes populares",
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(bottom = 8.dp),
            )
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
