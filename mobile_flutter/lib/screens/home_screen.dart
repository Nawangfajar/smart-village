import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';

import 'buat_pengaduan_screen.dart';
import 'riwayat_pengaduan_screen.dart';
import 'login_screen.dart';
import 'inventory_screen.dart';
import 'kegiatan_screen.dart';
import 'input_surat_domisili_screen.dart';
import 'riwayat_surat_screen.dart';

class DashboardScreen extends StatelessWidget {
  final int userId;
  final String name;
  final String email;

  const DashboardScreen({
    Key? key,
    required this.userId,
    required this.name,
    required this.email,
  }) : super(key: key);

  // Logout
  Future<void> _logout(BuildContext context) async {
    const storage = FlutterSecureStorage();
    await storage.deleteAll();
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (_) => LoginScreen()),
      (route) => false,
    );
  }

  // Navigasi Pengaduan
  void _navigateToPengaduan(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.add),
              title: const Text('Buat Pengaduan'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => BuatPengaduanScreen(userId: userId),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.history),
              title: const Text('Riwayat Pengaduan'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => RiwayatPengaduanScreen(userId: userId),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  // Navigasi Surat Domisili
  void _navigateToSuratDomisili(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.add),
              title: const Text('Buat Surat Domisili'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) =>
                        InputSuratDomisiliScreen(userId: userId),
                  ),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.history),
              title: const Text('Riwayat Surat Domisili'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) =>
                        RiwayatSuratScreen(userId: userId),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  // Navigasi Inventaris
  void _navigateToInventaris(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => InventoryScreen()),
    );
  }

  // Navigasi Kegiatan
  void _navigateToKegiatan(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => KegiatanScreen()),
    );
  }

  // Format tanggal
  String _getFormattedDate() {
    final now = DateTime.now();
    return DateFormat('EEEE, d MMMM yyyy', 'id_ID').format(now);
  }

  @override
  Widget build(BuildContext context) {
    final formattedDate = _getFormattedDate();

    return Scaffold(
      backgroundColor: const Color(0xFFF7F7FA),
      body: SafeArea(
        child: Column(
          children: [
            // ===== HEADER =====
            Container(
              padding: const EdgeInsets.fromLTRB(20, 25, 20, 30),
              width: double.infinity,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Color(0xFF4A6CF7),
                    Color(0xFF6C5CE7),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(26),
                  bottomRight: Radius.circular(26),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Baris atas
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Dashboard",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.logout,
                            color: Colors.white, size: 26),
                        onPressed: () => _logout(context),
                      ),
                    ],
                  ),

                  const SizedBox(height: 18),

                  Row(
                    children: [
                      CircleAvatar(
                        radius: 33,
                        backgroundColor: Colors.white,
                        child: Icon(Icons.person,
                            color: Colors.blue[600], size: 40),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Selamat datang,",
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 15,
                              ),
                            ),
                            Text(
                              name,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 22,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // ================== SECTION MENU ==================
            Expanded(
              child: Column(
                children: [
                  // ===== CARD WAKTU =====
                  Container(
                    margin: const EdgeInsets.fromLTRB(18, 18, 18, 6),
                    padding: const EdgeInsets.symmetric(
                        vertical: 14, horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 6,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.calendar_today,
                            size: 20, color: Colors.blueAccent),
                        const SizedBox(width: 10),
                        Text(
                          formattedDate,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // ===== LABEL LAYANAN KAMI =====
                  Padding(
                    padding:
                        const EdgeInsets.only(left: 22, bottom: 10, top: 6),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Layanan Kami",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey[800],
                        ),
                      ),
                    ),
                  ),

                  // ===== GRID MENU =====
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 18),
                      child: GridView(
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          mainAxisExtent: 155,
                          crossAxisSpacing: 14,
                          mainAxisSpacing: 14,
                        ),
                        children: [
                          _menuCard(
                            image: "assets/pengaduan.png",
                            title: "Pengaduan\nMasyarakat",
                            onTap: () => _navigateToPengaduan(context),
                          ),
                          _menuCard(
                            image: "assets/surat.png",
                            title: "Surat\nDomisili",
                            onTap: () => _navigateToSuratDomisili(context),
                          ),
                          _menuCard(
                            image: "assets/inventori.png",
                            title: "Informasi\nInventori",
                            onTap: () => _navigateToInventaris(context),
                          ),
                          _menuCard(
                            image: "assets/kegiatan.png",
                            title: "Informasi\nKegiatan",
                            onTap: () => _navigateToKegiatan(context),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ===== MENU CARD =====
  Widget _menuCard({
    required String image,
    required String title,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 7,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(image, height: 55),
              const SizedBox(height: 14),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 15,
                  height: 1.3,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
