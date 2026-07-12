package com.puciec.themealkmp

import android.content.Context

private const val PREFS_NAME = "favorites"
private const val KEY_IDS = "favorite_meal_ids"

class FavoritesStore(context: Context) {
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun load(): Set<String> =
        prefs.getStringSet(KEY_IDS, emptySet()) ?: emptySet()

    fun toggle(id: String): Set<String> {
        val current = load().toMutableSet()
        if (!current.add(id)) current.remove(id)
        prefs.edit().putStringSet(KEY_IDS, current).apply()
        return current
    }
}
