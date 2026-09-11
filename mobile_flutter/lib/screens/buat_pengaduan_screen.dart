import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;

class BuatPengaduanScreen extends StatefulWidget {
  final int userId;
  const BuatPengaduanScreen({
    required this.userId,
    Key? key,
  }) : super(key: key);

  @override
  State<BuatPengaduanScreen> createState() => _BuatPengaduanScreenState();
}

class _BuatPengaduanScreenState extends State<BuatPengaduanScreen> {
  final _formKey = GlobalKey<FormState>();

  final _judulController = TextEditingController();
  final _isiController = TextEditingController();
  final _latitudeController = TextEditingController();
  final _longitudeController = TextEditingController();

  File? _selectedImage;
  bool _isLoading = false;

  // ================= PICK IMAGE =================
  Future<void> _pickImage() async {
    final picked =
        await ImagePicker().pickImage(source: ImageSource.gallery);

    if (picked != null) {
      setState(() => _selectedImage = File(picked.path));
    }
  }

  // ================= KIRIM PENGADUAN =================
  Future<void> _kirimPengaduan() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final uri = Uri.parse('http://192.168.0.105:3000/api/pengaduan');
    final request = http.MultipartRequest('POST', uri);

    request.fields['user_id'] = widget.userId.toString();
    request.fields['judul'] = _judulController.text;
    request.fields['isi'] = _isiController.text;
    request.fields['latitude'] = _latitudeController.text;
    request.fields['longitude'] = _longitudeController.text;

    if (_selectedImage != null) {
      request.files.add(
        await http.MultipartFile.fromPath(
          'foto',
          _selectedImage!.path,
        ),
      );
    }

    final response = await request.send();
    setState(() => _isLoading = false);

    if (response.statusCode == 201) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✅ Pengaduan berhasil dikirim'),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('❌ Gagal mengirim pengaduan'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  // ================= UI =================
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      body: Column(
        children: [
          // ===== HEADER =====
          Container(
            padding: const EdgeInsets.only(bottom: 10),
            decoration: BoxDecoration(
              color: Colors.blue.shade700,
              borderRadius: const BorderRadius.vertical(
                bottom: Radius.circular(20),
              ),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  IconButton(
                    icon:
                        const Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                  ),
                  const Expanded(
                    child: Center(
                      child: Text(
                        "Buat Pengaduan",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
          ),

          // ===== BODY =====
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    // ===== JUDUL =====
                    TextFormField(
                      controller: _judulController,
                      decoration: const InputDecoration(
                        labelText: 'Judul Pengaduan',
                        prefixIcon: Icon(Icons.title),
                      ),
                      validator: (v) =>
                          v == null || v.isEmpty
                              ? 'Judul wajib diisi'
                              : null,
                    ),

                    const SizedBox(height: 16),

                    // ===== ISI =====
                    TextFormField(
                      controller: _isiController,
                      maxLines: 5,
                      decoration: const InputDecoration(
                        labelText: 'Isi Pengaduan',
                        prefixIcon: Icon(Icons.description),
                      ),
                      validator: (v) =>
                          v == null || v.isEmpty
                              ? 'Isi wajib diisi'
                              : null,
                    ),

                    const SizedBox(height: 16),

                    // ===== LATITUDE =====
                    TextFormField(
                      controller: _latitudeController,
                      keyboardType: const TextInputType.numberWithOptions(
                        decimal: true,
                        signed: true,
                      ),
                      decoration: const InputDecoration(
                        labelText: 'Latitude',
                        hintText: 'Contoh: -7.803249',
                        prefixIcon: Icon(Icons.my_location),
                      ),
                      validator: (v) {
                        if (v == null || v.isEmpty) {
                          return 'Latitude wajib diisi';
                        }
                        if (double.tryParse(v) == null) {
                          return 'Latitude harus angka';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 16),

                    // ===== LONGITUDE =====
                    TextFormField(
                      controller: _longitudeController,
                      keyboardType: const TextInputType.numberWithOptions(
                        decimal: true,
                        signed: true,
                      ),
                      decoration: const InputDecoration(
                        labelText: 'Longitude',
                        hintText: 'Contoh: 110.321845',
                        prefixIcon: Icon(Icons.location_on),
                      ),
                      validator: (v) {
                        if (v == null || v.isEmpty) {
                          return 'Longitude wajib diisi';
                        }
                        if (double.tryParse(v) == null) {
                          return 'Longitude harus angka';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 16),

                    // ===== FOTO =====
                    GestureDetector(
                      onTap: _pickImage,
                      child: Container(
                        height: 160,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey),
                          image: _selectedImage != null
                              ? DecorationImage(
                                  image:
                                      FileImage(_selectedImage!),
                                  fit: BoxFit.cover,
                                )
                              : null,
                        ),
                        child: _selectedImage == null
                            ? const Center(
                                child: Text(
                                  'Ketuk untuk pilih foto',
                                  style: TextStyle(color: Colors.grey),
                                ),
                              )
                            : null,
                      ),
                    ),

                    const SizedBox(height: 30),

                    // ===== BUTTON =====
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.send),
                        label: Text(
                          _isLoading
                              ? 'Mengirim...'
                              : 'Kirim Pengaduan',
                        ),
                        onPressed:
                            _isLoading ? null : _kirimPengaduan,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
