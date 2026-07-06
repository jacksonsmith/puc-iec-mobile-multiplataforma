package com.puciec.rickmortykmp

import android.content.Context

private const val PREFS_NAME = "favorites"
private const val KEY_IDS = "favorite_pokemon_ids"

class FavoritesStore(context: Context) {
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun load(): Set<Int> =
        prefs.getStringSet(KEY_IDS, emptySet())?.mapNotNull { it.toIntOrNull() }?.toSet() ?: emptySet()

    fun toggle(id: Int): Set<Int> {
        val current = load().toMutableSet()
        if (!current.add(id)) current.remove(id)
        prefs.edit().putStringSet(KEY_IDS, current.map { it.toString() }.toSet()).apply()
        return current
    }
}
