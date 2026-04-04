import 'package:image_picker/image_picker.dart';

class VendorRegistrationRequest {
  final String personName;
  final String email;
  final String password;
  final String phoneNumber;
  final String companyName;

  // Address
  final String street;
  final String city;
  final String mandal;
  final String district;
  final String state;
  final String pincode;

  // Selected Services
  final List<String> servicesProvided;

  // Socials
  final String instagram;
  final String facebook;
  final String youtube;
  final String whatsapp;

  // Images
  final List<XFile> serviceImages;

  VendorRegistrationRequest({
    required this.personName,
    required this.email,
    required this.password,
    required this.phoneNumber,
    required this.companyName,
    required this.street,
    required this.city,
    required this.mandal,
    required this.district,
    required this.state,
    required this.pincode,
    required this.servicesProvided,
    required this.instagram,
    required this.facebook,
    required this.youtube,
    required this.whatsapp,
    required this.serviceImages,
  });
}
