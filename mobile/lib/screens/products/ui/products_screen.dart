import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/screens/cart/ui/cart_page.dart';
import 'package:mobile/screens/products/bloc/product_bloc.dart';
import 'package:mobile/screens/products/bloc/product_event.dart';
import 'package:mobile/screens/products/bloc/product_state.dart';
import 'package:mobile/screens/products/model/product_full.dart';

class ProductPage extends StatefulWidget {
  const ProductPage({
    super.key,
    required this.productId,
  });

  final String productId;

  @override
  State<ProductPage> createState() => _ProductPageState();
}

class _ProductPageState extends State<ProductPage> {
  final ProductBloc _productBloc = ProductBloc();

  @override
  void initState() {
    _productBloc.add(
      ProductEventInitial(
        id: widget.productId,
      ),
    );
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          BlocBuilder(
            buildWhen: (previous, current) =>
                current is ProductStateWishlistHandler,
            bloc: _productBloc,
            builder: (context, state) {
              if (state is ProductStateWishlistHandler) {
                return IconButton(
                  onPressed: () {
                    _productBloc
                        .add(ProductToggleWishlist(id: widget.productId));
                  },
                  icon: Icon(
                    state.wishlist
                        ? CupertinoIcons.heart_fill
                        : CupertinoIcons.heart,
                    color: Colors.red[400],
                  ),
                );
              } else {
                return const SizedBox();
              }
            },
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: SafeArea(
          child: BlocConsumer(
            bloc: _productBloc,
            listenWhen: (prev, curr) => curr is ProductStateAction,
            listener: (context, state) {
              if (state is ProductNavigateToCart) {
                Navigator.of(context).push(
                    MaterialPageRoute(builder: (context) => const CartPage()));
              }
            },
            buildWhen: (prev, curr) => curr is ProductStateLoaded,
            builder: (context, state) {
              if (state is ProductStateLoaded) {
                return ProductViewer(
                  product: state.product,
                  bloc: _productBloc,
                );
              } else {
                return const Center(
                  child: CircularProgressIndicator(),
                );
              }
            },
          ),
        ),
      ),
    );
  }
}

class ProductViewer extends StatelessWidget {
  const ProductViewer({
    super.key,
    required this.product,
    required this.bloc,
  });

  final ProductFull product;

  final ProductBloc bloc;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.max,
      children: [
        Expanded(
          child: ListView(
            children: [
              SizedBox(
                height: 300.0,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    ImageCard(
                      url:
                          "http://$CONNECTION_STRING:8080/${product.id}/${product.mainImage.imageName}",
                    ),
                    const SizedBox(
                      width: 10.0,
                    ),
                    ImageCard(
                      url:
                          "http://$CONNECTION_STRING:8080/${product.id}/${product.image1.imageName}",
                    ),
                    const SizedBox(
                      width: 10.0,
                    ),
                    ImageCard(
                      url:
                          "http://$CONNECTION_STRING:8080/${product.id}/${product.image2.imageName}",
                    ),
                    const SizedBox(
                      width: 10.0,
                    ),
                    ImageCard(
                      url:
                          "http://$CONNECTION_STRING:8080/${product.id}/${product.image3.imageName}",
                    ),
                    const SizedBox(
                      width: 10.0,
                    ),
                    ImageCard(
                      url:
                          "http://$CONNECTION_STRING:8080/${product.id}/${product.image4.imageName}",
                    )
                  ],
                ),
              ),
              const SizedBox(
                height: 20.0,
              ),
              Text(
                product.name,
                style: Theme.of(context)
                    .textTheme
                    .displayMedium
                    ?.copyWith(fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 20.0),
              Text(
                product.subtitle,
                style: TextStyle(color: Colors.grey[700]),
              ),
              const SizedBox(height: 10.0),
              Text(
                "\$ ${product.price}",
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 20.0),
              Text(
                "Product Highlights",
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                      color: Colors.grey[800],
                      fontWeight: FontWeight.w600,
                    ),
              ),
              const SizedBox(height: 20.0),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: product.highlights
                    .map(
                      (e) => Text(
                        "\u2022 $e",
                      ),
                    )
                    .toList(),
              ),
              const SizedBox(height: 20.0),
              Text(
                "Features",
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                      color: Colors.grey[800],
                      fontWeight: FontWeight.w600,
                    ),
              ),
              const SizedBox(height: 20.0),
              Column(
                children: product.features
                    .map((e) => FeatureCard(feature: e, id: product.id))
                    .toList(),
              ),
            ],
          ),
        ),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(5.0),
                  ),
                ),
                onPressed: () {},
                child: const Text("Buy Now"),
              ),
            ),
            const SizedBox(
              width: 8.0,
            ),
            Expanded(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(5.0)),
                ),
                onPressed: () {
                  bloc.add(ProductEventAddToCart(id: product.id));
                },
                child: const Text("Add To Cart"),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class ImageCard extends StatelessWidget {
  const ImageCard({super.key, required this.url});

  final String url;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: Image.network(
        url,
        width: 300.0,
        height: 300.0,
        fit: BoxFit.cover,
      ),
    );
  }
}

class FeatureCard extends StatelessWidget {
  const FeatureCard({
    super.key,
    required this.feature,
    required this.id,
  });

  final Features feature;
  final String id;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.maxFinite,
      child: Card(
        color: Colors.white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                feature.title,
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ),
            AspectRatio(
              aspectRatio: 1.0,
              child: Image.network(
                "http://$CONNECTION_STRING:8080/$id/features/${feature.image.imageName}",
                width: double.maxFinite,
                fit: BoxFit.cover,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                feature.description,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
