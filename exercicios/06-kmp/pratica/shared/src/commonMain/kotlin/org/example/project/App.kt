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
// tmdbToken vem do BuildConfig.TMDB_TOKEN (Android) ou vazio nas outras plataformas.
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
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("TODO 1: implemente os estados (loading / erro / lista)")
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
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("TODO 2: monte o LazyColumn com cabeçalho + itens")
    }
}

@Composable
private fun MovieCard(movie: Movie) {
    // ── TODO 3 ──────────────────────────────────────────────────────────────
    // Construa o card do filme. Sugestão de layout (Card > Row):
    //   - Box à esquerda (56x84dp, cantos arredondados 6dp, background
    //     MaterialTheme.colorScheme.primaryContainer) com a inicial do
    //     título centralizada (placeholder de poster, sem imagem real)
    //   - Column à direita (weight 1f) com: título (bold, 2 linhas max),
    //     overview (2 linhas max), e uma Row com nota "⭐ X.X" + ano
    // ────────────────────────────────────────────────────────────────────────
    Card(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "TODO 3: card de ${movie.title}",
            modifier = Modifier.padding(16.dp),
        )
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
