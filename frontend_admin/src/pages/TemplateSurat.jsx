import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

const API_URL = "http://localhost:3000/api/surat/template";
// kalau lokal:
// const API_URL = "http://localhost:3000/api/surat/template";

const TemplateSurat = () => {
  const [form, setForm] = useState({
    nama_instansi: "",
    alamat_instansi: "",
    jabatan_pejabat: "",
    nama_pejabat: "",
    nip: "",
    tempat_surat: "",
    catatan_bawah: "",
  });

  const [loading, setLoading] = useState(true);

  // ================= GET TEMPLATE =================
  const fetchTemplate = async () => {
    try {
      const res = await axios.get(API_URL);

      // 🔥 PENTING: backend KIRIM LANGSUNG OBJECT
      if (!res.data) {
        throw new Error("Data template kosong");
      }

      setForm({
        nama_instansi: res.data.nama_instansi || "",
        alamat_instansi: res.data.alamat_instansi || "",
        jabatan_pejabat: res.data.jabatan_pejabat || "",
        nama_pejabat: res.data.nama_pejabat || "",
        nip: res.data.nip || "",
        tempat_surat: res.data.tempat_surat || "",
        catatan_bawah: res.data.catatan_bawah || "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Gagal memuat template surat", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, []);

  // ================= SIMPAN TEMPLATE =================
  const handleSubmit = async () => {
    try {
      await axios.put(API_URL, form);
      Swal.fire("Berhasil", "Template surat berhasil disimpan", "success");
      fetchTemplate();
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Gagal menyimpan template surat", "error");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            <DescriptionIcon sx={{ mr: 1 }} />
            Template Surat Domisili
          </Typography>

          <Typography color="text.secondary" mb={3}>
            Data ini digunakan otomatis saat surat domisili diterima dan dicetak ke PDF.
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Nama Instansi"
              value={form.nama_instansi}
              onChange={(e) => setForm({ ...form, nama_instansi: e.target.value })}
              fullWidth
            />

            <TextField
              label="Alamat Instansi"
              value={form.alamat_instansi}
              onChange={(e) => setForm({ ...form, alamat_instansi: e.target.value })}
              fullWidth
            />

            <TextField
              label="Jabatan Pejabat"
              value={form.jabatan_pejabat}
              onChange={(e) => setForm({ ...form, jabatan_pejabat: e.target.value })}
              fullWidth
            />

            <TextField
              label="Nama Pejabat"
              value={form.nama_pejabat}
              onChange={(e) => setForm({ ...form, nama_pejabat: e.target.value })}
              fullWidth
            />

            <TextField
              label="NIP"
              value={form.nip}
              onChange={(e) => setForm({ ...form, nip: e.target.value })}
              fullWidth
            />

            <TextField
              label="Tempat Surat"
              value={form.tempat_surat}
              onChange={(e) => setForm({ ...form, tempat_surat: e.target.value })}
              fullWidth
            />

            <TextField
              label="Catatan Bawah Surat"
              value={form.catatan_bawah}
              onChange={(e) => setForm({ ...form, catatan_bawah: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
            >
              Simpan Template
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TemplateSurat;
