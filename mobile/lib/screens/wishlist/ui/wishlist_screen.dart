import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/screens/products/ui/products_screen.dart';
import 'package:mobile/screens/wishlist/bloc/wishlist_bloc.dart';
import 'package:mobile/screens/wishlist/bloc/wishlist_event.dart';
import 'package:mobile/screens/wishlist/bloc/wishlist_state.dart';

class WishlistScreen extends StatefulWidget {
  const WishlistScreen({super.key});

  @override
  State<WishlistScreen> createState() => _WishlistScreenState();
}

class _WishlistScreenState extends State<WishlistScreen> {
  final WishlistBloc _wishlistBloc = WishlistBloc();

  @override
  void initState() {
    _wishlistBloc.add(WishlistEventInitial());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Wishlist"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(4.0),
        child: BlocConsumer(
          bloc: _wishlistBloc,
          listener: (context, state) {},
          buildWhen: (previous, current) => current is! WishlistStateAction,
          builder: (context, state) {
            if (state is WishlistStateLoaded) {
              return GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2, childAspectRatio: 0.75),
                itemCount: state.products.length,
                itemBuilder: (context, index) => GestureDetector(
                  onTap: () async {
                    await Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => ProductPage(
                          productId: state.products[index].id,
                        ),
                      ),
                    );
                    _wishlistBloc.add(WishlistEventInitial());
                  },
                  child: Card(
                    color: Colors.white,
                    clipBehavior: Clip.antiAlias,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        AspectRatio(
                          aspectRatio: 1,
                          child: Image.network(
                              "http://$CONNECTION_STRING:8080/${state.products[index].id}/${state.products[index].imageUrl}",
                              width: double.maxFinite,
                              fit: BoxFit.cover),
                        ),
                        Padding(
                          padding: const EdgeInsets.only(left: 8.0),
                          child: Text(
                            state.products[index].name,
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
                            "\$ ${state.products[index].price}",
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
            } else {
              return Container();
            }
          },
        ),
      ),
    );
  }
}
