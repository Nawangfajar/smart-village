import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../models/pengaduan_model.dart';

class AuthService {
  final FlutterSecureStorage storage = const FlutterSecureStorage();

  /// ================= BASE URL =================
  final String baseAuthUrl = 'http://192.168.0.105:3000/api/auth';
  final String basePengaduanUrl = 'http://192.168.0.105:3000/api/pengaduan';

  /// ================================
  /// REGISTER USER
  /// ================================
  Future<String?> register(String name, String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseAuthUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201) {
        return null;
      } else {
        return data['message'] ?? 'Registrasi gagal';
      }
    } catch (e) {
      return 'Terjadi kesalahan saat registrasi';
    }
  }

  /// ================================
  /// LOGIN USER
  /// ================================
  Future<int?> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseAuthUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        final token = data['token'];
        final user = data['user'];

        if (token != null && user != null) {
          await storage.write(key: 'token', value: token);
          await storage.write(
              key: 'login_at',
              value: DateTime.now().toIso8601String());

          await storage.write(key: 'name', value: user['name']);
          await storage.write(key: 'email', value: user['email']);
          await storage.write(
              key: 'userId', value: user['id'].toString());

          return user['id'];
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /// ================================
  /// SIMPAN FCM TOKEN
  /// ================================
  Future<void> saveFcmToken(int userId, String token) async {
    try {
      await http.post(
        Uri.parse('$baseAuthUrl/save-fcm-token'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'user_id': userId,
          'fcm_token': token,
        }),
      );
    } catch (e) {
      print('Error save FCM token: $e');
    }
  }

  /// ================================
  /// AMBIL DETAIL PENGADUAN (UNTUK NOTIF)
  /// ================================
  Future<Pengaduan> getPengaduanById(int id) async {
    final response = await http.get(
      Uri.parse('$basePengaduanUrl/$id'),
    );

    if (response.statusCode == 200) {
      return Pengaduan.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Gagal mengambil detail pengaduan');
    }
  }

  /// ================================
  /// LOGOUT
  /// ================================
  Future<void> logout() async {
    await storage.deleteAll();
  }

  /// ================================
  /// CEK LOGIN
  /// ================================
  Future<bool> isLoggedIn() async {
    final token = await storage.read(key: 'token');
    final loginAtStr = await storage.read(key: 'login_at');

    if (token == null || loginAtStr == null) return false;

    final loginAt = DateTime.tryParse(loginAtStr);
    if (loginAt == null) return false;

    final now = DateTime.now();
    final duration = now.difference(loginAt);

    return duration.inDays < 14;
  }

  /// ================================
  /// AMBIL TOKEN
  /// ================================
  Future<String?> getToken() async {
    return await storage.read(key: 'token');
  }

  /// ================================
  /// AMBIL DATA USER
  /// ================================
  Future<Map<String, String?>> getUserInfo() async {
    final userId = await storage.read(key: 'userId');
    final name = await storage.read(key: 'name');
    final email = await storage.read(key: 'email');
    return {'userId': userId, 'name': name, 'email': email};
  }
}
