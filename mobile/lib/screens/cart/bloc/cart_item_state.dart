import 'package:mobile/models/product.dart';

abstract class CartItemState {}

class CartItemStateInitial extends CartItemState {}

class CartItemStateLoaded extends CartItemState {
  final Product product;

  CartItemStateLoaded({required this.product});
}
