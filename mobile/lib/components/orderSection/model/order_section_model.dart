import 'package:mobile/models/product.dart';

class OrderSectionModel {
  final Product product;
  final String quantity;
  final String status;

  OrderSectionModel({
    required this.product,
    required this.quantity,
    required this.status,
  });

  factory OrderSectionModel.fromJson(Map<String, dynamic> mp) {
    return OrderSectionModel(
      product: Product.fromJson(mp["product"]),
      quantity: mp["quantity"].toString(),
      status: mp["status"],
    );
  }
}
