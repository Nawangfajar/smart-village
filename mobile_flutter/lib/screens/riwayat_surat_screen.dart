import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'surat_detail_screen.dart';

class RiwayatSuratScreen extends StatefulWidget {
  final int userId;

  const RiwayatSuratScreen({
    super.key,
    required this.userId,
  });

  @override
  State<RiwayatSuratScreen> createState() => _RiwayatSuratScreenState();
}

class _RiwayatSuratScreenState extends State<RiwayatSuratScreen> {
  bool _isLoading = true;
  List<dynamic> _suratList = [];

  final storage = const FlutterSecureStorage();
  final String baseUrl = 'http://192.168.0.105:3000';

  @override
  void initState() {
    super.initState();
    _fetchSurat();
  }

  // ================= FETCH DATA =================
  Future<void> _fetchSurat() async {
    final url = '$baseUrl/api/surat/domisili/user';

    try {
      String? token = await storage.read(key: 'token');

      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      print("RESPONSE: ${response.body}");

      if (response.statusCode == 200) {
        final decoded = json.decode(response.body);

        List<dynamic> data = [];

        // 🔥 HANDLE SEMUA FORMAT RESPONSE
        if (decoded is List) {
          data = decoded;
        } else if (decoded is Map && decoded['data'] is List) {
          data = decoded['data'];
        }

        setState(() {
          _suratList = data;
          _isLoading = false;
        });
      } else {
        _showError(
            'Gagal mengambil data surat (Status ${response.statusCode})');
      }
    } catch (e) {
      _showError('Terjadi kesalahan: $e');
    }
  }

  void _showError(String msg) {
    setState(() => _isLoading = false);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg)),
    );
  }

  // ================= STATUS / AKSI =================
  Widget _buildTrailing(Map<String, dynamic> surat) {
    final status = surat['status'] ?? 'Pending';
    final int suratId = surat['id'];

    // ===== JIKA DITERIMA → BUKA DETAIL =====
    if (status == 'Diterima') {
      return IconButton(
        icon: const Icon(Icons.download, color: Colors.green),
        tooltip: 'Lihat & Download Surat',
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => SuratDetailScreen(
                suratId: suratId,
              ),
            ),
          );
        },
      );
    }

    // ===== STATUS TEXT =====
    Color color;
    if (status == 'Ditolak') {
      color = Colors.red;
    } else {
      color = Colors.orange;
    }

    return Text(
      status,
      style: TextStyle(
        color: color,
        fontWeight: FontWeight.bold,
      ),
    );
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
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
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
                        "Riwayat Surat Domisili",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
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
            child: _isLoading
                ? const Center(
                    child:
                        CircularProgressIndicator(color: Colors.blue),
                  )
                : _suratList.isEmpty
                    ? const Center(
                        child: Text(
                          'Belum ada surat domisili.',
                          style: TextStyle(fontSize: 16),
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _fetchSurat,
                        child: ListView.builder(
                          physics:
                              const AlwaysScrollableScrollPhysics(),
                          itemCount: _suratList.length,
                          itemBuilder: (context, index) {
                            final surat =
                                _suratList[index] as Map<String, dynamic>;

                            final nomorSurat =
                                surat['nomor_surat'] ?? '-';
                            final tanggalSurat =
                                surat['tanggal_surat'] ?? '-';

                            return Card(
                              margin: const EdgeInsets.symmetric(
                                  vertical: 6, horizontal: 12),
                              elevation: 3,
                              shape: RoundedRectangleBorder(
                                borderRadius:
                                    BorderRadius.circular(10),
                              ),
                              child: ListTile(
                                title: Text(
                                  'Nomor Surat: $nomorSurat',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.w600),
                                ),
                                subtitle:
                                    Text('Tanggal: $tanggalSurat'),
                                trailing:
                                    _buildTrailing(surat),
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}