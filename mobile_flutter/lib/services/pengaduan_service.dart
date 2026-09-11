import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/pengaduan_model.dart'; 

class PengaduanService {
  final String baseUrl = 'http://192.168.0.105:3000'; // Sesuaikan dengan IP yang benar

  Future<List<Pengaduan>> getPengaduanByUserId(int userId) async {
    try {
      // Pastikan endpoint sudah sesuai dengan API
      final response = await http.get(Uri.parse('$baseUrl/api/pengaduan/riwayat/$userId'));

      // Log respons untuk debug
      print('Response Status: ${response.statusCode}');
      print('Response Body: ${response.body}');

      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        return data.map((e) => Pengaduan.fromJson(e)).toList();
      } else {
        throw Exception('Gagal mengambil pengaduan: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Terjadi kesalahan: $e');
    }
  }
}

