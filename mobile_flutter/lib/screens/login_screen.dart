import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:firebase_messaging/firebase_messaging.dart';

import '../services/auth_service.dart';
import 'register_screen.dart';
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();

  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  String? _errorMessage;

  final Color primaryBlue = const Color(0xFF2F5BEA);

  bool _obscurePassword = true;

  @override
  void initState() {
    super.initState();

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      if (message.notification != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              message.notification!.title ??
                  message.notification!.body ??
                  "Notifikasi baru",
            ),
          ),
        );
      }
    });
  }

  Future<void> _saveFcmToken(int userId) async {
    await FirebaseMessaging.instance.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    String? token = await FirebaseMessaging.instance.getToken();

    if (token == null) return;

    await FirebaseMessaging.instance.subscribeToTopic(
      "kegiatan",
    );

    await http.post(
      Uri.parse(
        "http://192.168.0.105:3000/api/auth/save-fcm-token",
      ),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "user_id": userId,
        "fcm_token": token,
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,

      resizeToAvoidBottomInset: true,

      body: SafeArea(
        child: Column(
          children: [
            // ================= HEADER IMAGE =================
            SizedBox(
              width: double.infinity,
              height:
                  MediaQuery.of(context).size.height * 0.27,

              child: Image.asset(
                "assets/Logo_paduka.png",
                fit: BoxFit.cover,
              ),
            ),

            // ================= FORM =================
            Expanded(
              child: Transform.translate(
                offset: const Offset(0, -28),

                child: Container(
                  width: double.infinity,

                  padding: const EdgeInsets.symmetric(
                    horizontal: 28,
                    vertical: 26,
                  ),

                  decoration: const BoxDecoration(
                    color: Colors.white,

                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(36),
                      topRight: Radius.circular(36),
                    ),
                  ),

                  child: SingleChildScrollView(
                    keyboardDismissBehavior:
                        ScrollViewKeyboardDismissBehavior
                            .onDrag,

                    child: Form(
                      key: _formKey,

                      child: Column(
                        children: [
                          const SizedBox(height: 10),

                          const Text(
                            "Selamat Datang 👋",

                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey,
                            ),
                          ),

                          const SizedBox(height: 6),

                          Text(
                            "Paduka",

                            style: TextStyle(
                              fontSize: 34,
                              fontWeight:
                                  FontWeight.bold,
                              color: primaryBlue,
                            ),
                          ),

                          const SizedBox(height: 4),

                          const Text(
                            "Aplikasi Layanan Masyarakat Padukuhan V",

                            textAlign: TextAlign.center,

                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey,
                            ),
                          ),

                          const SizedBox(height: 24),

                          if (_errorMessage != null)
                            Padding(
                              padding:
                                  const EdgeInsets.only(
                                bottom: 14,
                              ),

                              child: Text(
                                _errorMessage!,

                                style:
                                    const TextStyle(
                                  color: Colors.red,
                                  fontWeight:
                                      FontWeight.w500,
                                ),
                              ),
                            ),

                          // EMAIL
                          Container(
                            decoration: BoxDecoration(
                              color:
                                  const Color(0xFFF8F9FD),

                              borderRadius:
                                  BorderRadius.circular(
                                16,
                              ),

                              border: Border.all(
                                color:
                                    Colors.grey.shade300,
                              ),
                            ),

                            child: TextFormField(
                              controller:
                                  _emailController,

                              decoration:
                                  InputDecoration(
                                hintText: "Email",

                                hintStyle: TextStyle(
                                  color: Colors
                                      .grey.shade500,
                                ),

                                prefixIcon: Icon(
                                  Icons
                                      .person_outline,
                                  color: primaryBlue,
                                  size: 22,
                                ),

                                border:
                                    InputBorder.none,

                                contentPadding:
                                    const EdgeInsets
                                        .symmetric(
                                  vertical: 16,
                                ),
                              ),

                              validator: (v) =>
                                  v == null ||
                                          v.isEmpty
                                      ? "Email wajib diisi"
                                      : null,
                            ),
                          ),

                          const SizedBox(height: 16),

                          // PASSWORD
                          Container(
                            decoration: BoxDecoration(
                              color:
                                  const Color(0xFFF8F9FD),

                              borderRadius:
                                  BorderRadius.circular(
                                16,
                              ),

                              border: Border.all(
                                color:
                                    Colors.grey.shade300,
                              ),
                            ),

                            child: TextFormField(
                              controller:
                                  _passwordController,

                              obscureText:
                                  _obscurePassword,

                              decoration:
                                  InputDecoration(
                                hintText:
                                    "Password",

                                hintStyle: TextStyle(
                                  color: Colors
                                      .grey.shade500,
                                ),

                                prefixIcon: Icon(
                                  Icons.lock_outline,
                                  color: primaryBlue,
                                  size: 22,
                                ),

                                suffixIcon:
                                    IconButton(
                                  icon: Icon(
                                    _obscurePassword
                                        ? Icons
                                            .visibility_outlined
                                        : Icons
                                            .visibility_off_outlined,
                                    color:
                                        Colors.grey,
                                    size: 22,
                                  ),

                                  onPressed: () {
                                    setState(() {
                                      _obscurePassword =
                                          !_obscurePassword;
                                    });
                                  },
                                ),

                                border:
                                    InputBorder.none,

                                contentPadding:
                                    const EdgeInsets
                                        .symmetric(
                                  vertical: 16,
                                ),
                              ),

                              validator: (val) =>
                                  val == null ||
                                          val.length <
                                              6
                                      ? "Password minimal 6 karakter"
                                      : null,
                            ),
                          ),

                          const SizedBox(height: 26),

                          // BUTTON LOGIN
                          SizedBox(
                            width: double.infinity,
                            height: 50,

                            child: ElevatedButton(
                              style:
                                  ElevatedButton.styleFrom(
                                backgroundColor:
                                    primaryBlue,

                                elevation: 5,

                                shadowColor:
                                    primaryBlue
                                        .withOpacity(
                                  0.3,
                                ),

                                shape:
                                    RoundedRectangleBorder(
                                  borderRadius:
                                      BorderRadius
                                          .circular(
                                    14,
                                  ),
                                ),
                              ),

                              onPressed: () async {
                                if (_formKey
                                    .currentState!
                                    .validate()) {
                                  final result =
                                      await AuthService()
                                          .login(
                                    _emailController
                                        .text
                                        .trim(),
                                    _passwordController
                                        .text,
                                  );

                                  if (result !=
                                      null) {
                                    final userInfo =
                                        await AuthService()
                                            .getUserInfo();

                                    final int userId =
                                        int.parse(
                                      userInfo[
                                              'userId'] ??
                                          '0',
                                    );

                                    await _saveFcmToken(
                                      userId,
                                    );

                                    Navigator
                                        .pushReplacement(
                                      context,
                                      MaterialPageRoute(
                                        builder:
                                            (_) =>
                                                DashboardScreen(
                                          userId:
                                              userId,
                                          name:
                                              userInfo[
                                                      'name'] ??
                                                  'User',
                                          email:
                                              userInfo[
                                                      'email'] ??
                                                  '-',
                                        ),
                                      ),
                                    );
                                  } else {
                                    setState(() {
                                      _errorMessage =
                                          "Login gagal. Cek email/password.";
                                    });
                                  }
                                }
                              },

                              child: const Text(
                                "Masuk",

                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight:
                                      FontWeight
                                          .bold,
                                  color:
                                      Colors.white,
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 16),

                          TextButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder:
                                      (_) =>
                                          RegisterScreen(),
                                ),
                              );
                            },

                            child: Text(
                              "Belum punya akun? Daftar",

                              style: TextStyle(
                                color: primaryBlue,
                                fontWeight:
                                    FontWeight.w600,
                                fontSize: 15,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}