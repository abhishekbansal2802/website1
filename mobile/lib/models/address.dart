class Address {
  final String flatNo;
  final String society;
  final String street;
  final String city;
  final String state;
  final String pincode;
  final String landmark;
  final String tag;
  final String id;

  Address({
    required this.flatNo,
    required this.society,
    required this.street,
    required this.city,
    required this.state,
    required this.pincode,
    required this.landmark,
    required this.tag,
    required this.id,
  });

  factory Address.fromJson(Map<String, dynamic> mp) {
    return Address(
      flatNo: mp["flatNo"],
      society: mp["society"],
      street: mp["street"],
      city: mp["city"],
      state: mp["state"],
      pincode: mp["pincode"],
      landmark: mp["landmark"],
      tag: mp["tag"],
      id: mp["_id"],
    );
  }
}
