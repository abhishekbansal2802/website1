import 'package:mobile/models/address.dart';
import 'package:mobile/screens/products/model/product_full.dart';

class OrderDetailsModels {
  final ProductFull product;
  final Address address;
  final String quantity;
  final String name;
  final String contactNumber;
  final String status;

  OrderDetailsModels({
    required this.product,
    required this.address,
    required this.quantity,
    required this.name,
    required this.contactNumber,
    required this.status,
  });

  factory OrderDetailsModels.fromJson(Map<String, dynamic> mp) {
    return OrderDetailsModels(
      product: ProductFull.fromJson(mp["product"]),
      address: Address.fromJson(mp["address"]),
      quantity: mp["quantity"].toString(),
      name: mp["name"],
      contactNumber: mp["contactNumber"].toString(),
      status: mp["status"],
    );
  }
}
