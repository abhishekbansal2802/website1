import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/screens/orderDetails/bloc/order_details_bloc.dart';
import 'package:mobile/screens/orderDetails/bloc/order_details_event.dart';
import 'package:mobile/screens/orderDetails/bloc/order_details_state.dart';

class OrderDetails extends StatefulWidget {
  const OrderDetails({
    super.key,
    required this.orderId,
    required this.productId,
  });

  final String orderId;
  final String productId;

  @override
  State<OrderDetails> createState() => _OrderDetailsState();
}

class _OrderDetailsState extends State<OrderDetails> {
  final OrderDetailsBloc _orderDetailsBloc = OrderDetailsBloc();

  @override
  void initState() {
    _orderDetailsBloc.add(
      OrderDetailsEventInitial(
        productId: widget.productId,
        orderId: widget.orderId,
      ),
    );
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: BlocBuilder(
          bloc: _orderDetailsBloc,
          builder: (context, state) {
            if (state is OrderDetailsStateLoaded) {
              return SizedBox(
                width: double.maxFinite,
                child: ListView(
                  children: [
                    AspectRatio(
                      aspectRatio: 1,
                      child: Card(
                        clipBehavior: Clip.antiAlias,
                        child: Image.network(
                          "http://$CONNECTION_STRING:8080/${state.order.product.id}/${state.order.product.mainImage.imageName}",
                          width: double.maxFinite,
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    const SizedBox(height: 10.0),
                    Text(
                      state.order.product.name,
                      style:
                          Theme.of(context).textTheme.headlineMedium?.copyWith(
                                color: Colors.grey[800],
                                fontWeight: FontWeight.w600,
                              ),
                    ),
                    Text(
                      "\$ ${state.order.product.price}",
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Colors.grey[700],
                          ),
                    ),
                    Text(
                      "Quantity : ${state.order.quantity}",
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Colors.grey[700],
                          ),
                    ),
                    const SizedBox(height: 20.0),
                    ListTile(
                      leading: CircleAvatar(
                        backgroundColor: state.order.status != "cancelled"
                            ? Colors.green[200]
                            : Colors.red[200],
                      ),
                      title: Text(
                        "Confirmed",
                        style: TextStyle(
                          color: Colors.grey[800],
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    ListTile(
                      leading: CircleAvatar(
                        backgroundColor: state.order.status != "cancelled" &&
                                state.order.status != "delivered" &&
                                state.order.status != "in transit"
                            ? Colors.grey[200]
                            : state.order.status == "in transit"
                                ? Colors.green[200]
                                : Colors.red[200],
                      ),
                      title: Text(
                        "In Transit",
                        style: TextStyle(
                          color: Colors.grey[800],
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    ListTile(
                      leading: CircleAvatar(
                        backgroundColor: state.order.status != "cancelled" &&
                                state.order.status != "delivered"
                            ? Colors.grey[200]
                            : state.order.status == "delivered"
                                ? Colors.green[200]
                                : Colors.red[200],
                      ),
                      title: Text(
                        "Delivered",
                        style: TextStyle(
                          color: Colors.grey[800],
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    state.order.status == "cancelled"
                        ? ListTile(
                            leading: CircleAvatar(
                              backgroundColor: Colors.red[200],
                            ),
                            title: Text(
                              "Cancelled",
                              style: TextStyle(
                                color: Colors.grey[800],
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          )
                        : Container(),
                    const SizedBox(height: 20.0),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              foregroundColor: Colors.red[600],
                              backgroundColor: Colors.red[100],
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(5.0),
                                side: state.order.status == "cancelled"
                                    ? BorderSide.none
                                    : const BorderSide(
                                        color: Colors.red,
                                      ),
                              ),
                            ),
                            onPressed: state.order.status == "cancelled"
                                ? null
                                : () {
                                    _orderDetailsBloc.add(
                                        OrderDetailsEventCancel(
                                            productId: state.order.product.id,
                                            orderId: widget.orderId));
                                  },
                            child: const Text("Cancel"),
                          ),
                        ),
                        const SizedBox(
                          width: 10.0,
                        ),
                        Expanded(
                          child: TextButton(
                            style: TextButton.styleFrom(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(5.0),
                              ),
                              foregroundColor: Colors.grey[600],
                            ),
                            onPressed: () {},
                            child: const Text("Need Help?"),
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 20.0),
                    Card(
                      color: Colors.white,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              state.order.name,
                              style: Theme.of(context)
                                  .textTheme
                                  .headlineSmall
                                  ?.copyWith(
                                    color: Colors.grey[800],
                                    fontWeight: FontWeight.w600,
                                  ),
                            ),
                            const SizedBox(
                              height: 5.0,
                            ),
                            Text(
                              "${state.order.address.flatNo}, ${state.order.address.society}, ${state.order.address.street}, ${state.order.address.city}, ${state.order.address.state}, ${state.order.address.pincode}, near ${state.order.address.landmark}",
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                            const SizedBox(
                              height: 5.0,
                            ),
                            Text(
                              "+91 ${state.order.contactNumber}",
                              style: Theme.of(context).textTheme.bodyMedium,
                            )
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            } else {
              return const Center(
                child: CircularProgressIndicator(),
              );
            }
          },
        ),
      ),
    );
  }
}
