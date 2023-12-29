class CartResponse {
  final String productId;
  final String quantity;

  CartResponse({
    required this.productId,
    required this.quantity,
  });

  factory CartResponse.fromJson(Map<String, dynamic> mp) {
    return CartResponse(
      productId: mp["productId"],
      quantity: mp["quantity"].toString(),
    );
  }
}
