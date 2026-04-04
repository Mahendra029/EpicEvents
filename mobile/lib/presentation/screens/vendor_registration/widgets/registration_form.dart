import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../data/models/vendor_registration_request.dart';
import '../../../../data/services/vendor_api_service.dart';
import '../../../widgets/custom_text_field.dart';
import '../../../widgets/custom_button.dart';
import '../../../../core/theme/app_colors.dart';

class RegistrationForm extends StatefulWidget {
  const RegistrationForm({Key? key}) : super(key: key);

  @override
  State<RegistrationForm> createState() => _RegistrationFormState();
}

class _RegistrationFormState extends State<RegistrationForm> {
  final _formKey = GlobalKey<FormState>();
  final _apiService = VendorApiService();
  final ImagePicker _picker = ImagePicker();

  // Basic Controllers
  final _personNameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _companyNameCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();

  // Address Controllers
  final _streetCtrl = TextEditingController();
  final _cityCtrl = TextEditingController();
  final _mandalCtrl = TextEditingController();
  final _districtCtrl = TextEditingController();
  final _stateCtrl = TextEditingController();
  final _pincodeCtrl = TextEditingController();

  // Social Controllers
  final _instagramCtrl = TextEditingController();
  final _facebookCtrl = TextEditingController();
  final _youtubeCtrl = TextEditingController();
  final _whatsappCtrl = TextEditingController();

  // Complex State
  List<String> _selectedServices = [];
  List<XFile> _serviceImages = [];
  bool _isLoading = false;

  final List<String> _availableServices = [
    'FunctionHall', 'MakeUpArtist', 'Decoration tent house',
    'Lightings', 'Catering', 'Mehandi', 'DJ band',
    'PhotoGraphy/video', 'Cooking master'
  ];

  Future<void> _pickImages() async {
    final pickedFiles = await _picker.pickMultiImage();
    if (pickedFiles.isNotEmpty) {
      setState(() {
        _serviceImages.addAll(pickedFiles);
      });
    }
  }

  void _submitForm() async {
    if (_formKey.currentState!.validate()) {
      if (_selectedServices.isEmpty) {
        _showSnackBar('Please select at least one service.', Colors.red);
        return;
      }
      if (_serviceImages.isEmpty) {
        _showSnackBar('Please upload at least one image.', Colors.red);
        return;
      }

      setState(() => _isLoading = true);
      
      final request = VendorRegistrationRequest(
        personName: _personNameCtrl.text.trim(),
        email: _emailCtrl.text.trim(),
        phoneNumber: _phoneCtrl.text.trim(),
        companyName: _companyNameCtrl.text.trim(),
        password: _passwordCtrl.text,
        street: _streetCtrl.text.trim(),
        city: _cityCtrl.text.trim(),
        mandal: _mandalCtrl.text.trim(),
        district: _districtCtrl.text.trim(),
        state: _stateCtrl.text.trim(),
        pincode: _pincodeCtrl.text.trim(),
        servicesProvided: _selectedServices,
        instagram: _instagramCtrl.text.trim(),
        facebook: _facebookCtrl.text.trim(),
        youtube: _youtubeCtrl.text.trim(),
        whatsapp: _whatsappCtrl.text.trim(),
        serviceImages: _serviceImages,
      );

      try {
        final success = await _apiService.registerVendor(request);
        if (success) {
          _showSnackBar('Registration Successful!', AppColors.primary);
        }
      } catch (e) {
        _showSnackBar(e.toString(), Colors.red);
      } finally {
        setState(() => _isLoading = false);
      }
    }
  }

  void _showSnackBar(String message, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: color),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Basic Info
          _buildSectionTitle('Basic Information'),
          CustomTextField(labelText: 'Full Name', hintText: 'Enter your name', controller: _personNameCtrl,),
          CustomTextField(labelText: 'Email Address', hintText: 'vendor@example.com', controller: _emailCtrl, keyboardType: TextInputType.emailAddress,),
          CustomTextField(labelText: 'Phone Number', hintText: '10 digit phone number', controller: _phoneCtrl, keyboardType: TextInputType.phone,),
          CustomTextField(labelText: 'Company Name', hintText: 'Business name', controller: _companyNameCtrl,),
          CustomTextField(labelText: 'Password', hintText: 'Create strong password', controller: _passwordCtrl, isPassword: true,),
          
          const SizedBox(height: 16),
          // 2. Address
          _buildSectionTitle('Address Details'),
          CustomTextField(labelText: 'Street/Locality', hintText: 'Enter street', controller: _streetCtrl,),
          Row(
            children: [
              Expanded(child: CustomTextField(labelText: 'City', hintText: 'City', controller: _cityCtrl,)),
              const SizedBox(width: 16),
              Expanded(child: CustomTextField(labelText: 'Mandal', hintText: 'Mandal', controller: _mandalCtrl,)),
            ],
          ),
          Row(
            children: [
              Expanded(child: CustomTextField(labelText: 'District', hintText: 'District', controller: _districtCtrl,)),
              const SizedBox(width: 16),
              Expanded(child: CustomTextField(labelText: 'State', hintText: 'State', controller: _stateCtrl,)),
            ],
          ),
          CustomTextField(labelText: 'Pincode', hintText: '6-digit code', controller: _pincodeCtrl, keyboardType: TextInputType.number,),

          const SizedBox(height: 16),
          // 3. Services (Checkbox Array)
          _buildSectionTitle('Services Provided'),
          Wrap(
            spacing: 8,
            children: _availableServices.map((service) {
              final isSelected = _selectedServices.contains(service);
              return FilterChip(
                label: Text(service, style: TextStyle(color: isSelected ? AppColors.white : AppColors.textDark)),
                selected: isSelected,
                selectedColor: AppColors.primary,
                checkmarkColor: AppColors.white,
                onSelected: (selected) {
                  setState(() {
                    if (selected) _selectedServices.add(service);
                    else _selectedServices.remove(service);
                  });
                },
              );
            }).toList(),
          ),

          const SizedBox(height: 16),
          // 4. Social Links
          _buildSectionTitle('Social Links (Optional)'),
          CustomTextField(labelText: 'Instagram', hintText: 'Link or handle', controller: _instagramCtrl,),
          CustomTextField(labelText: 'Facebook', hintText: 'Link or handle', controller: _facebookCtrl,),
          CustomTextField(labelText: 'YouTube', hintText: 'Link or handle', controller: _youtubeCtrl,),
          CustomTextField(labelText: 'WhatsApp', hintText: 'WhatsApp number', controller: _whatsappCtrl,),

          const SizedBox(height: 16),
          // 5. Image Upload
          _buildSectionTitle('Service Images'),
          Text('${_serviceImages.length} images selected', style: const TextStyle(color: AppColors.textDark)),
          const SizedBox(height: 8),
          OutlinedButton.icon(
            onPressed: _pickImages,
            icon: const Icon(Icons.add_photo_alternate, color: AppColors.primary),
            label: const Text('Add Images', style: TextStyle(color: AppColors.primary)),
          ),

          const SizedBox(height: 32),
          CustomButton(text: 'Register as Vendor', onPressed: _submitForm, isLoading: _isLoading,),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(top: 16, bottom: 8),
      child: Text(
        title,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primary),
      ),
    );
  }
}
