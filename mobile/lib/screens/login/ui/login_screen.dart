import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mobile/screens/home/ui/home_screen.dart';
import 'package:mobile/screens/login/bloc/login_bloc.dart';
import 'package:mobile/screens/login/bloc/login_event.dart';
import 'package:mobile/screens/login/bloc/login_state.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late TextEditingController _emailController;
  late TextEditingController _passwordController;

  final LoginBloc _loginBloc = LoginBloc();

  @override
  void initState() {
    _emailController = TextEditingController();
    _passwordController = TextEditingController();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: BlocListener(
            bloc: _loginBloc,
            listenWhen: (previous, current) => current is LoginStateAction,
            listener: (context, state) {
              if (state is LoginStateNavigateHome) {
                Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (context) => const HomePage()),
                    (route) => false);
              }
            },
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Login",
                  style: Theme.of(context)
                      .textTheme
                      .displayMedium
                      ?.copyWith(fontWeight: FontWeight.w600),
                ),
                Text(
                  "to get best experience at Desires",
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const Expanded(child: SizedBox()),
                TextField(
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    label: Text("Email"),
                  ),
                  controller: _emailController,
                ),
                const SizedBox(height: 20.0),
                TextField(
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    label: Text("Password"),
                  ),
                  controller: _passwordController,
                  obscureText: true,
                  autocorrect: false,
                ),
                const Expanded(child: SizedBox()),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue[900],
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(5.0),
                    ),
                    fixedSize: const Size(double.maxFinite, 52.0),
                  ),
                  onPressed: () {
                    _loginBloc.add(
                      LoginButtonClickedEvent(
                        email: _emailController.text,
                        password: _passwordController.text,
                      ),
                    );
                  },
                  child: const Text("Login"),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
