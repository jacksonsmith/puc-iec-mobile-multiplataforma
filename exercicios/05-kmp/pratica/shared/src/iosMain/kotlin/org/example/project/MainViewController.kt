package org.example.project

import androidx.compose.ui.window.ComposeUIViewController

fun MainViewController() = ComposeUIViewController { App(tmdbToken = BuildKonfig.TMDB_TOKEN) }