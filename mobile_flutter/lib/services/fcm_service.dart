import 'package:firebase_messaging/firebase_messaging.dart';

class FcmService {
  static Future<String?> initFCM() async {
    FirebaseMessaging messaging = FirebaseMessaging.instance;

    await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    String? token = await messaging.getToken();
    print("FCM TOKEN: $token");

    return token;
  }
}
