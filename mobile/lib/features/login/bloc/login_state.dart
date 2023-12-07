abstract class LoginState {}

abstract class LoginStateAction extends LoginState {}

class LoginSuccessNavigateToHome extends LoginStateAction {}

class LoginFailed extends LoginState {}

class LoginSuccess extends LoginState {}

class LoginLoading extends LoginState {}

class LoginInitial extends LoginState {}
