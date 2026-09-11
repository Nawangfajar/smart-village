import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:intl/date_symbol_data_local.dart';

import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/detail_pengaduan_screen.dart';
import 'screens/surat_detail_screen.dart';
import 'services/auth_service.dart';
import 'models/pengaduan_model.dart';

final GlobalKey<NavigatorState> navigatorKey =
    GlobalKey<NavigatorState>();

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  await initializeDateFormatting('id_ID', null);

  FirebaseMessaging.onBackgroundMessage(
    _firebaseMessagingBackgroundHandler,
  );

  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final AuthService _authService = AuthService();
  late Future<Widget> _homeFuture;

  @override
  void initState() {
    super.initState();
    _initFCMListeners();
    _homeFuture = _checkLoginStatus();
  }

  // ================= FCM LISTENER =================
  void _initFCMListeners() {
    FirebaseMessaging.onMessage.listen((message) {
      debugPrint("🔔 FOREGROUND: ${message.notification?.title}");
    });

    FirebaseMessaging.onMessageOpenedApp.listen((message) {
      _handleNotificationNavigation(message);
    });
  }

  // ================= LOGIN CHECK =================
  Future<Widget> _checkLoginStatus() async {
    bool isLoggedIn = await _authService.isLoggedIn();
    if (!isLoggedIn) return LoginScreen();

    final userInfo = await _authService.getUserInfo();
    int userId = int.tryParse(userInfo['userId'] ?? '0') ?? 0;

    await _setupFCM(userId);

    return DashboardScreen(
      userId: userId,
      name: userInfo['name'] ?? 'Pengguna',
      email: userInfo['email'] ?? '-',
    );
  }

  // ================= SETUP FCM =================
  Future<void> _setupFCM(int userId) async {
    FirebaseMessaging messaging = FirebaseMessaging.instance;

    await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    String? token = await messaging.getToken();
    if (token != null) {
      await AuthService().saveFcmToken(userId, token);
    }

    RemoteMessage? initialMessage =
        await FirebaseMessaging.instance.getInitialMessage();

    if (initialMessage != null) {
      _handleNotificationNavigation(initialMessage);
    }
  }

  // ================= NAVIGASI DARI NOTIF =================
  void _handleNotificationNavigation(RemoteMessage message) async {
    final data = message.data;

    // ===== NOTIF PENGADUAN =====
    if (data['type'] == 'pengaduan') {
      final int pengaduanId =
          int.tryParse(data['pengaduan_id'] ?? '') ?? 0;

      if (pengaduanId == 0) return;

      Pengaduan pengaduan =
          await AuthService().getPengaduanById(pengaduanId);

      navigatorKey.currentState?.push(
        MaterialPageRoute(
          builder: (_) => DetailPengaduanScreen(pengaduan: pengaduan),
        ),
      );
    }

    // ===== NOTIF SURAT DOMISILI =====
    else if (data['type'] == 'surat_domisili') {
      final int suratId =
          int.tryParse(data['surat_id'] ?? '') ?? 0;

      if (suratId == 0) return;

      navigatorKey.currentState?.push(
        MaterialPageRoute(
          builder: (_) => SuratDetailScreen(suratId: suratId),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: navigatorKey,
      debugShowCheckedModeBanner: false,
      title: 'Layanan Masyarakat',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: FutureBuilder(
        future: _homeFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          }
          return snapshot.data ?? LoginScreen();
        },
      ),
    );
  }
}
