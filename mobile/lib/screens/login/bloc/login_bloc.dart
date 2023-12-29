import 'dart:async';
import 'dart:convert';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/constants/constants.dart';
import 'package:mobile/screens/login/bloc/login_event.dart';
import 'package:mobile/screens/login/bloc/login_state.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  LoginBloc() : super(LoginStateInitial()) {
    on<LoginButtonClickedEvent>(loginButtonClick);
  }

  FutureOr<void> loginButtonClick(
    LoginButtonClickedEvent event,
    Emitter<LoginState> emit,
  ) async {
    emit(LoginStateLoading());
    if (event.email.isEmpty || event.password.isEmpty) {
      emit(LoginStateFailed());
      return;
    }
    final url = Uri.parse("http://$CONNECTION_STRING:8080/api/user/login");
    final response = await http.post(
      url,
      headers: <String, String>{
        "Content-Type": "application/json",
      },
      body: jsonEncode(
        <String, String>{"email": event.email, "password": event.password},
      ),
    );
    final decodedResponse = jsonDecode(response.body);
    if (decodedResponse["success"] == true) {
      emit(LoginStateSuccess());
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      prefs.setString("token", decodedResponse["token"]);
      emit(LoginStateNavigateHome());
    } else {
      emit(LoginStateFailed());
    }
  }
}
