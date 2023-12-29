import 'dart:async';
import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/methods/methods.dart';
import 'package:mobile/screens/products/bloc/product_event.dart';
import 'package:mobile/screens/products/bloc/product_state.dart';
import 'package:http/http.dart' as http;
import 'package:mobile/screens/products/model/product_full.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProductBloc extends Bloc<ProductEvent, ProductState> {
  ProductBloc() : super(ProductStateInitial()) {
    on<ProductEventInitial>(productInitialEvent);

    on<ProductEventAddToCart>(productAddToCart);

    on<ProductToggleWishlist>(toggleWishlist);
  }

  FutureOr<void> productInitialEvent(
    ProductEventInitial event,
    Emitter<ProductState> emit,
  ) async {
    final user = await getUser();
    if (user == null) {
      emit(ProductStateWishlistHandler(wishlist: false));
    }
    final url = "http://$CONNECTION_STRING:8080/api/product/${event.id}";
    final uri = Uri.parse(url);
    final response = await http.get(uri);
    final decodedResponse = jsonDecode(response.body);
    if (decodedResponse["success"] == true) {
      final product = ProductFull.fromJson(decodedResponse["product"]);
      for (final item in user?.wishlist ?? []) {
        if (item == product.id) {
          emit(
            ProductStateLoaded(
              product: product,
            ),
          );
          emit(ProductStateWishlistHandler(wishlist: true));
          return;
        }
      }
      emit(ProductStateLoaded(
        product: product,
      ));
      emit(ProductStateWishlistHandler(wishlist: false));
    }
  }

  FutureOr<void> toggleWishlist(
    ProductToggleWishlist event,
    Emitter<ProductState> emit,
  ) async {
    final user = await getUser();
    if (user == null) {
      emit(ProductStateWishlistHandler(wishlist: false));
      return;
    }
    final url =
        "http://$CONNECTION_STRING:8080/api/user/wishlist/${user.token}/${event.id}";
    final uri = Uri.parse(url);
    final response = await http.put(uri);
    final decodedResponse = await jsonDecode(response.body);
    if (decodedResponse["success"] == true) {
      final user = await getUser();
      if (user == null) {
        emit(ProductStateWishlistHandler(wishlist: false));
      }
      for (final item in user?.wishlist ?? []) {
        if (item.toString() == event.id.toString()) {
          emit(ProductStateWishlistHandler(wishlist: true));
          return;
        }
      }
    } else {
      emit(ProductStateWishlistHandler(wishlist: false));
    }
    emit(ProductStateWishlistHandler(wishlist: false));
  }

  FutureOr<void> productAddToCart(
    ProductEventAddToCart event,
    Emitter<ProductState> emit,
  ) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString("token");
    if (token == null) {
      emit(PrductStateAddToCartError());
    }
    final url =
        "http://$CONNECTION_STRING:8080/api/user/cart/add/${event.id}/${token}";
    final uri = Uri.parse(url);
    final response = await http.put(uri);
    final decodedResponse = jsonDecode(response.body);
    if (decodedResponse["success"] == true) {
      emit(ProductNavigateToCart());
    } else {
      emit(PrductStateAddToCartError());
    }
  }
}
