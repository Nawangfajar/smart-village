import 'package:flutter/material.dart';
import '../models/pengaduan_model.dart';

class DetailPengaduanScreen extends StatelessWidget {
  final Pengaduan pengaduan;
  const DetailPengaduanScreen({required this.pengaduan, Key? key})
      : super(key: key);

  Color getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'dikirim':
        return Colors.blue;
      case 'diproses':
        return Colors.orange;
      case 'selesai':
        return Colors.green;
      case 'ditolak':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F6FA),
      appBar: AppBar(
        backgroundColor: Colors.blue,
        elevation: 3,
        centerTitle: true,
        title: const Text(
          'Detail Pengaduan',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
        ),
      ),

      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ---------- FOTO ----------
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  offset: const Offset(0, 2),
                  blurRadius: 8,
                  color: Colors.black.withOpacity(0.1),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: pengaduan.foto != null && pengaduan.foto!.isNotEmpty
                  ? Image.network(
                      'http://192.168.0.105:3000/uploads/${pengaduan.foto}',
                      height: 240,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    )
                  : Container(
                      height: 240,
                      color: Colors.grey[300],
                      child: const Icon(Icons.image_not_supported,
                          size: 100, color: Colors.grey),
                    ),
            ),
          ),

          const SizedBox(height: 20),

          // ---------- DETAIL ----------
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  offset: const Offset(0, 3),
                  blurRadius: 10,
                  color: Colors.black.withOpacity(0.08),
                ),
              ],
            ),

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Judul
                const Text(
                  'Judul Pengaduan',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  pengaduan.judul,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),

                const Divider(height: 25),

                // Isi
                const Text(
                  'Isi Pengaduan',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  pengaduan.isi,
                  style: const TextStyle(fontSize: 16, height: 1.4),
                ),

                const Divider(height: 25),

                // Status
                const Text(
                  'Status',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 6),
                Container(
                  padding:
                      const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
                  decoration: BoxDecoration(
                    color: getStatusColor(pengaduan.status).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    pengaduan.status ?? '-',
                    style: TextStyle(
                      color: getStatusColor(pengaduan.status),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),

                const SizedBox(height: 18),

                // Tanggal
                const Text(
                  'Tanggal Pengaduan',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  pengaduan.createdAt != null
                      ? '${pengaduan.createdAt?.day}/${pengaduan.createdAt?.month}/${pengaduan.createdAt?.year}'
                      : '-',
                  style: const TextStyle(fontSize: 16),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
