import 'package:flutter/material.dart';
import '../models/pengaduan_model.dart';
import '../services/pengaduan_service.dart';
import 'detail_pengaduan_screen.dart';

class RiwayatPengaduanScreen extends StatefulWidget {
  final int userId;
  const RiwayatPengaduanScreen({required this.userId, Key? key}) : super(key: key);

  @override
  State<RiwayatPengaduanScreen> createState() => _RiwayatPengaduanScreenState();
}

class _RiwayatPengaduanScreenState extends State<RiwayatPengaduanScreen> {
  late Future<List<Pengaduan>> _futurePengaduan;
  String selectedFilter = "Semua";

  @override
  void initState() {
    super.initState();
    _futurePengaduan = PengaduanService().getPengaduanByUserId(widget.userId);
  }

  Color getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'dikirim':
        return Colors.blueAccent;
      case 'diproses':
        return Colors.orangeAccent;
      case 'selesai':
        return Colors.green;
      case 'ditolak':
        return Colors.redAccent;
      default:
        return Colors.grey;
    }
  }

  final List<String> filters = ["Semua", "Dikirim", "Diproses", "Selesai", "Ditolak"];

  @override
  Widget build(BuildContext context) {
    final primaryColor = Colors.blue.shade900;

    return Scaffold(
  backgroundColor: Colors.grey.shade100,
  body: Column(
    children: [
      // ✅ HEADER CUSTOM
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
                    "Riwayat Pengaduan",
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

      // ✅ ROW TOMBOL FILTER
      Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: filters.map((f) {
              bool active = selectedFilter == f;

              return GestureDetector(
                onTap: () => setState(() => selectedFilter = f),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 180),
                  margin: const EdgeInsets.symmetric(horizontal: 6),
                  padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 18),
                  decoration: BoxDecoration(
                    color: active ? Colors.blue.shade700 : Colors.white,
                    borderRadius: BorderRadius.circular(30),
                    border: Border.all(color: Colors.blue.shade700, width: 1.5),
                    boxShadow: active
                        ? [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.12),
                              blurRadius: 6,
                              offset: const Offset(0, 3),
                            )
                          ]
                        : [],
                  ),
                  child: Text(
                    f,
                    style: TextStyle(
                      color: active ? Colors.white : Colors.blue.shade700,
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ),

      // ✅ LIST DATA
      Expanded(
        child: FutureBuilder<List<Pengaduan>>(
          future: _futurePengaduan,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: CircularProgressIndicator(color: Colors.blueAccent),
              );
            } else if (snapshot.hasError) {
              return Center(
                child: Text(
                  'Terjadi kesalahan: ${snapshot.error}',
                  style: const TextStyle(color: Colors.redAccent),
                ),
              );
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(
                child: Text(
                  'Belum ada pengaduan.',
                  style: TextStyle(fontSize: 16, color: Colors.black54),
                ),
              );
            }

            final pengaduanFiltered = snapshot.data!.where((p) {
              if (selectedFilter == "Semua") return true;
              return p.status?.toLowerCase() == selectedFilter.toLowerCase();
            }).toList();

            if (pengaduanFiltered.isEmpty) {
              return const Center(
                child: Text('Tidak ada data pada kategori ini'),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              itemCount: pengaduanFiltered.length,
              itemBuilder: (context, index) {
                final p = pengaduanFiltered[index];

                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => DetailPengaduanScreen(pengaduan: p),
                      ),
                    );
                  },
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.08),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.all(12),
                      leading: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: p.foto != null && p.foto!.isNotEmpty
                            ? Image.network(
                                'http://192.168.0.105:3000/uploads/${p.foto}',
                                width: 60,
                                height: 60,
                                fit: BoxFit.cover,
                              )
                            : Container(
                                width: 60,
                                height: 60,
                                color: Colors.grey.shade200,
                                child: const Icon(
                                  Icons.image_not_supported,
                                  size: 32,
                                  color: Colors.grey,
                                ),
                              ),
                      ),
                      title: Text(
                        p.judul ?? '(Tanpa Judul)',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.black87,
                        ),
                      ),
                      subtitle: Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: getStatusColor(p.status).withOpacity(0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                p.status ?? '-',
                                style: TextStyle(
                                  color: getStatusColor(p.status),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            Text(
                              p.createdAt != null
                                  ? '${p.createdAt?.day}/${p.createdAt?.month}/${p.createdAt?.year}'
                                  : '',
                              style: const TextStyle(fontSize: 12, color: Colors.black54),
                            ),
                          ],
                        ),
                      ),
                      trailing: const Icon(
                        Icons.arrow_forward_ios_rounded,
                        size: 18,
                        color: Colors.black38,
                      ),
                    ),
                  ),
                );
              },
            );
          },
        ),
      ),
    ],
  ),
);
  }
  }