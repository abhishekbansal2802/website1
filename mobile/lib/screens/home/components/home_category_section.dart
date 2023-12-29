import 'package:flutter/material.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/screens/home/components/product_card.dart';

class HomeCategorySection extends StatelessWidget {
  const HomeCategorySection({
    super.key,
    required this.title,
    required this.products,
    required this.subtitle,
  });

  final String title;
  final String subtitle;
  final List<Product> products;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.headlineMedium,
        ),
        Text(
          subtitle,
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: 20.0),
        SizedBox(
          height: 300,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: products.length,
            itemBuilder: (context, index) {
              return ProductCard(
                product: products[index],
              );
            },
          ),
        ),
      ],
    );
  }
}
