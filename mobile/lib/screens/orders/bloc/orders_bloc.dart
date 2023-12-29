import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/screens/orders/bloc/orders_event.dart';
import 'package:mobile/screens/orders/bloc/orders_state.dart';
import 'package:shared_preferences/shared_preferences.dart';

class OrdersBloc extends Bloc<OrdersEvent, OrdersState> {
  OrdersBloc() : super(OrdersStateInitial()) {
    on<OrdersEventInitial>(ordersInitialEvent);
  }

  FutureOr<void> ordersInitialEvent(
    OrdersEventInitial event,
    Emitter<OrdersState> emit,
  ) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString("token");
    if (token == null) {
      emit(OrderStateFailedNavigateHome());
      return;
    }
    final url = "http://$CONNECTION_STRING:8080/api/user/order/$token";
    final uri = Uri.parse(url);
    final response = await http.get(uri);
    final decodedResponse = jsonDecode(response.body);
    if (decodedResponse["success"] == true) {
      emit(
        OrderStateLoaded(
          orders: List<String>.from(
            decodedResponse["orders"],
          ),
        ),
      );
    } else {
      emit(OrderStateFailedNavigateHome());
      return;
    }
  }
}
