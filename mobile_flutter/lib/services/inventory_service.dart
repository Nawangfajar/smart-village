import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

class InventoryService {
  // GANTI sesuai domain / IP backend kamu
  final String baseUrl = 'http://192.168.0.105:3000/api';

  /* ================= INVENTORI ================= */

  Future<List<dynamic>> getInventories({String? tipe}) async {
    final uri = tipe == null
        ? Uri.parse('$baseUrl/inventory')
        : Uri.parse('$baseUrl/inventory?tipe=$tipe');

    final resp = await http.get(uri);
    if (resp.statusCode == 200) {
      return json.decode(resp.body) as List<dynamic>;
    }
    throw Exception('Gagal load inventori');
  }

  /* ================= STATUS PINJAMAN ================= */

  Future<Map<String, dynamic>> getActiveLoan(
      int inventoryId, int userId) async {
    final resp = await http.get(
      Uri.parse('$baseUrl/inventory/$inventoryId/active-loan/$userId'),
    );

    if (resp.statusCode == 200) {
      return Map<String, dynamic>.from(json.decode(resp.body));
    }

    return {'isBorrowing': false};
  }

  /* ================= PINJAM (FIXED) ================= */

  Future<bool> borrowItem(
    int inventoryId,
    int userId,
    int jumlah,
    DateTime sampaiTanggal,
  ) async {
    final resp = await http.post(
      Uri.parse('$baseUrl/inventory/$inventoryId/borrow'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'userId': userId,
        'jumlah_pinjam': jumlah,
        'tanggal_sampai': DateFormat('yyyy-MM-dd').format(sampaiTanggal),
      }),
    );

    return resp.statusCode == 200 || resp.statusCode == 201;
  }

  /* ================= KEMBALIKAN ================= */

  Future<bool> returnItem(int inventoryId, int userId) async {
    final resp = await http.post(
      Uri.parse('$baseUrl/inventory/$inventoryId/return'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'userId': userId}),
    );

    return resp.statusCode == 200;
  }
}
