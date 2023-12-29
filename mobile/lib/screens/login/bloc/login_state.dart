abstract class LoginState {}

abstract class LoginStateAction extends LoginState {}

class LoginStateInitial extends LoginState {}

class LoginStateFailed extends LoginState {}

class LoginStateLoading extends LoginState {}

class LoginStateSuccess extends LoginState {}

class LoginStateNavigateHome extends LoginStateAction {}
