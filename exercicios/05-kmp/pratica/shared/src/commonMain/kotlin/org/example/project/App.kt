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
            // `when` sem argumento: vale o primeiro ramo verdadeiro, então a
            // ordem importa (sem token nem chega a carregar; erro só depois
            // que o carregamento terminou). Cada mudança em isLoading/error/
            // movies recompõe este bloco e troca a tela.
            // `error!!` é necessário: `error` é um `var` delegado (by), e o
            // Kotlin não faz smart cast de propriedade delegada.
            // ────────────────────────────────────────────────────────────────
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

    // ── TODO 2 ──────────────────────────────────────────────────────────────
    // LazyColumn só compõe os itens visíveis (equivale à FlatList do RN e ao
    // ListView.builder do Flutter). `item {}` é o cabeçalho; `items(movies)`
    // vira um MovieCard por filme. `key = id` deixa o Compose reaproveitar o
    // card certo se a lista mudar.
    // safeDrawingPadding(): o MainActivity chama enableEdgeToEdge(), então
    // sem isso o cabeçalho ficaria embaixo da status bar no Android.
    // ────────────────────────────────────────────────────────────────────────
    LazyColumn(
        modifier = Modifier.fillMaxSize().safeDrawingPadding(),
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
    // ── TODO 3 ──────────────────────────────────────────────────────────────
    // Card > Row: placeholder do poster à esquerda (Box 56x84dp com a
    // inicial do título) e, à direita, uma Column com weight(1f), que ocupa
    // o resto da largura. maxLines + Ellipsis mantêm todos os cards com a
    // mesma altura, mesmo com título ou sinopse longos.
    // ────────────────────────────────────────────────────────────────────────
    Card(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.padding(12.dp),
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
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                )
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = movie.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    // a API às vezes não traz sinopse em pt-BR
                    text = movie.overview.ifBlank { "Sem sinopse em português." },
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("⭐ ${formatRating(movie.voteAverage)}", style = MaterialTheme.typography.labelLarge)
                    // releaseDate vem como "AAAA-MM-DD" (ou vazio)
                    if (movie.releaseDate.length >= 4) {
                        Text(movie.releaseDate.take(4), style = MaterialTheme.typography.labelLarge)
                    }
                }
            }
        }
    }
}

// Nota com 1 casa decimal (7.25 -> "7.3"). String.format só existe na JVM,
// então não dá para usar em commonMain; a conta abaixo roda em toda plataforma.
private fun formatRating(rating: Double): String {
    val tenths = (rating * 10).roundToInt()
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
