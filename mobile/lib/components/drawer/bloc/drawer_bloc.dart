import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/components/drawer/bloc/drawer_event.dart';
import 'package:mobile/components/drawer/bloc/drawer_state.dart';
import 'package:mobile/methods/methods.dart';

class DrawerBloc extends Bloc<DrawerEvent, DrawerState> {
  DrawerBloc() : super(DrawerStateInitial()) {
    on<DrawerEventInitial>(initialEventHandler);

    on<DrawerEventLogOut>(
      (event, emit) {
        emit(DrawerStateLoggedOut());
      },
    );
  }

  FutureOr<void> initialEventHandler(
    DrawerEventInitial event,
    Emitter<DrawerState> emit,
  ) async {
    final user = await getUser();
    if (user == null) {
      emit(DrawerStateLoggedOut());
    } else {
      emit(DrawerStateLoggedIn(user: user));
    }
  }
}
