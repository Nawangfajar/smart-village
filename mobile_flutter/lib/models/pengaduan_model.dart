class Pengaduan {
  final int id;
  final int userId;
  final String judul;
  final String isi;
  final String? foto;
  final String? status;
  final DateTime? createdAt;
  final double? latitude;
  final double? longitude;

  Pengaduan({
    required this.id,
    required this.userId,
    required this.judul,
    required this.isi,
    this.foto,
    this.status,
    this.createdAt,
    this.latitude,
    this.longitude,
  });

  factory Pengaduan.fromJson(Map<String, dynamic> json) {
    // 👉 Aman untuk Sequelize (createdAt) & DB snake_case (created_at)
    final createdAtValue = json['createdAt'] ?? json['created_at'];

    return Pengaduan(
      id: json['id'],
      userId: json['user_id'] ?? json['userId'],
      judul: json['judul'],
      isi: json['isi'],
      foto: json['foto'],
      status: json['status'],
      createdAt: createdAtValue != null
          ? DateTime.parse(createdAtValue)
          : null,
      latitude: json['latitude'] != null
          ? double.parse(json['latitude'].toString())
          : null,
      longitude: json['longitude'] != null
          ? double.parse(json['longitude'].toString())
          : null,
    );
  }
}
