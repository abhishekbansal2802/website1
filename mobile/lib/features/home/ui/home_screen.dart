import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:mobile/features/home/bloc/home_bloc.dart';
import 'package:mobile/features/home/bloc/home_event.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  GlobalKey<ScaffoldState> scafolKey = GlobalKey<ScaffoldState>();

  final HomeBloc homeBloc = HomeBloc();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scafolKey,
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Welcome Abhishek",
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    Text(
                      "What do you desire today?",
                      style: Theme.of(context).textTheme.bodySmall,
                    )
                  ],
                ),
                IconButton(
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.blue[50],
                  ),
                  onPressed: () {
                    scafolKey.currentState?.openDrawer();
                  },
                  icon: const Icon(
                    CupertinoIcons.square_grid_2x2,
                  ),
                )
              ],
            )
          ],
        ),
      ),
      drawer: Drawer(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Expanded(
                  child: SizedBox(),
                ),
                TextButton.icon(
                  style: TextButton.styleFrom(
                    foregroundColor: Colors.red[500],
                  ),
                  onPressed: () async {
                    final bool? logout = await showDialog(
                      context: context,
                      builder: (context) {
                        return AlertDialog(
                          title: const Text("Logout?"),
                          content:
                              const Text("Are you sure you want to logout?"),
                          actions: [
                            TextButton(
                              onPressed: () {
                                Navigator.of(context).pop(false);
                              },
                              child: const Text("Reject"),
                            ),
                            TextButton(
                              onPressed: () {
                                Navigator.of(context).pop(true);
                              },
                              child: const Text("Confirm"),
                            ),
                          ],
                        );
                      },
                    );
                    final bool status = logout ?? false;
                    if (status) {
                      homeBloc.add(HomeEventLogout());
                    }
                  },
                  label: const Text(
                    "logout",
                  ),
                  icon: const Icon(
                    Icons.logout,
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
