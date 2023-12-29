import 'dart:async';
import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/methods/methods.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/screens/home/bloc/home_event.dart';
import 'package:mobile/screens/home/bloc/home_state.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  HomeBloc() : super(HomeStateInitial()) {
    on<HomeInitialEvent>(homeInitialEvent);

    on<HomeEventLogout>(logoutHandler);
  }

  FutureOr<void> homeInitialEvent(
    HomeInitialEvent event,
    Emitter<HomeState> emit,
  ) async {
    final user = await getUser();
    emit(HomeStateUserHandler(user: user));
    final trendingProduct = await getProducts(
      "http://$CONNECTION_STRING:8080/api/analytics/trending",
    );
    emit(
      HomeStateProductsLoaded(
        trendingProduct: trendingProduct,
        recommendedProducts: [],
        mobileProducts: [],
        furnitureProducts: [],
        electronicsProducts: [],
      ),
    );
    final recommendedProducts = await getProducts(
      "http://$CONNECTION_STRING:8080/api/product",
    );
    emit(HomeStateProductsLoaded(
        trendingProduct: trendingProduct,
        recommendedProducts: recommendedProducts,
        mobileProducts: [],
        furnitureProducts: [],
        electronicsProducts: []));
    final mobileProducts = await getProducts(
      "http://$CONNECTION_STRING:8080/api/analytics/mobile",
    );
    emit(HomeStateProductsLoaded(
        trendingProduct: trendingProduct,
        recommendedProducts: recommendedProducts,
        mobileProducts: mobileProducts,
        furnitureProducts: [],
        electronicsProducts: []));
    final furnitureProducts = await getProducts(
        "http://$CONNECTION_STRING:8080/api/analytics/furniture");
    emit(HomeStateProductsLoaded(
        trendingProduct: trendingProduct,
        recommendedProducts: recommendedProducts,
        mobileProducts: mobileProducts,
        furnitureProducts: furnitureProducts,
        electronicsProducts: []));
    final electronicsProducts = await getProducts(
        "http://$CONNECTION_STRING:8080/api/analytics/appliance");
    emit(HomeStateProductsLoaded(
        trendingProduct: trendingProduct,
        recommendedProducts: recommendedProducts,
        mobileProducts: mobileProducts,
        furnitureProducts: furnitureProducts,
        electronicsProducts: electronicsProducts));
  }

  FutureOr<void> logoutHandler(
    HomeEventLogout event,
    Emitter<HomeState> emit,
  ) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.remove("token");
    emit(HomeStateUserHandler(user: null));
  }

  Future<List<Product>> getProducts(String url) async {
    final uri = Uri.parse(
      url,
    );
    final response = await http.get(uri);
    final decodedResponse = jsonDecode(response.body);
    if (decodedResponse["success"] == true) {
      final List<Product> products = List<Product>.from(
          decodedResponse["products"].map((e) => Product.fromJson(e)).toList());
      return products;
    }
    return List.empty();
  }
}
