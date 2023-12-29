import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/screens/cart/bloc/cart_item_bloc.dart';
import 'package:mobile/screens/cart/bloc/cart_item_event.dart';
import 'package:mobile/screens/cart/bloc/cart_item_state.dart';
import 'package:mobile/screens/products/ui/products_screen.dart';

class CartItem extends StatefulWidget {
  const CartItem({
    super.key,
    required this.productId,
    required this.quantity,
  });

  final String productId;
  final String quantity;

  @override
  State<CartItem> createState() => _CartItemState();
}

class _CartItemState extends State<CartItem> {
  final CartItemBloc _cartItemBloc = CartItemBloc();

  @override
  void initState() {
    _cartItemBloc.add(CartItemEventInitial(productId: widget.productId));
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: Key(
        widget.productId,
      ),
      onDismissed: (_) {
        _cartItemBloc.add(CartItemEventRemove(productId: widget.productId));
      },
      child: BlocBuilder(
        bloc: _cartItemBloc,
        builder: (context, state) {
          if (state is CartItemStateLoaded) {
            return Card(
              child: ListTile(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => ProductPage(
                        productId: widget.productId,
                      ),
                    ),
                  );
                },
                title: Text(state.product.name),
                leading: CircleAvatar(
                  backgroundColor: Colors.white,
                  backgroundImage: NetworkImage(
                    "http://$CONNECTION_STRING:8080/${state.product.id}/${state.product.imageUrl}",
                  ),
                ),
                subtitle: Text(
                  "\$ ${state.product.price}",
                ),
                trailing: Text(
                  widget.quantity,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
            );
          }
          return const Center(
            child: CircularProgressIndicator(),
          );
        },
      ),
    );
  }
}
