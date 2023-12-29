class Product {
  final String name;
  final String id;
  final String price;
  final String imageUrl;

  const Product({
    required this.name,
    required this.id,
    required this.price,
    required this.imageUrl,
  });

  factory Product.fromJson(Map<String, dynamic> mp) {
    return Product(
      name: mp["name"] as String,
      id: mp["_id"] as String,
      price: mp["price"].toString(),
      imageUrl: mp["mainImage"]["imageName"] as String,
    );
  }
}
