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
            // TODO 1 — uma tela por estado. O `when` testa os ramos de cima pra baixo e
            // para no primeiro verdadeiro, então a ordem é a prioridade: sem token não há
            // o que carregar; carregando, ainda não há erro nem lista.
            // `error` é propriedade delegada (by mutableStateOf), então o compilador não
            // faz smart cast nela; a cópia local é estável e dispensa o `error!!`.
            val currentError = error
            when {
                tmdbToken.isBlank() -> TokenMissingMessage()
                isLoading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
                currentError != null -> ErrorMessage(currentError)
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

    // TODO 2 — LazyColumn só compõe os itens que estão na tela (o equivalente do
    // FlatList no React Native e do ListView.builder no Flutter).
    // safeContentPadding: a MainActivity liga o edge-to-edge (e o Android 15 o impõe),
    // então sem ele o cabeçalho ficaria embaixo da barra de status.
    LazyColumn(
        modifier = Modifier.safeContentPadding().fillMaxSize(),
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
        // key = id do filme: cada card fica preso ao filme, não à posição na lista.
        items(movies, key = { it.id }) { movie ->
            MovieCard(movie)
        }
    }
}

@Composable
private fun MovieCard(movie: Movie) {
    // TODO 3 — a "peça final" do hands-on da aula 5: Card > Row com o placeholder
    // do pôster (Box) à esquerda e os textos (Column com weight 1f) à direita.
    Card(modifier = Modifier.fillMaxWidth()) {
        Row(Modifier.padding(12.dp)) {
            Box(
                modifier = Modifier
                    .size(56.dp, 84.dp)
                    .clip(RoundedCornerShape(6.dp))
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = movie.title.firstOrNull()?.uppercase() ?: "?",
                    fontWeight = FontWeight.Bold,
                    fontSize = 24.sp,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                )
            }
            Spacer(Modifier.width(12.dp))
            Column(Modifier.weight(1f)) {
                Text(
                    text = movie.title,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    // Com language=pt-BR, filme sem tradução vem com overview vazio.
                    text = movie.overview.ifBlank { "Sinopse indisponível em português." },
                    style = MaterialTheme.typography.bodySmall,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                Spacer(Modifier.height(8.dp))
                Row {
                    Text("⭐ ${formatRating(movie.voteAverage)}", style = MaterialTheme.typography.labelLarge)
                    val year = movie.releaseDate.take(4)
                    if (year.isNotBlank()) {
                        Text("  ·  $year", style = MaterialTheme.typography.labelLarge)
                    }
                }
            }
        }
    }
}

// Nota com uma casa decimal (a API manda 7.346 → "7.3"). String.format não existe no
// commonMain (é da JVM) e Double.toString muda de plataforma pra plataforma (8.0 vira "8"
// no JS); a conta em inteiros dá o mesmo texto no Android, no iOS e na Web.
private fun formatRating(voteAverage: Double): String {
    val tenths = (voteAverage * 10).roundToInt()
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

// ── Previews (hands-on da aula 5) ───────────────────────────────────────────
// Mostram o card e a lista no painel Preview do Android Studio, sem emulador e sem
// token. O terceiro filme cobre os casos de borda: sem sinopse, sem data e nota 0.
private val previewMovies = listOf(
    Movie(1, "Matrix", "Um hacker descobre a verdade.", null, "1999-03-31", 8.7),
    Movie(2, "Duna: Parte Dois", "Paul Atreides se une aos Fremen em busca de vingança.", null, "2024-02-27", 8.146),
    Movie(3, "Filme ainda sem tradução", "", null, "", 0.0),
)

@Preview
@Composable
private fun MovieCardPreview() {
    MaterialTheme { MovieCard(previewMovies.first()) }
}

@Preview
@Composable
private fun MovieListPreview() {
    MaterialTheme { Surface { MovieList(previewMovies) } }
}
