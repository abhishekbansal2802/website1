abstract class CartItemEvent {}

class CartItemEventInitial extends CartItemEvent {
  final String productId;

  CartItemEventInitial({required this.productId});
}

class CartItemEventRemove extends CartItemEvent {
  final String productId;

  CartItemEventRemove({required this.productId});
}
