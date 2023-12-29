import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/components/drawer/bloc/drawer_bloc.dart';
import 'package:mobile/components/drawer/bloc/drawer_event.dart';
import 'package:mobile/components/drawer/bloc/drawer_state.dart';
import 'package:mobile/screens/cart/ui/cart_page.dart';
import 'package:mobile/screens/login/ui/login_screen.dart';
import 'package:mobile/screens/orders/ui/orders_screen.dart';
import 'package:mobile/screens/wishlist/ui/wishlist_screen.dart';

class CustomDrawer extends StatefulWidget {
  const CustomDrawer({super.key, required this.logoutFunction});

  final Function logoutFunction;

  @override
  State<CustomDrawer> createState() => _CustomDrawerState();
}

class _CustomDrawerState extends State<CustomDrawer> {
  final DrawerBloc _drawerBloc = DrawerBloc();

  @override
  void initState() {
    _drawerBloc.add(DrawerEventInitial());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              BlocBuilder(
                bloc: _drawerBloc,
                builder: (context, state) {
                  if (state is DrawerStateLoggedOut) {
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextButton.icon(
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => const LoginScreen(),
                              ),
                            );
                          },
                          icon: const Icon(
                            CupertinoIcons.person,
                            color: Colors.black87,
                          ),
                          label: const Text(
                            "Login",
                            style: TextStyle(
                              color: Colors.black87,
                            ),
                          ),
                        ),
                      ],
                    );
                  } else if (state is DrawerStateLoggedIn) {
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        GestureDetector(
                          onTap: () {},
                          child: SizedBox(
                            width: double.maxFinite,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  state.user.name,
                                  style: Theme.of(context).textTheme.titleLarge,
                                ),
                                Text(
                                  state.user.email,
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                                Text(
                                  "+91 ${state.user.contactNumber}",
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 10.0),
                        TextButton.icon(
                          onPressed: () {},
                          icon: const Icon(
                            CupertinoIcons.person,
                            color: Colors.black87,
                          ),
                          label: const Text(
                            "Profile",
                            style: TextStyle(
                              color: Colors.black87,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10.0),
                        TextButton.icon(
                          onPressed: () {
                            Navigator.pop(context);
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => const CartPage(),
                              ),
                            );
                          },
                          icon: const Icon(
                            CupertinoIcons.cart,
                            color: Colors.black87,
                          ),
                          label: const Text(
                            "Cart",
                            style: TextStyle(
                              color: Colors.black87,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10.0),
                        TextButton.icon(
                          onPressed: () {
                            Navigator.pop(context);
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => const WishlistScreen(),
                              ),
                            );
                          },
                          icon: const Icon(
                            CupertinoIcons.heart,
                            color: Colors.black87,
                          ),
                          label: const Text(
                            "Wishlist",
                            style: TextStyle(
                              color: Colors.black87,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10.0),
                        TextButton.icon(
                          onPressed: () {
                            Navigator.pop(context);
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => const OrdersPage(),
                              ),
                            );
                          },
                          icon: const Icon(
                            CupertinoIcons.bag,
                            color: Colors.black87,
                          ),
                          label: const Text(
                            "Orders",
                            style: TextStyle(
                              color: Colors.black87,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10.0),
                        TextButton.icon(
                          onPressed: () {},
                          icon: const Icon(
                            CupertinoIcons.money_dollar,
                            color: Colors.black87,
                          ),
                          label: const Text(
                            "Products",
                            style: TextStyle(
                              color: Colors.black87,
                            ),
                          ),
                        ),
                      ],
                    );
                  } else {
                    return Container();
                  }
                },
              ),
              const Expanded(
                child: SizedBox(),
              ),
              BlocBuilder(
                bloc: _drawerBloc,
                builder: (context, state) {
                  if (state is DrawerStateLoggedIn) {
                    return TextButton.icon(
                      onPressed: () {
                        widget.logoutFunction();
                        _drawerBloc.add(DrawerEventLogOut());
                      },
                      icon: Icon(Icons.logout, color: Colors.red[600]),
                      label: Text(
                        "Logout",
                        style: TextStyle(
                          color: Colors.red[600],
                        ),
                      ),
                    );
                  } else {
                    return Container();
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
