import 'package:mobile/models/product.dart';

abstract class WishlistState {}

abstract class WishlistStateAction extends WishlistState {}

class WishlistStateInitial extends WishlistState {}

class WishlistStateLoaded extends WishlistState {
  final List<Product> products;

  WishlistStateLoaded({required this.products});
}

class WishlistStateNavigateToHome extends WishlistStateAction {}
 
// class relicare extends WindowPadding {}


// galaxo pharma 
