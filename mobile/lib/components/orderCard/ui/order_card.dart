import 'package:flutter/material.dart';
import 'package:mobile/components/orderSection/model/order_section_model.dart';
import 'package:mobile/constants/constants.dart';
import 'package:mobile/screens/orderDetails/ui/order_details.dart';

class OrderCard extends StatelessWidget {
  const OrderCard({
    super.key,
    required this.order,
    required this.id,
  });

  final OrderSectionModel order;
  final String id;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => OrderDetails(
              orderId: id,
              productId: order.product.id,
            ),
          ),
        );
      },
      child: Card(
        color: Colors.white,
        child: SizedBox(
          width: 225.0,
          height: double.maxFinite,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AspectRatio(
                aspectRatio: 1,
                child: Image.network(
                  "http://$CONNECTION_STRING:8080/${order.product.id}/${order.product.imageUrl}",
                  width: double.maxFinite,
                  fit: BoxFit.cover,
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 8.0),
                child: Text(
                  order.product.name,
                  style: Theme.of(context)
                      .textTheme
                      .headlineSmall
                      ?.copyWith(fontWeight: FontWeight.w500),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 8.0),
                child: Text(
                  "\$ ${order.product.price}",
                  style: Theme.of(context)
                      .textTheme
                      .bodyLarge
                      ?.copyWith(color: Colors.grey[700]),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 8.0),
                child: Text(
                  "Quantity : ${order.quantity}",
                  style: Theme.of(context)
                      .textTheme
                      .bodyLarge
                      ?.copyWith(color: Colors.grey[700]),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 8.0),
                child: Text(
                  order.status,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: order.status == "cancelled"
                            ? Colors.red[600]
                            : Colors.green[600],
                        fontWeight: FontWeight.w700,
                      ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
