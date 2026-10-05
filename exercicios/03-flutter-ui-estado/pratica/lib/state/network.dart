import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SimulatedOffline extends Notifier<bool> {
  @override
  bool build() => false;

  void set(bool offline) => state = offline;
  void toggle() => state = !state;
}

final simulatedOfflineProvider =
    NotifierProvider<SimulatedOffline, bool>(SimulatedOffline.new);

final realConnectivityProvider = StreamProvider<bool>((ref) async* {
  final connectivity = Connectivity();
  try {
    yield !(await connectivity.checkConnectivity())
        .contains(ConnectivityResult.none);
  } catch (_) {
    yield true;
    return;
  }
  yield* connectivity.onConnectivityChanged
      .map((results) => !results.contains(ConnectivityResult.none));
});

final onlineProvider = Provider<bool>((ref) {
  final simulatedOffline = ref.watch(simulatedOfflineProvider);
  final actuallyOnline = ref.watch(realConnectivityProvider).valueOrNull ?? true;
  return !simulatedOffline && actuallyOnline;
});
