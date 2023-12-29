import 'package:mobile/components/orderSection/model/order_section_model.dart';
import 'package:mobile/screens/orders/bloc/orders_state.dart';

abstract class OrderSectionState {}

abstract class OrderSectionStateAction extends OrderSectionState {}

class OrderSectionInitial extends OrderSectionState {}

class OrderSectionStateLoaded extends OrderSectionState {
  final List<OrderSectionModel> orders;

  OrderSectionStateLoaded({required this.orders});
}

class OrderSectionFailed extends OrderSectionStateAction {}
