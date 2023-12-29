import 'dart:async';
import 'dart:convert';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/screens/cart/bloc/cart_item_event.dart';
import 'package:mobile/screens/cart/bloc/cart_item_state.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class CartItemBloc extends Bloc<CartItemEvent, CartItemState> {
  CartItemBloc() : super(CartItemStateInitial()) {
    on<CartItemEventInitial>(cartItemStateIntial);

    on<CartItemEventRemove>(removeCartItem);
  }

  FutureOr<void> cartItemStateIntial(
    CartItemEventInitial event,
    Emitter<CartItemState> emit,
  ) async {
    final product = await getProduct(event.productId);
    if (product != null) {
      emit(CartItemStateLoaded(product: product));
    }
  }

  FutureOr<void> removeCartItem(
    CartItemEventRemove event,
    Emitter<CartItemState> emit,
  ) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString("token");
    if (token == null) {
      return;
    }
    final url =
        "http://$CONNECTION_STRING:8080/api/user/cart/${event.productId}/$token";
    final uri = Uri.parse(url);
    http.delete(uri);
  }

  Future<Product?> getProduct(String id) async {
    final String url = "http://$CONNECTION_STRING:8080/api/product/$id";
    final uri = Uri.parse(url);
    final response = await http.get(uri);
    final decodedResponse = jsonDecode(response.body);
    if (decodedResponse["success"] == true) {
      return Product.fromJson(decodedResponse["product"]);
    }
    return null;
  }
}
