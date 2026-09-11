import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:intl/intl.dart';
import '../services/inventory_service.dart';

enum InventoryFilter { all, pinjam }

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({Key? key}) : super(key: key);

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  final InventoryService _service = InventoryService();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  List<dynamic> inventories = [];
  Map<int, Map<String, dynamic>?> activeLoans = {};
  bool loading = true;
  int userId = 0;

  InventoryFilter filter = InventoryFilter.all;

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    final id = await _storage.read(key: 'userId');
    userId = int.tryParse(id ?? '0') ?? 0;
    _load();
  }

  Future<void> _load() async {
    setState(() => loading = true);

    inventories = await _service.getInventories(
      tipe: filter == InventoryFilter.pinjam ? 'pinjam' : null,
    );

    activeLoans.clear();
    for (var inv in inventories) {
      final res = await _service.getActiveLoan(inv['id'], userId);
      activeLoans[inv['id']] =
          res['isBorrowing'] == true ? res['peminjaman'] : null;
    }

    setState(() => loading = false);
  }

  bool _isLate(Map<String, dynamic> loan) {
    if (loan['tanggal_sampai'] == null) return false;
    final sampai = DateTime.parse(loan['tanggal_sampai']);
    return DateTime.now().isAfter(
      DateTime(sampai.year, sampai.month, sampai.day),
    );
  }

  /// ================= PINJAM =================
  Future<void> _borrow(Map<String, dynamic> inv) async {
    final jumlahCtrl = TextEditingController(text: '1');
    DateTime? sampai;

    await showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setLocal) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          title: Text('Pinjam ${inv['nama_barang']}'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: jumlahCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Jumlah',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              OutlinedButton.icon(
                icon: const Icon(Icons.date_range),
                label: Text(
                  sampai == null
                      ? 'Pilih sampai tanggal'
                      : DateFormat('dd MMM yyyy').format(sampai!),
                ),
                onPressed: () async {
                  final pick = await showDatePicker(
                    context: ctx,
                    initialDate: DateTime.now().add(const Duration(days: 1)),
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 30)),
                  );
                  if (pick != null) setLocal(() => sampai = pick);
                },
              ),
            ],
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Batal')),
            ElevatedButton(
              onPressed: () async {
                final jumlah = int.tryParse(jumlahCtrl.text) ?? 0;
                final sisa = inv['sisa_bisa_dipinjam'] ?? 0;

                if (jumlah <= 0) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Jumlah tidak valid')),
                  );
                  return;
                }

                if (jumlah > sisa) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Jumlah melebihi sisa inventori ($sisa tersedia)',
                      ),
                      backgroundColor: Colors.red.shade700,
                    ),
                  );
                  return;
                }

                if (sampai == null) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Pilih tanggal pengembalian')),
                  );
                  return;
                }

                Navigator.pop(ctx);
                await _service.borrowItem(
                  inv['id'],
                  userId,
                  jumlah,
                  sampai!,
                );
                _load();
              },
              child: const Text('Pinjam'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _return(int id) async {
    await _service.returnItem(id, userId);
    _load();
  }

  /// ================= UI =================
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      body: Column(
        children: [
          _header(),
          _filter(),
          Expanded(child: loading ? _loading() : _list()),
        ],
      ),
    );
  }

  Widget _header() => Container(
        padding: const EdgeInsets.only(bottom: 14),
        decoration: BoxDecoration(
          color: Colors.blue.shade700,
          borderRadius:
              const BorderRadius.vertical(bottom: Radius.circular(24)),
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
                    'Inventori Padukuhan',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.refresh, color: Colors.white),
                onPressed: _load,
              ),
            ],
          ),
        ),
      );

  Widget _filter() => Padding(
        padding: const EdgeInsets.all(16),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                  color: Colors.black.withOpacity(0.05), blurRadius: 6)
            ],
          ),
          child: Row(
            children: [
              _filterItem('Semua Inventori', InventoryFilter.all),
              _filterItem('Bisa Dipinjam', InventoryFilter.pinjam),
            ],
          ),
        ),
      );

  Widget _filterItem(String text, InventoryFilter f) => Expanded(
        child: GestureDetector(
          onTap: () {
            filter = f;
            _load();
          },
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(
              color: filter == f ? Colors.blue.shade700 : Colors.transparent,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Center(
              child: Text(
                text,
                style: TextStyle(
                  color: filter == f ? Colors.white : Colors.black87,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ),
      );

  Widget _loading() =>
      const Center(child: CircularProgressIndicator());

  Widget _list() => ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: inventories.length,
        itemBuilder: (_, i) {
          final inv = inventories[i];
          final loan = activeLoans[inv['id']];
          final borrowed = loan != null;
          final late = borrowed && _isLate(loan!);

          return Container(
            margin: const EdgeInsets.only(bottom: 14),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(
                    color: Colors.black.withOpacity(0.05), blurRadius: 8)
              ],
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(inv['nama_barang'],
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 6),
                      Text('Jumlah total: ${inv['jumlah_total']}'),
                      if (filter == InventoryFilter.pinjam)
                        Text(
                            'Sisa bisa dipinjam: ${inv['sisa_bisa_dipinjam']}'),
                      if (borrowed)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            'Anda sedang meminjam ${loan!['jumlah_pinjam']} unit',
                            style: TextStyle(
                              color: Colors.blue.shade700,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      if (borrowed)
                        Padding(
                          padding: const EdgeInsets.only(top: 6),
                          child: Row(
                            children: [
                              Icon(
                                late
                                    ? Icons.warning_amber_rounded
                                    : Icons.schedule,
                                size: 18,
                                color: late ? Colors.red : Colors.orange,
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  late
                                      ? 'TERLAMBAT dikembalikan'
                                      : 'Batas sampai ${DateFormat('dd MMM yyyy').format(DateTime.parse(loan['tanggal_sampai']))}',
                                  style: TextStyle(
                                    color: late
                                        ? Colors.red
                                        : Colors.orange.shade800,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
                if (filter == InventoryFilter.pinjam)
                  const SizedBox(width: 12),
                if (filter == InventoryFilter.pinjam)
                  SizedBox(
                    height: 42,
                    child: ElevatedButton(
                      onPressed: borrowed
                          ? () => _return(inv['id'])
                          : (inv['sisa_bisa_dipinjam'] ?? 0) > 0
                              ? () => _borrow(inv)
                              : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: borrowed
                            ? Colors.red.shade700 // 🔴 FIX: KEMBALI MERAH
                            : Colors.blue.shade700,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14)),
                      ),
                      child: Text(borrowed ? 'Kembalikan' : 'Pinjam'),
                    ),
                  ),
              ],
            ),
          );
        },
      );
}
