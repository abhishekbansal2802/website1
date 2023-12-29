import 'package:flutter/material.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/models/product.dart';

import 'package:mobile/screens/products/ui/products_screen.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.product,
  });

  final Product product;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 225.0,
      child: GestureDetector(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => ProductPage(productId: product.id),
            ),
          );
        },
        child: Card(
          color: Colors.white,
          clipBehavior: Clip.antiAlias,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Image.network(
                "http://$CONNECTION_STRING:8080/${product.id}/${product.imageUrl}",
                width: 225.0,
                height: 225.0,
                fit: BoxFit.cover,
              ),
              Padding(
                padding: const EdgeInsets.only(left: 8.0),
                child: Text(
                  product.name,
                  style: Theme.of(context)
                      .textTheme
                      .headlineSmall
                      ?.copyWith(fontWeight: FontWeight.w500),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 8.0),
                child: Text(
                  "\$ ${product.price}",
                  style: Theme.of(context)
                      .textTheme
                      .bodyLarge
                      ?.copyWith(color: Colors.grey[700]),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
