abstract class OrderSectionEvent {}

class OrderSectionInitialEvent extends OrderSectionEvent {
  final String id;

  OrderSectionInitialEvent({required this.id});
}
