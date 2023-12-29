import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/components/drawer/ui/custom_drawer.dart';
import 'package:mobile/screens/cart/ui/cart_page.dart';
import 'package:mobile/screens/home/bloc/home_bloc.dart';
import 'package:mobile/screens/home/bloc/home_event.dart';
import 'package:mobile/screens/home/bloc/home_state.dart';
import 'package:mobile/screens/home/components/home_category_section.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final HomeBloc _homeBloc = HomeBloc();

  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    _homeBloc.add(HomeInitialEvent());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            children: [
              const SizedBox(height: 10.0),
              TextField(
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.grey[100],
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(100.0),
                    borderSide: BorderSide.none,
                  ),
                  prefixIcon: const Icon(
                    CupertinoIcons.search,
                  ),
                  hintText: "Search",
                ),
              ),
              const SizedBox(height: 20.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      BlocBuilder(
                        bloc: _homeBloc,
                        buildWhen: (previous, current) =>
                            current is HomeStateUserHandler,
                        builder: (context, state) {
                          if (state is HomeStateUserHandler) {
                            return Text(
                              "Welcome ${state.user?.name ?? "user"}",
                              style: Theme.of(context)
                                  .textTheme
                                  .titleLarge
                                  ?.copyWith(fontWeight: FontWeight.w500),
                            );
                          } else {
                            return Text(
                              "Welcome User",
                              style: Theme.of(context)
                                  .textTheme
                                  .titleLarge
                                  ?.copyWith(fontWeight: FontWeight.w500),
                            );
                          }
                        },
                      ),
                      Text(
                        "Lets Explore",
                        style: Theme.of(context)
                            .textTheme
                            .bodyLarge
                            ?.copyWith(fontWeight: FontWeight.w400),
                      ),
                    ],
                  ),
                  const Expanded(
                    child: SizedBox(),
                  ),
                  IconButton(
                    style: IconButton.styleFrom(
                      backgroundColor: Colors.blue[50],
                    ),
                    onPressed: () {
                      _scaffoldKey.currentState?.openDrawer();
                    },
                    icon: const Icon(CupertinoIcons.square_grid_2x2),
                  )
                ],
              ),
              const SizedBox(height: 20.0),
              Expanded(
                child: ListView(
                  shrinkWrap: true,
                  children: [
                    BlocBuilder(
                      buildWhen: (prev, curr) =>
                          curr is HomeStateProductsLoaded,
                      bloc: _homeBloc,
                      builder: (context, state) {
                        if (state is HomeStateProductsLoaded &&
                            state.trendingProduct.isNotEmpty) {
                          return HomeCategorySection(
                            title: "Trending Today",
                            products: state.trendingProduct,
                            subtitle: "Shop with today's trend",
                          );
                        } else {
                          return Container();
                        }
                      },
                    ),
                    const SizedBox(height: 20.0),
                    BlocBuilder(
                      buildWhen: (prev, curr) =>
                          curr is HomeStateProductsLoaded,
                      bloc: _homeBloc,
                      builder: (context, state) {
                        if (state is HomeStateProductsLoaded &&
                            state.recommendedProducts.isNotEmpty) {
                          return HomeCategorySection(
                            title: "Recommended for you",
                            products: state.recommendedProducts,
                            subtitle: "based on past interests",
                          );
                        } else {
                          return Container();
                        }
                      },
                    ),
                    const SizedBox(height: 20.0),
                    BlocBuilder(
                      buildWhen: (prev, curr) =>
                          curr is HomeStateProductsLoaded,
                      bloc: _homeBloc,
                      builder: (context, state) {
                        if (state is HomeStateProductsLoaded &&
                            state.mobileProducts.isNotEmpty) {
                          return HomeCategorySection(
                            title: "Mobile Phones",
                            products: state.mobileProducts,
                            subtitle: "our top mobile picks for you",
                          );
                        } else {
                          return Container();
                        }
                      },
                    ),
                    const SizedBox(height: 20.0),
                    BlocBuilder(
                      buildWhen: (prev, curr) =>
                          curr is HomeStateProductsLoaded,
                      bloc: _homeBloc,
                      builder: (context, state) {
                        if (state is HomeStateProductsLoaded &&
                            state.furnitureProducts.isNotEmpty) {
                          return HomeCategorySection(
                            title: "Furniture",
                            products: state.furnitureProducts,
                            subtitle: "what suits your home",
                          );
                        } else {
                          return Container();
                        }
                      },
                    ),
                    const SizedBox(height: 20.0),
                    BlocBuilder(
                      buildWhen: (prev, curr) =>
                          curr is HomeStateProductsLoaded,
                      bloc: _homeBloc,
                      builder: (context, state) {
                        if (state is HomeStateProductsLoaded &&
                            state.electronicsProducts.isNotEmpty) {
                          return HomeCategorySection(
                            title: "Electronics",
                            products: state.electronicsProducts,
                            subtitle:
                                "we will help you find most apt appliances",
                          );
                        } else {
                          return Container();
                        }
                      },
                    ),
                  ],
                ),
              )
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.of(context)
              .push(MaterialPageRoute(builder: (context) => const CartPage()));
        },
        child: const Icon(
          CupertinoIcons.cart,
        ),
      ),
      drawer: CustomDrawer(
        logoutFunction: () {
          _homeBloc.add(HomeEventLogout());
          _scaffoldKey.currentState?.closeDrawer();
        },
      ),
    );
  }
}
