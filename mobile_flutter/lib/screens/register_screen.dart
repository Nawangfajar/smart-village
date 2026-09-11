import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class RegisterScreen extends StatefulWidget {
  @override
  State<RegisterScreen> createState() =>
      _RegisterScreenState();
}

class _RegisterScreenState
    extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  final _nameController =
      TextEditingController();

  final _emailController =
      TextEditingController();

  final _passwordController =
      TextEditingController();

  String? _errorMessage;

  final Color primaryBlue =
      const Color(0xFF2F5BEA);

  bool _obscurePassword = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,

      resizeToAvoidBottomInset: true,

      body: SafeArea(
        child: Column(
          children: [
            // ================= IMAGE =================
            SizedBox(
              width: double.infinity,
              height:
                  MediaQuery.of(context).size.height *
                      0.27,

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

                  padding:
                      const EdgeInsets.symmetric(
                    horizontal: 28,
                    vertical: 26,
                  ),

                  decoration:
                      const BoxDecoration(
                    color: Colors.white,

                    borderRadius:
                        BorderRadius.only(
                      topLeft:
                          Radius.circular(36),
                      topRight:
                          Radius.circular(36),
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
                          const SizedBox(
                            height: 10,
                          ),

                          const Text(
                            "Selamat Datang 👋",

                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey,
                            ),
                          ),

                          const SizedBox(height: 6),

                          Text(
                            "Daftar Akun",

                            style: TextStyle(
                              fontSize: 32,
                              fontWeight:
                                  FontWeight.bold,
                              color: primaryBlue,
                            ),
                          ),

                          const SizedBox(height: 4),

                          const Text(
                            "Aplikasi Layanan Masyarakat Padukuhan V",

                            textAlign:
                                TextAlign.center,

                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey,
                            ),
                          ),

                          const SizedBox(height: 24),

                          if (_errorMessage !=
                              null)
                            Padding(
                              padding:
                                  const EdgeInsets
                                      .only(
                                bottom: 14,
                              ),

                              child: Text(
                                _errorMessage!,

                                style:
                                    const TextStyle(
                                  color:
                                      Colors.red,
                                  fontWeight:
                                      FontWeight
                                          .w500,
                                ),
                              ),
                            ),

                          // NAMA
                          Container(
                            decoration:
                                BoxDecoration(
                              color:
                                  const Color(
                                0xFFF8F9FD,
                              ),

                              borderRadius:
                                  BorderRadius
                                      .circular(
                                16,
                              ),

                              border:
                                  Border.all(
                                color: Colors
                                    .grey
                                    .shade300,
                              ),
                            ),

                            child:
                                TextFormField(
                              controller:
                                  _nameController,

                              decoration:
                                  InputDecoration(
                                hintText:
                                    "Nama Lengkap",

                                hintStyle:
                                    TextStyle(
                                  color: Colors
                                      .grey
                                      .shade500,
                                ),

                                prefixIcon:
                                    Icon(
                                  Icons
                                      .person_outline,
                                  color:
                                      primaryBlue,
                                  size: 22,
                                ),

                                border:
                                    InputBorder
                                        .none,

                                contentPadding:
                                    const EdgeInsets
                                        .symmetric(
                                  vertical:
                                      16,
                                ),
                              ),

                              validator:
                                  (val) =>
                                      val ==
                                                  null ||
                                              val
                                                  .isEmpty
                                          ? "Nama wajib diisi"
                                          : null,
                            ),
                          ),

                          const SizedBox(
                            height: 16,
                          ),

                          // EMAIL
                          Container(
                            decoration:
                                BoxDecoration(
                              color:
                                  const Color(
                                0xFFF8F9FD,
                              ),

                              borderRadius:
                                  BorderRadius
                                      .circular(
                                16,
                              ),

                              border:
                                  Border.all(
                                color: Colors
                                    .grey
                                    .shade300,
                              ),
                            ),

                            child:
                                TextFormField(
                              controller:
                                  _emailController,

                              decoration:
                                  InputDecoration(
                                hintText:
                                    "Email",

                                hintStyle:
                                    TextStyle(
                                  color: Colors
                                      .grey
                                      .shade500,
                                ),

                                prefixIcon:
                                    Icon(
                                  Icons
                                      .email_outlined,
                                  color:
                                      primaryBlue,
                                  size: 22,
                                ),

                                border:
                                    InputBorder
                                        .none,

                                contentPadding:
                                    const EdgeInsets
                                        .symmetric(
                                  vertical:
                                      16,
                                ),
                              ),

                              validator:
                                  (val) =>
                                      val ==
                                                  null ||
                                              val
                                                  .isEmpty
                                          ? "Email wajib diisi"
                                          : null,
                            ),
                          ),

                          const SizedBox(
                            height: 16,
                          ),

                          // PASSWORD
                          Container(
                            decoration:
                                BoxDecoration(
                              color:
                                  const Color(
                                0xFFF8F9FD,
                              ),

                              borderRadius:
                                  BorderRadius
                                      .circular(
                                16,
                              ),

                              border:
                                  Border.all(
                                color: Colors
                                    .grey
                                    .shade300,
                              ),
                            ),

                            child:
                                TextFormField(
                              controller:
                                  _passwordController,

                              obscureText:
                                  _obscurePassword,

                              decoration:
                                  InputDecoration(
                                hintText:
                                    "Password",

                                hintStyle:
                                    TextStyle(
                                  color: Colors
                                      .grey
                                      .shade500,
                                ),

                                prefixIcon:
                                    Icon(
                                  Icons
                                      .lock_outline,
                                  color:
                                      primaryBlue,
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

                                  onPressed:
                                      () {
                                    setState(
                                      () {
                                        _obscurePassword =
                                            !_obscurePassword;
                                      },
                                    );
                                  },
                                ),

                                border:
                                    InputBorder
                                        .none,

                                contentPadding:
                                    const EdgeInsets
                                        .symmetric(
                                  vertical:
                                      16,
                                ),
                              ),

                              validator:
                                  (val) =>
                                      val ==
                                                  null ||
                                              val.length <
                                                  6
                                          ? "Password minimal 6 karakter"
                                          : null,
                            ),
                          ),

                          const SizedBox(
                            height: 26,
                          ),

                          // BUTTON
                          SizedBox(
                            width:
                                double.infinity,
                            height: 50,

                            child:
                                ElevatedButton(
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

                              onPressed:
                                  () async {
                                if (_formKey
                                    .currentState!
                                    .validate()) {
                                  final error =
                                      await AuthService()
                                          .register(
                                    _nameController
                                        .text
                                        .trim(),
                                    _emailController
                                        .text
                                        .trim(),
                                    _passwordController
                                        .text,
                                  );

                                  setState(() {
                                    _errorMessage =
                                        error;
                                  });

                                  if (error ==
                                      null) {
                                    ScaffoldMessenger.of(
                                            context)
                                        .showSnackBar(
                                      const SnackBar(
                                        content:
                                            Text(
                                          "Registrasi berhasil",
                                        ),
                                      ),
                                    );

                                    Navigator.pop(
                                      context,
                                    );
                                  }
                                }
                              },

                              child:
                                  const Text(
                                "Daftar",

                                style:
                                    TextStyle(
                                  fontSize:
                                      20,
                                  fontWeight:
                                      FontWeight
                                          .bold,
                                  color: Colors
                                      .white,
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(
                            height: 16,
                          ),

                          TextButton(
                            onPressed: () {
                              Navigator.pop(
                                context,
                              );
                            },

                            child: Text(
                              "Sudah punya akun? Login",

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