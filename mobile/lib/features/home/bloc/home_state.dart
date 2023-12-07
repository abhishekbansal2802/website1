abstract class HomeState {}

abstract class HomeStateAction extends HomeState {}

class HomeStateInitial extends HomeState {}

class HomeStateLoading extends HomeState {}

class HomeStateLogoutSuccess extends HomeStateAction {}
