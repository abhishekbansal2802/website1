import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:mobile/bloc/main_event.dart';
import 'package:mobile/bloc/main_state.dart';

class MainBloc extends Bloc<MainEvent, MainState> {
  MainBloc() : super(MainStateLoading()) {
    on<MainEventInitial>(
      (event, emit) async {
        final box = await Hive.openBox("box1");
        final token = await box.get("token");
        if (token == null) {
          emit(MainStateLogin());
        } else {
          emit(MainStateHome());
        }
      },
    );
  }
}
