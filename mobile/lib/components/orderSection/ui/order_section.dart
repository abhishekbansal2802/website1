import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/components/orderCard/ui/order_card.dart';
import 'package:mobile/components/orderSection/bloc/order_section_bloc.dart';
import 'package:mobile/components/orderSection/bloc/order_section_event.dart';
import 'package:mobile/components/orderSection/bloc/order_section_state.dart';

class OrderSection extends StatefulWidget {
  const OrderSection({
    super.key,
    required this.id,
  });

  final String id;

  @override
  State<OrderSection> createState() => _OrderSectionState();
}

class _OrderSectionState extends State<OrderSection> {
  final OrderSectionBloc _orderSectionBloc = OrderSectionBloc();

  @override
  void initState() {
    _orderSectionBloc.add(OrderSectionInitialEvent(id: widget.id));
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder(
      bloc: _orderSectionBloc,
      builder: (context, state) {
        if (state is OrderSectionStateLoaded) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Order ID : ${widget.id}",
                style: Theme.of(context).textTheme.labelMedium,
              ),
              const SizedBox(
                height: 20.0,
              ),
              SizedBox(
                height: 343.0,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: state.orders.length,
                  itemBuilder: (context, index) {
                    return OrderCard(
                      order: state.orders[index],
                      id: widget.id,
                    );
                  },
                ),
              ),
              const SizedBox(
                height: 20.0,
              ),
            ],
          );
        } else {
          return const SizedBox(
            height: 350,
            width: double.maxFinite,
            child: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }
      },
    );
  }
}
