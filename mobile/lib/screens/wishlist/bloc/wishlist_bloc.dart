import 'dart:async';
import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/screens/wishlist/bloc/wishlist_event.dart';
import 'package:mobile/screens/wishlist/bloc/wishlist_state.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class WishlistBloc extends Bloc<WishlistEvent, WishlistState> {
  WishlistBloc() : super(WishlistStateInitial()) {
    on<WishlistEventInitial>(wishlistInitialState);
  }

  FutureOr<void> wishlistInitialState(
    WishlistEventInitial event,
    Emitter<WishlistState> emit,
  ) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString("token");
    if (token == null) {
      emit(WishlistStateNavigateToHome());
      return;
    }
    final String url =
        "http://$CONNECTION_STRING:8080/api/user/wishlist/$token";
    final uri = Uri.parse(url);
    final response = await http.get(uri);
    final decodedResponse = jsonDecode(response.body);
    if (decodedResponse["success"] == true) {
      final List<Product> products = List<Product>.from(
        decodedResponse["products"].map((e) => Product.fromJson(e)).toList(),
      );
      emit(WishlistStateLoaded(products: products));
    } else {
      emit(WishlistStateNavigateToHome());
    }
  }
}
