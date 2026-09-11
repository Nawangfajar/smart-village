import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class SuratService {
  // Ganti URL ini sesuai server kamu
  final String baseUrl = 'http://192.168.0.105:3000/api/surat'; // Untuk emulator Android
  // Jika pakai device fisik, ubah ke IP laptop, misal:
  // final String baseUrl = 'http://192.168.110.114:3000/api/surat';

  Future<bool> buatSuratDomisili(Map<String, dynamic> data) async {
    try {
      // Ambil token dari FlutterSecureStorage
      final storage = FlutterSecureStorage();
      String? token = await storage.read(key: 'token');  // Ambil token yang telah disimpan

      if (token == null) {
        throw Exception('Token tidak ditemukan');  // Jika token tidak ditemukan
      }

      // Mengirim request POST dengan header Authorization
      final response = await http.post(
        Uri.parse('$baseUrl/domisili'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token', // Menambahkan token di header
        },
        body: jsonEncode(data),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;  // Pengiriman berhasil
      } else {
        print('❌ Server Error: ${response.statusCode}');
        print('Response Body: ${response.body}');
        return false;  // Gagal mengirim
      }
    } catch (e) {
      print('⚠️ Exception: $e');
      return false;  // Jika ada error
    }
  }

  // Fungsi untuk mendapatkan link file PDF dari server
  Future<String> getFilePath(int suratId) async {
    final storage = FlutterSecureStorage();
    String? token = await storage.read(key: 'token');

    final response = await http.get(
      Uri.parse('$baseUrl/domisili/$suratId/download'),
      headers: {
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      var data = jsonDecode(response.body);
      return data['filePath'];  // Mengembalikan filePath dari response
    } else {
      throw Exception('Gagal mendapatkan file PDF');
    }
  }
}