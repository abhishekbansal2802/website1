import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/components/orderSection/ui/order_section.dart';
import 'package:mobile/screens/orders/bloc/orders_bloc.dart';
import 'package:mobile/screens/orders/bloc/orders_event.dart';
import 'package:mobile/screens/orders/bloc/orders_state.dart';

class OrdersPage extends StatefulWidget {
  const OrdersPage({super.key});

  @override
  State<OrdersPage> createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage> {
  final OrdersBloc _ordersBloc = OrdersBloc();

  @override
  void initState() {
    _ordersBloc.add(OrdersEventInitial());
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Orders"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(4.0),
        child: BlocBuilder(
          bloc: _ordersBloc,
          builder: (context, state) {
            if (state is OrderStateLoaded) {
              return ListView.builder(
                itemCount: state.orders.length,
                itemBuilder: (context, index) => OrderSection(
                  id: state.orders[index],
                ),
              );
            } else {
              return Container();
            }
          },
        ),
      ),
    );
  }
}
