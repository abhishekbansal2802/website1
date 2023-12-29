import 'package:mobile/models/product.dart';
import 'package:mobile/models/user.dart';

abstract class HomeState {}

class HomeStateInitial extends HomeState {}

class HomeStateProductsLoaded extends HomeState {
  final List<Product> trendingProduct;
  final List<Product> recommendedProducts;
  final List<Product> mobileProducts;
  final List<Product> furnitureProducts;
  final List<Product> electronicsProducts;

  HomeStateProductsLoaded({
    required this.trendingProduct,
    required this.recommendedProducts,
    required this.mobileProducts,
    required this.furnitureProducts,
    required this.electronicsProducts,
  });
}

class HomeStateUserHandler extends HomeState {
  final User? user;

  HomeStateUserHandler({this.user});
}
