import 'dart:async';
import 'dart:convert';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/screens/orderDetails/bloc/order_details_event.dart';
import 'package:mobile/screens/orderDetails/bloc/order_details_state.dart';
import 'package:mobile/screens/orderDetails/model/order_details_model.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class OrderDetailsBloc extends Bloc<OrderDetailsEvent, OrderDetailsState> {
  OrderDetailsBloc() : super(OrderDetailsStateInitial()) {
    on<OrderDetailsEventInitial>(orderDetailsEventInitial);

    on<OrderDetailsEventCancel>(cancelOrder);
  }

  FutureOr<void> orderDetailsEventInitial(
    OrderDetailsEventInitial event,
    Emitter<OrderDetailsState> emit,
  ) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString("token");
    if (token == null) {
      return;
    }
    final url =
        "http://$CONNECTION_STRING:8080/api/order/$token/${event.orderId}/${event.productId}";
    final uri = Uri.parse(url);
    final response = await http.get(uri);
    final decodedResponse = jsonDecode(response.body);
    if (decodedResponse["success"] == true) {
      final order = OrderDetailsModels.fromJson(
        decodedResponse["product"],
      );
      emit(OrderDetailsStateLoaded(order: order));
      return;
    }
  }

  FutureOr<void> cancelOrder(
    OrderDetailsEventCancel event,
    Emitter<OrderDetailsState> emit,
  ) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString("token");
    if (token == null) {
      return;
    }
    final url =
        "http://$CONNECTION_STRING:8080/api/order/cancel/$token/${event.orderId}/${event.productId}";
    final uri = Uri.parse(url);
    final response = await http.put(uri);
    final decodedResponse = jsonDecode(response.body);
    if (decodedResponse["success"] == true) {
      add(
        OrderDetailsEventInitial(
            productId: event.productId, orderId: event.orderId),
      );
    }
  }
}
