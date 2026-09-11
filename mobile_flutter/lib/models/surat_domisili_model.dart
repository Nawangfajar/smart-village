class SuratDomisili {
  final String nomorSurat;
  final String nama;
  final String nik;
  final String ttl;
  final String jenisKelamin;
  final String agama;
  final String pekerjaan;
  final String alamatAsal;
  final String alamatDomisili;
  final String rt;
  final String rw;
  final String lamaMenetap;
  final String statusTempatTinggal;
  final String keperluanSurat;
  final String tempatSurat;
  final String tanggalSurat;
  final String jabatanPejabat;
  final String namaPejabat;
  final String nip;
  final String catatan;
  final int userId;

  SuratDomisili({
    required this.nomorSurat,
    required this.nama,
    required this.nik,
    required this.ttl,
    required this.jenisKelamin,
    required this.agama,
    required this.pekerjaan,
    required this.alamatAsal,
    required this.alamatDomisili,
    required this.rt,
    required this.rw,
    required this.lamaMenetap,
    required this.statusTempatTinggal,
    required this.keperluanSurat,
    required this.tempatSurat,
    required this.tanggalSurat,
    required this.jabatanPejabat,
    required this.namaPejabat,
    required this.nip,
    required this.catatan,
    required this.userId,
  });

  // Method untuk mengubah data ke format JSON
  Map<String, dynamic> toJson() {
    return {
      'nomorSurat': nomorSurat,
      'nama': nama,
      'nik': nik,
      'ttl': ttl,
      'jenisKelamin': jenisKelamin,
      'agama': agama,
      'pekerjaan': pekerjaan,
      'alamatAsal': alamatAsal,
      'alamatDomisili': alamatDomisili,
      'rt': rt,
      'rw': rw,
      'lamaMenetap': lamaMenetap,
      'statusTempatTinggal': statusTempatTinggal,
      'keperluanSurat': keperluanSurat,
      'tempatSurat': tempatSurat,
      'tanggalSurat': tanggalSurat,
      'jabatanPejabat': jabatanPejabat,
      'namaPejabat': namaPejabat,
      'nip': nip,
      'catatan': catatan,
      'userId': userId,
    };
  }
}
