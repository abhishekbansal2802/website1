import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:mobile/features/home/bloc/home_event.dart';
import 'package:mobile/features/home/bloc/home_state.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  HomeBloc() : super(HomeStateInitial()) {
    on<HomeEventLogout>(homeEventLogout);
  }

  FutureOr<void> homeEventLogout(
    HomeEventLogout event,
    Emitter<HomeState> emit,
  ) async {
    emit(HomeStateLoading());
    final box = await Hive.openBox("box1");
    await box.delete("token");
    emit(HomeStateLogoutSuccess());
  }
}
