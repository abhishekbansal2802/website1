class User {
  final String name;
  final String email;
  final String userType;
  final String contactNumber;
  final String token;
  final List<String> wishlist;

  User({
    required this.name,
    required this.email,
    required this.userType,
    required this.wishlist,
    required this.contactNumber,
    required this.token,
  });

  factory User.fromJson(Map<String, dynamic> mp, String token) {
    return User(
      name: mp["name"],
      email: mp["email"],
      userType: mp["userType"],
      contactNumber: mp["contactNumber"].toString(),
      wishlist: List<String>.from(mp["wishlist"]),
      token: token,
    );
  }
}
