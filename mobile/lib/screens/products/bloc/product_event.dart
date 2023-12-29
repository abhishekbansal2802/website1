abstract class ProductEvent {}

class ProductEventInitial extends ProductEvent {
  final String id;
  ProductEventInitial({required this.id});
}

class ProductEventBuyNow extends ProductEvent {}

class ProductEventAddToCart extends ProductEvent {
  final String id;
  ProductEventAddToCart({required this.id});
}

class ProductToggleWishlist extends ProductEvent {
  final String id;
  ProductToggleWishlist({required this.id});
}
