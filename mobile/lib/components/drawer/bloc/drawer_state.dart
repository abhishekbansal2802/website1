import 'package:mobile/models/user.dart';

abstract class DrawerState {}

abstract class DrawerStateAction {}

class DrawerStateInitial extends DrawerState {}

class DrawerStateLoggedIn extends DrawerState {
  final User user;

  DrawerStateLoggedIn({required this.user});
}

class DrawerStateLoggedOut extends DrawerState {}
