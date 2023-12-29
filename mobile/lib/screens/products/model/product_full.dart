class ProductFull {
  final String id;
  final String name;
  final String subtitle;
  final String price;
  final String stock;
  final String rating;
  final List<String> highlights;
  final CustomImage mainImage;
  final CustomImage image1;
  final CustomImage image2;
  final CustomImage image3;
  final CustomImage image4;
  final List<Features> features;

  ProductFull({
    required this.id,
    required this.name,
    required this.subtitle,
    required this.price,
    required this.stock,
    required this.rating,
    required this.mainImage,
    required this.image1,
    required this.image2,
    required this.image3,
    required this.image4,
    required this.features,
    required this.highlights,
  });

  factory ProductFull.fromJson(Map<String, dynamic> mp) {
    final mainImage = CustomImage(
      imageName: mp["mainImage"]["imageName"],
      imageUrl: mp["mainImage"]["imageUrl"],
    );
    final image1 = CustomImage(
      imageName: mp["images"]["image1"]["imageName"],
      imageUrl: mp["images"]["image1"]["imageUrl"],
    );
    final image2 = CustomImage(
      imageName: mp["images"]["image2"]["imageName"],
      imageUrl: mp["images"]["image2"]["imageUrl"],
    );
    final image3 = CustomImage(
      imageName: mp["images"]["image3"]["imageName"],
      imageUrl: mp["images"]["image3"]["imageUrl"],
    );
    final image4 = CustomImage(
      imageName: mp["images"]["image4"]["imageName"],
      imageUrl: mp["images"]["image4"]["imageUrl"],
    );

    final features = List<Features>.from(mp["features"].map((e) {
      final image = CustomImage(
        imageName: e["image"]["imageName"],
        imageUrl: e["image"]["imageName"],
      );
      return Features(
        image: image,
        title: e["headline"],
        description: e["description"],
      );
    }).toList());

    return ProductFull(
      id: mp["_id"],
      name: mp["name"],
      subtitle: mp["subtitle"],
      price: mp["price"].toString(),
      stock: mp["stock"].toString(),
      rating: mp["rating"].toString(),
      mainImage: mainImage,
      image1: image1,
      highlights: List<String>.from(mp["highlights"]),
      image2: image2,
      image3: image3,
      image4: image4,
      features: features,
    );
  }
}

class Features {
  final CustomImage image;
  final String title;
  final String description;

  Features({
    required this.image,
    required this.title,
    required this.description,
  });
}

class CustomImage {
  final String imageName;
  final String imageUrl;

  CustomImage({
    required this.imageName,
    required this.imageUrl,
  });
}
