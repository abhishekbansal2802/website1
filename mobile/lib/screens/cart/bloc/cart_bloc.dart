import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/screens/cart/bloc/cart_event.dart';
import 'package:mobile/screens/cart/bloc/cart_state.dart';
import 'package:mobile/screens/cart/model/cart_response.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CartBloc extends Bloc<CartEvent, CartState> {
  CartBloc() : super(CartStateInitial()) {
    on<CartEventInitial>(cartEventInitial);
  }

  FutureOr<void> cartEventInitial(
    CartEventInitial event,
    Emitter<CartState> emit,
  ) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString("token");
    if (token == null) {
      emit(CartStateNavigateToLogin());
      return;
    }
    final url = "http://$CONNECTION_STRING:8080/api/user/cart/$token";
    final uri = Uri.parse(url);
    final response = await http.get(uri);
    final decodedResponse = jsonDecode(response.body);
    if (decodedResponse["success"] == true) {
      final cartResponse = List<CartResponse>.from(decodedResponse["cart"]
          .map((e) => CartResponse.fromJson(e))
          .toList());
      emit(CartStateLoaded(cart: cartResponse));
    }
  }
}
