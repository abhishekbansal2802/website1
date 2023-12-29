import 'dart:convert';

import 'package:mobile/constants/constants.dart';
import 'package:mobile/models/user.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

Future<User?> getUser() async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();
  final String? token = prefs.getString("token");
  if (token == null) return null;
  final url = "http://$CONNECTION_STRING:8080/api/user/me/${token}";
  final uri = Uri.parse(url);
  final response = await http.get(uri);
  final decodedresponse = jsonDecode(response.body);
  if (decodedresponse["success"] == true) {
    return User.fromJson(decodedresponse["user"], token);
  } else {
    return null;
  }
}
