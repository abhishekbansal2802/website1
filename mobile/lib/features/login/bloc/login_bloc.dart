import 'dart:async';
import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/features/login/bloc/login_event.dart';
import 'package:mobile/features/login/bloc/login_state.dart';
import 'package:http/http.dart' as http;

class LoginBLoc extends Bloc<LoginEvent, LoginState> {
  LoginBLoc() : super(LoginInitial()) {
    on<LoginButtonClickedEvent>(loginButtonClicked);
  }

  FutureOr<void> loginButtonClicked(
      LoginButtonClickedEvent event, Emitter<LoginState> emit) async {
    emit(LoginLoading());
    final response = await http.post(
      Uri.parse("http://${CONNECTION_STRING}:8080/api/user/login"),
      headers: <String, String>{
        "Content-Type": "application/json",
      },
      body: jsonEncode(
        <String, String>{
          "email": event.email,
          "password": event.password,
        },
      ),
    );
    final decodedValue = jsonDecode(response.body);
    if (decodedValue["success"]) {
      emit(LoginSuccess());
      final box = await Hive.openBox("box1");
      box.put("token", decodedValue["token"]);
      emit(LoginSuccessNavigateToHome());
    } else {
      emit(LoginFailed());
    }
  }
}
