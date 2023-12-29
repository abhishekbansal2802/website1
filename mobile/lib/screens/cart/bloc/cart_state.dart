import 'package:mobile/screens/cart/model/cart_response.dart';

abstract class CartState {}

abstract class CartStateAction extends CartState {}

class CartStateNavigateToLogin extends CartStateAction {}

class CartStateInitial extends CartState {}

class CartStateLoaded extends CartState {
  final List<CartResponse> cart;

  CartStateLoaded({required this.cart});
}
