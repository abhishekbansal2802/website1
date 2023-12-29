import 'dart:async';
import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/components/orderSection/bloc/order_section_event.dart';
import 'package:mobile/components/orderSection/bloc/order_section_state.dart';
import 'package:mobile/components/orderSection/model/order_section_model.dart';
import 'package:mobile/constants/constants.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

class OrderSectionBloc extends Bloc<OrderSectionEvent, OrderSectionState> {
  OrderSectionBloc() : super(OrderSectionInitial()) {
    on<OrderSectionInitialEvent>(orderSectionInitial);
  }

  FutureOr<void> orderSectionInitial(
    OrderSectionInitialEvent event,
    Emitter<OrderSectionState> emit,
  ) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString("token");
    if (token == null) {
      emit(OrderSectionFailed());
      return;
    }
    final url = "http://$CONNECTION_STRING:8080/api/order/products/${event.id}";
    final uri = Uri.parse(url);
    final response = await http.post(
      uri,
      headers: <String, String>{
        "Content-Type": "application/json",
      },
      body: jsonEncode(
        <String, String>{"token": token},
      ),
    );
    final decodedResponse = jsonDecode(response.body);
    if (decodedResponse["success"] == true) {
      final List<OrderSectionModel> orders = List<OrderSectionModel>.from(
        decodedResponse["orders"]
            .map((e) => OrderSectionModel.fromJson(e))
            .toList(),
      );
      emit(OrderSectionStateLoaded(orders: orders));
      return;
    }
    emit(OrderSectionFailed());
  }
}
