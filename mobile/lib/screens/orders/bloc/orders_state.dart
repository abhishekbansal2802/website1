abstract class OrdersState {}

abstract class OrdersStateAction extends OrdersState {}

class OrdersStateInitial extends OrdersState {}

class OrderStateLoaded extends OrdersState {
  final List<String> orders;

  OrderStateLoaded({required this.orders});
}

class OrderStateFailedNavigateHome extends OrdersStateAction {}
