import 'package:mobile/screens/products/model/product_full.dart';

abstract class ProductState {}

abstract class ProductStateAction extends ProductState {}

class ProductStateInitial extends ProductState {}

class ProductStateLoaded extends ProductState {
  final ProductFull product;

  ProductStateLoaded({
    required this.product,
  });
}

class PrductStateAddToCartError extends ProductStateAction {}

class ProductNavigateToCart extends ProductStateAction {}

class ProductStateWishlistHandler extends ProductState {
  final bool wishlist;

  ProductStateWishlistHandler({required this.wishlist});
}
