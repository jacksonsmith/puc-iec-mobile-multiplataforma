// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod (local).
// Ex4 (TASK 7): mesmo provider, mas sincronizado com Firestore (cloud).

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';

const _favoritesDocumentPath = 'favorites/meus-favoritos';

class FavoritesNotifier extends Notifier<Set<int>> {
  late final DocumentReference<Map<String, dynamic>> _favoritesDocument =
      FirebaseFirestore.instance.doc(_favoritesDocumentPath);

  Future<void>? _loadFuture;
  final List<int> _pendingToggles = [];
  bool _hasLocalChanges = false;
  bool _clearRequested = false;
  bool _isLoaded = false;

  @override
  Set<int> build() {
    _loadFuture ??= _load();
    return {};
  }

  Future<void> _load() async {
    try {
      final snapshot = await _favoritesDocument.get();
      final rawIds = snapshot.data()?['ids'];
      final List<int> ids;
      if (rawIds == null) {
        ids = <int>[];
      } else if (rawIds is List && rawIds.every((id) => id is int)) {
        ids = rawIds.cast<int>();
      } else {
        throw const FormatException(
          'O campo "ids" dos favoritos precisa ser uma lista de inteiros.',
        );
      }

      final loadedFavorites = _clearRequested ? <int>{} : ids.toSet();
      for (final id in _pendingToggles) {
        if (!loadedFavorites.add(id)) {
          loadedFavorites.remove(id);
        }
      }
      _pendingToggles.clear();
      state = loadedFavorites;
      if (_hasLocalChanges) {
        _persist();
      }
    } on FirebaseException catch (error) {
      debugPrint('Firestore (ler favoritos): $error');
    } on FormatException catch (error) {
      debugPrint('Dados inválidos no Firestore (favoritos): $error');
    } finally {
      _isLoaded = true;
    }
  }

  Future<void> _persist() async {
    try {
      await _loadFuture;
      await _favoritesDocument.set({'ids': state.toList()});
    } on FirebaseException catch (error) {
      debugPrint('Firestore (gravar favoritos): $error');
    }
  }

  void toggle(int id) {
    _hasLocalChanges = true;
    if (!_isLoaded) {
      _pendingToggles.add(id);
    }
    state = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    _persist();
  }

  void clear() {
    _hasLocalChanges = true;
    if (!_isLoaded) {
      _clearRequested = true;
      _pendingToggles.clear();
    }
    state = {};
    _persist();
  }
}

final favoritesProvider =
    NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
