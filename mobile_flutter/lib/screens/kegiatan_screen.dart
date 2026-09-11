import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart';

// Model Kegiatan
class Kegiatan {
  final int id;
  final String foto;
  final String namaKegiatan;
  final String lokasi;
  final String tanggal;
  final String waktu;

  Kegiatan({
    required this.id,
    required this.foto,
    required this.namaKegiatan,
    required this.lokasi,
    required this.tanggal,
    required this.waktu,
  });

  factory Kegiatan.fromJson(Map<String, dynamic> json) {
    return Kegiatan(
      id: json['id'],
      foto: json['foto'] ?? '',
      namaKegiatan: json['nama_kegiatan'] ?? '',
      lokasi: json['lokasi'] ?? '',
      tanggal: json['tanggal'] ?? '',
      waktu: json['waktu'] ?? '',
    );
  }
}

class KegiatanScreen extends StatefulWidget {
  @override
  _KegiatanScreenState createState() => _KegiatanScreenState();
}

class _KegiatanScreenState extends State<KegiatanScreen> {
  List<Kegiatan> kegiatans = [];

  Future<void> fetchKegiatan() async {
    final response = await http.get(
      Uri.parse('http://192.168.0.105:3000/api/kegiatan'),
    );

    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      setState(() {
        kegiatans = data.map((item) => Kegiatan.fromJson(item)).toList();
      });
    } else {
      throw Exception('Gagal memuat data kegiatan');
    }
  }

  String formatTanggal(String isoDate) {
    try {
      final date = DateTime.parse(isoDate);
      return DateFormat('yyyy-MM-dd').format(date);
    } catch (e) {
      return isoDate;
    }
  }

  @override
  void initState() {
    super.initState();
    fetchKegiatan();
  }

 @override
Widget build(BuildContext context) {
  return Scaffold(
    backgroundColor: Colors.grey.shade100,
    body: Column(
      children: [
        // ===== CUSTOM HEADER =====
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
                  icon: const Icon(Icons.arrow_back, color: Colors.white),
                  onPressed: () => Navigator.pop(context),
                ),
                const Expanded(
                  child: Center(
                    child: Text(
                      "Informasi Kegiatan",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.refresh, color: Colors.white),
                  onPressed: fetchKegiatan,
                )
              ],
            ),
          ),
        ),

        // ===== BODY =====
        Expanded(
          child: kegiatans.isEmpty
              ? const Center(child: CircularProgressIndicator(color: Colors.blue))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: kegiatans.length,
                  itemBuilder: (context, index) {
                    final kegiatan = kegiatans[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.shade300,
                            blurRadius: 6,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius:
                                const BorderRadius.vertical(top: Radius.circular(16)),
                            child: Container(
                              width: double.infinity,
                              height: 200,
                              color: Colors.grey[200],
                              child: Image.network(
                                'http://192.168.0.105:3000/uploads/kegiatan/${kegiatan.foto}',
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(
                                  color: Colors.grey[300],
                                  alignment: Alignment.center,
                                  child: Icon(Icons.image_not_supported,
                                      size: 48, color: Colors.grey[600]),
                                ),
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16.0, vertical: 12.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  kegiatan.namaKegiatan,
                                  style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black87),
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    Icon(Icons.calendar_today,
                                        size: 16, color: Colors.grey[700]),
                                    const SizedBox(width: 8),
                                    Text(
                                      '${formatTanggal(kegiatan.tanggal)} | ${kegiatan.waktu}',
                                      style:
                                          TextStyle(color: Colors.grey[700]),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Icon(Icons.location_on,
                                        size: 16, color: Colors.grey[700]),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        kegiatan.lokasi,
                                        style:
                                            TextStyle(color: Colors.grey[700]),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
        )
      ],
    ),
  );
}
}