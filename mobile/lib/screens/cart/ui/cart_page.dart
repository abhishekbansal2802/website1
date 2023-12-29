import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/screens/cart/bloc/cart_bloc.dart';
import 'package:mobile/screens/cart/bloc/cart_event.dart';
import 'package:mobile/screens/cart/bloc/cart_state.dart';
import 'package:mobile/screens/cart/ui/cart_item.dart';
import 'package:mobile/screens/login/ui/login_screen.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  final CartBloc _cartBloc = CartBloc();

  @override
  void initState() {
    _cartBloc.add(CartEventInitial());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Cart"),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: BlocConsumer<CartBloc, CartState>(
            bloc: _cartBloc,
            listenWhen: (previous, current) => current is CartStateAction,
            listener: (context, state) {
              if (state is CartStateNavigateToLogin) {
                Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (context) => LoginScreen()),
                    (route) => false);
              }
            },
            builder: (context, state) {
              if (state is CartStateLoaded) {
                return Column(
                  children: [
                    Expanded(
                        child: ListView.builder(
                      itemCount: state.cart.length,
                      itemBuilder: (context, index) {
                        return CartItem(
                          productId: state.cart[index].productId,
                          quantity: state.cart[index].quantity,
                        );
                      },
                    )),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue[900],
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(5.0),
                        ),
                        fixedSize: const Size(double.maxFinite, 52.0),
                      ),
                      onPressed: () {},
                      child: const Text("Checkout"),
                    )
                  ],
                );
              }
              return const Center(
                child: CircularProgressIndicator(),
              );
            },
          ),
        ),
      ),
    );
  }
}
