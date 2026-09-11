class AppConfig {
  // Ubah IP di sini saja kalau pindah jaringan WiFi atau backend
  static const String baseIp = '192.168.0.108'; 
  static const String basePort = '3000';

  // Base URL API utama
  static String get baseUrl => 'http://$baseIp:$basePort/api';
}
