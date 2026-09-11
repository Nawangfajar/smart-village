import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:open_filex/open_filex.dart';
import 'package:path_provider/path_provider.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SuratDetailScreen extends StatefulWidget {
  final int suratId;

  const SuratDetailScreen({
    super.key,
    required this.suratId,
  });

  @override
  State<SuratDetailScreen> createState() => _SuratDetailScreenState();
}

class _SuratDetailScreenState extends State<SuratDetailScreen> {
  bool _isLoading = true;
  bool _downloading = false;

  String nomorSurat = '-';
  String tanggalSurat = '-';
  String status = '-';
  String downloadLink = '';

  final storage = const FlutterSecureStorage();
  final String baseUrl = 'http://192.168.0.105:3000';

  @override
  void initState() {
    super.initState();
    _fetchSuratDetail();
  }

  // ================= FETCH =================
  Future<void> _fetchSuratDetail() async {
    try {
      String? token = await storage.read(key: 'token');

      if (token == null) {
        throw 'Token tidak ditemukan';
      }

      final res = await http.get(
        Uri.parse('$baseUrl/api/surat/domisili/${widget.suratId}'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      print("DETAIL RESPONSE: ${res.body}");

      if (res.statusCode != 200) {
        throw 'Gagal mengambil detail surat (${res.statusCode})';
      }

      final decoded = jsonDecode(res.body);

      Map<String, dynamic>? data;

      // 🔥 HANDLE SEMUA FORMAT RESPONSE + FIX TYPE
      if (decoded is Map && decoded['data'] is Map) {
        data = Map<String, dynamic>.from(decoded['data']);
      } else if (decoded is Map) {
        data = Map<String, dynamic>.from(decoded);
      }

      if (data == null) throw 'Format data tidak valid';

      final d = data; // 🔥 FIX NULL SAFETY

      setState(() {
        nomorSurat = d['nomor_surat'] ?? '-';
        tanggalSurat = d['tanggal_surat'] ?? '-';
        status = d['status'] ?? '-';
        downloadLink = d['filePath'] != null
            ? '$baseUrl${d['filePath']}'
            : '';
        _isLoading = false;
      });
    } catch (e) {
      _isLoading = false;
      debugPrint('❌ Error fetch surat: $e');
    }
  }

  // ================= DOWNLOAD =================
  Future<void> _downloadPDF() async {
    if (downloadLink.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('❌ File surat belum tersedia'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() => _downloading = true);

    try {
      String? token = await storage.read(key: 'token');

      if (token == null) throw 'Token tidak ditemukan';

      final response = await http.get(
        Uri.parse(downloadLink),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode != 200) {
        throw 'Download gagal (${response.statusCode})';
      }

      final dir = await getApplicationDocumentsDirectory();

      final safeNomor =
          nomorSurat.replaceAll(RegExp(r'[\\/:"*?<>|]'), '-');

      final file =
          File('${dir.path}/surat_domisili_$safeNomor.pdf');

      await file.writeAsBytes(response.bodyBytes);
      await OpenFilex.open(file.path);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✅ Surat berhasil dibuka'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('❌ Gagal membuka surat: $e'),
          backgroundColor: Colors.redAccent,
        ),
      );
    } finally {
      setState(() => _downloading = false);
    }
  }

  // ================= UI =================
  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      body: Column(
        children: [
          // HEADER
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
                        "Detail Surat Domisili",
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

          // BODY
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Card(
                    elevation: 4,
                    shadowColor: Colors.blue.shade100,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.description_rounded,
                                  color: Colors.blue.shade700,
                                  size: 36),
                              const SizedBox(width: 10),
                              Text(
                                "Hasil Surat Domisili",
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.blue.shade700,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          _infoRow("Nomor Surat", nomorSurat),
                          const SizedBox(height: 8),
                          _infoRow("Tanggal Surat", tanggalSurat),
                          const SizedBox(height: 8),
                          _infoRow("Status", status),
                          const Divider(height: 30),
                          Text(
                            "Surat domisili Anda sudah tersedia dan siap untuk diunduh dalam format PDF.",
                            style: TextStyle(
                              fontSize: 15,
                              color: Colors.grey.shade700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 30),

                  ElevatedButton.icon(
                    onPressed: _downloading ? null : _downloadPDF,
                    icon: _downloading
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2,
                            ),
                          )
                        : const Icon(Icons.download_rounded,
                            color: Colors.white),
                    label: Text(
                      _downloading
                          ? 'Mendownload...'
                          : 'Download & Buka Surat Domisili',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue.shade700,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 24, vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 4,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ================= UI HELPER =================
  Widget _infoRow(String title, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title,
            style:
                const TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
        Flexible(
          child: Text(value,
              textAlign: TextAlign.right,
              style: const TextStyle(
                  fontSize: 16, fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}