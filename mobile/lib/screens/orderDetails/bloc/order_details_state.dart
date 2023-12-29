import 'package:mobile/screens/orderDetails/model/order_details_model.dart';

abstract class OrderDetailsState {}

abstract class OrderDetailsStateAction extends OrderDetailsState {}

class OrderDetailsStateInitial extends OrderDetailsState {}

class OrderDetailsStateLoaded extends OrderDetailsState {
  final OrderDetailsModels order;

  OrderDetailsStateLoaded({required this.order});
}
