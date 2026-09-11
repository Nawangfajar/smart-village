import 'package:flutter/material.dart';
import '../services/surat_service.dart';

class InputSuratDomisiliScreen extends StatefulWidget {
  final int userId;

  const InputSuratDomisiliScreen({Key? key, required this.userId}) : super(key: key);

  @override
  State<InputSuratDomisiliScreen> createState() => _InputSuratDomisiliScreenState();
}

class _InputSuratDomisiliScreenState extends State<InputSuratDomisiliScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  final Map<String, TextEditingController> _ctrl = {
    'nama': TextEditingController(),
    'nik': TextEditingController(),
    'ttl': TextEditingController(),
    'jenisKelamin': TextEditingController(),
    'agama': TextEditingController(),
    'pekerjaan': TextEditingController(),
    'alamatAsal': TextEditingController(),
    'alamatDomisili': TextEditingController(),
    'rt': TextEditingController(),
    'rw': TextEditingController(),
    'lamaMenetap': TextEditingController(),
    'statusTempatTinggal': TextEditingController(),
    'keperluanSurat': TextEditingController(),
  };

  @override
  void dispose() {
    for (var c in _ctrl.values) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    final data = {
      "nama": _ctrl['nama']!.text,
      "nik": _ctrl['nik']!.text,
      "ttl": _ctrl['ttl']!.text,
      "jenisKelamin": _ctrl['jenisKelamin']!.text,
      "agama": _ctrl['agama']!.text,
      "pekerjaan": _ctrl['pekerjaan']!.text,
      "alamatAsal": _ctrl['alamatAsal']!.text,
      "alamatDomisili": _ctrl['alamatDomisili']!.text,
      "rt": _ctrl['rt']!.text,
      "rw": _ctrl['rw']!.text,
      "lamaMenetap": _ctrl['lamaMenetap']!.text,
      "statusTempatTinggal": _ctrl['statusTempatTinggal']!.text,
      "keperluanSurat": _ctrl['keperluanSurat']!.text,
    };

    final success = await SuratService().buatSuratDomisili(data);
    setState(() => _isLoading = false);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          success
              ? '✅ Surat domisili berhasil dikirim!'
              : '❌ Gagal mengirim surat domisili',
        ),
        backgroundColor: success ? Colors.green.shade600 : Colors.red.shade600,
      ),
    );

    if (success) Navigator.pop(context);
  }

  Widget _buildTextField(String label, String key, {int maxLines = 1}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: TextFormField(
        controller: _ctrl[key],
        maxLines: maxLines,
        decoration: InputDecoration(
          labelText: label,
          labelStyle: const TextStyle(
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
          filled: true,
          fillColor: Colors.white,
          contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: BorderSide(color: Colors.grey.shade300, width: 1),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: const BorderSide(color: Colors.blue, width: 1.5),
          ),
        ),
        validator: (value) => value == null || value.isEmpty ? 'Wajib diisi' : null,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Colors.blue.shade700;

    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        title: const Text(
          'Form Surat Keterangan Domisili',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: Colors.white,
          ),
        ),
        backgroundColor: primaryColor,
        centerTitle: true,
        elevation: 3,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(18),
        child: Card(
          elevation: 4,
          shadowColor: Colors.black26,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Isi Data dengan Lengkap",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildTextField('Nama Lengkap', 'nama'),
                  _buildTextField('NIK', 'nik'),
                  _buildTextField('Tempat / Tanggal Lahir', 'ttl'),
                  _buildTextField('Jenis Kelamin', 'jenisKelamin'),
                  _buildTextField('Agama', 'agama'),
                  _buildTextField('Pekerjaan', 'pekerjaan'),
                  _buildTextField('Alamat Asal', 'alamatAsal', maxLines: 2),
                  _buildTextField('Alamat Domisili', 'alamatDomisili', maxLines: 2),
                  Row(
                    children: [
                      Expanded(child: _buildTextField('RT', 'rt')),
                      const SizedBox(width: 10),
                      Expanded(child: _buildTextField('RW', 'rw')),
                    ],
                  ),
                  _buildTextField('Lama Menetap', 'lamaMenetap'),
                  _buildTextField('Status Tempat Tinggal', 'statusTempatTinggal'),
                  _buildTextField('Keperluan Surat', 'keperluanSurat', maxLines: 2),
                  const SizedBox(height: 25),
                  SizedBox(
                    width: double.infinity,
                    height: 55,
                    child: _isLoading
                        ? const Center(child: CircularProgressIndicator())
                        : ElevatedButton.icon(
                            icon: const Icon(Icons.send_rounded, color: Colors.white),
                            label: const Text(
                              'Kirim Permohonan',
                              style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: primaryColor,
                              elevation: 4,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                            ),
                            onPressed: _submitForm,
                          ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}