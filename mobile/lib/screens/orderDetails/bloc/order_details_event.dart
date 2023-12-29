import 'package:mobile/models/product.dart';

abstract class OrderDetailsEvent {}

class OrderDetailsEventInitial extends OrderDetailsEvent {
  final String productId;
  final String orderId;

  OrderDetailsEventInitial({
    required this.productId,
    required this.orderId,
  });
}

class OrderDetailsEventCancel extends OrderDetailsEvent {
  final String productId;
  final String orderId;

  OrderDetailsEventCancel({
    required this.productId,
    required this.orderId,
  });
}
