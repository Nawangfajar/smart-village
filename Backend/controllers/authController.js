const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = db.Admin; // Tambahkan ini di atas

const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey';

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Memastikan data yang diperlukan ada
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Mengecek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat user baru
    await User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Memastikan email dan password ada
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Mencari user berdasarkan email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Memverifikasi password yang dimasukkan
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Membuat JWT token jika login berhasil
    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '14d' } // Token expired setelah 1 hari
    );

    // Mengirimkan response sukses dengan token dan data user
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err });
  }
};

exports.saveFcmToken = async (req, res) => {
  const { user_id, fcm_token } = req.body;

  if (!user_id || !fcm_token) {
    return res.status(400).json({
      message: "user_id dan fcm_token wajib diisi",
    });
  }

  try {
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    await user.update({ fcm_token });

    return res.status(200).json({
      message: "FCM token berhasil disimpan",
    });
  } catch (error) {
    console.error("Error save FCM token:", error);
    return res.status(500).json({
      message: "Gagal menyimpan FCM token",
      error: error.message,
    });
  }
};


exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  const db = require('../models');
  const Admin = db.Admin;
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const jwtSecret = process.env.JWT_SECRET || 'defaultsecretkey';

  try {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: admin.id, username: admin.username }, jwtSecret, { expiresIn: '14d' });

    res.status(200).json({
      message: 'Login berhasil',
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
};

