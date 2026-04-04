import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/vendor_registration_request.dart';
import '../../core/constants/api_constants.dart';

class VendorApiService {
  Future<bool> registerVendor(VendorRegistrationRequest request) async {
    try {
      final uri = Uri.parse(ApiConstants.vendorRegister);
      final req = http.MultipartRequest('POST', uri);

      req.fields['personName'] = request.personName;
      req.fields['email'] = request.email;
      req.fields['password'] = request.password;
      req.fields['phoneNumber'] = request.phoneNumber;
      req.fields['companyName'] = request.companyName;

      // Complex JSON objects
      final companyAddress = {
        'street': request.street,
        'city': request.city,
        'mandal': request.mandal,
        'district': request.district,
        'state': request.state,
        'pincode': request.pincode,
      };
      req.fields['companyAddress'] = jsonEncode(companyAddress);
      req.fields['servicesProvided'] = jsonEncode(request.servicesProvided);

      final socialLinks = {
        if (request.instagram.isNotEmpty) 'instagram': request.instagram,
        if (request.facebook.isNotEmpty) 'facebook': request.facebook,
        if (request.youtube.isNotEmpty) 'youtube': request.youtube,
        if (request.whatsapp.isNotEmpty) 'whatsapp': request.whatsapp,
      };
      req.fields['socialLinks'] = jsonEncode(socialLinks);

      // Files
      for (var file in request.serviceImages) {
        final bytes = await file.readAsBytes();
        final multipartFile = http.MultipartFile.fromBytes(
          'serviceImages', 
          bytes, 
          filename: file.name
        );
        req.files.add(multipartFile);
      }

      final response = await req.send();
      final responseBody = await response.stream.bytesToString();

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = jsonDecode(responseBody);
        return data['success'] ?? false;
      } else {
        final errorData = jsonDecode(responseBody);
        throw Exception(errorData['message'] ?? 'Failed to register vendor.');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}
