import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Chip,
  Divider,
  Stack,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


// MAP
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const STATUS_OPTIONS = ['diproses', 'selesai', 'ditolak'];

const getStatusColor = (status) => {
  switch (status) {
    case 'selesai':
      return 'success';
    case 'diproses':
      return 'warning';
    case 'ditolak':
      return 'error';
    default:
      return 'default';
  }
};

export default function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentYear = new Date().getFullYear();

  const [pengaduanList, setPengaduanList] = useState([]);
  const [daftarTahun, setDaftarTahun] = useState([]);
  const [tahun, setTahun] = useState(currentYear);
  const [loading, setLoading] = useState(false);

  const [selectedPengaduan, setSelectedPengaduan] = useState(null);

  // ===== STATISTIK =====
  const [statistik, setStatistik] = useState({
    total: 0,
    dikirim: 0,
    diproses: 0,
    selesai: 0,
    ditolak: 0,
  });

  // Preview foto
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  /* =========================
     FETCH DAFTAR TAHUN
  ========================= */
  const fetchDaftarTahun = async () => {
    try {
      const res = await axios.get(
        'http://localhost:3000/api/pengaduan/tahun'
      );
      if (res.data.length > 0) {
        setDaftarTahun(res.data);
        setTahun(res.data[0]);
      } else {
        setDaftarTahun([currentYear]);
      }
    } catch {
      setDaftarTahun([currentYear]);
    }
  };

  /* =========================
     FETCH DATA TABEL
  ========================= */
  const fetchPengaduan = async (tahunFilter) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/pengaduan/riwayat?tahun=${tahunFilter}`
      );
      setPengaduanList(res.data);
    } catch {
      Swal.fire('Gagal', 'Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FETCH STATISTIK
  ========================= */
  const fetchStatistik = async (tahunFilter) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/pengaduan/statistik?tahun=${tahunFilter}`
      );

      const total =
        res.data.dikirim +
        res.data.diproses +
        res.data.selesai +
        res.data.ditolak;

      setStatistik({
        ...res.data,
        total,
      });
    } catch {
      console.error('Gagal mengambil statistik');
    }
  };

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    fetchDaftarTahun();
  }, []);

  useEffect(() => {
    if (tahun) {
      fetchPengaduan(tahun);
      fetchStatistik(tahun);
    }
  }, [tahun]);

  /* =========================
     UPDATE STATUS
  ========================= */
  const handleStatusChange = (id, status) => {
    setPengaduanList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    setSelectedPengaduan((prev) => ({ ...prev, status }));
  };

  const updateStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: 'Simpan perubahan status?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.put(
        `http://localhost:3000/api/pengaduan/updatestatus/${id}`,
        { status }
      );
      Swal.fire('Berhasil', 'Status diperbarui', 'success');
      fetchPengaduan(tahun);
      fetchStatistik(tahun);
    } catch {
      Swal.fire('Gagal', 'Gagal update status', 'error');
    }
  };

  const handleCetakLaporanTahunan = () => {
    window.open(
      `http://localhost:3000/api/pengaduan/cetak/tahunan?tahun=${tahun}`,
      '_blank'
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        {/* HEADER */}
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FeedbackIcon color="primary" />
            <Typography variant="h5" fontWeight="bold" color="primary">
              Kelola Pengaduan
            </Typography>
          </Stack>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => {
              fetchPengaduan(tahun);
              fetchStatistik(tahun);
            }}
          >
            Refresh
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* FILTER TAHUN */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#f9fafb' }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <CalendarMonthIcon color="primary" />
              <Typography fontWeight="bold">Filter Tahun</Typography>
              <Select size="small" value={tahun} onChange={(e) => setTahun(e.target.value)}>
                {daftarTahun.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
              <Chip label={`Tahun ${tahun}`} color="primary" variant="outlined" />
            </Stack>

            <Button
              variant="contained"
              color="success"
              startIcon={<PrintIcon />}
              onClick={handleCetakLaporanTahunan}
            >
              Cetak Laporan
            </Button>
          </Stack>
        </Paper>

          {/* ===== STATISTIK 5 CARD ===== */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={3}>
            
            {/* TOTAL */}
            <Paper sx={{ p: 2, flex: 1, borderLeft: '6px solid #0288d1' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <AssessmentIcon sx={{ fontSize: 40, color: '#0288d1' }} />
                <Box>
                  <Typography variant="subtitle2">Total Pengaduan</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statistik.total}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* DIKIRIM */}
            <Paper sx={{ p: 2, flex: 1, borderLeft: '6px solid #1976d2' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <MarkEmailUnreadIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                <Box>
                  <Typography variant="subtitle2">Dikirim</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statistik.dikirim}
                  </Typography>
                  <Typography variant="caption"></Typography>
                </Box>
              </Stack>
            </Paper>

            {/* DIPROSES */}
            <Paper sx={{ p: 2, flex: 1, borderLeft: '6px solid #ed6c02' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <AutorenewIcon sx={{ fontSize: 40, color: '#ed6c02' }} />
                <Box>
                  <Typography variant="subtitle2">Diproses</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statistik.diproses}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* SELESAI */}
            <Paper sx={{ p: 2, flex: 1, borderLeft: '6px solid #2e7d32' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CheckCircleIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
                <Box>
                  <Typography variant="subtitle2">Selesai</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statistik.selesai}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* DITOLAK */}
            <Paper sx={{ p: 2, flex: 1, borderLeft: '6px solid #d32f2f' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CancelIcon sx={{ fontSize: 40, color: '#d32f2f' }} />
                <Box>
                  <Typography variant="subtitle2">Ditolak</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {statistik.ditolak}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

          </Stack>


        {/* ===== TABEL (UI LAMA, TIDAK DIUBAH) ===== */}
        {loading ? (
          <Box textAlign="center" py={5}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>No</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Judul</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Isi</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Foto</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Aksi</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pengaduanList.map((p, i) => (
                  <TableRow key={p.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{p.judul}</TableCell>
                    <TableCell>{p.isi}</TableCell>
                    <TableCell>
                      {p.foto ? (
                        <Box
                          component="img"
                          src={`http://localhost:3000/uploads/${p.foto}`}
                          sx={{ width: 60, height: 60, cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedImage(
                              `http://localhost:3000/uploads/${p.foto}`
                            );
                            setOpenImage(true);
                          }}
                        />
                      ) : 'Tidak ada'}
                    </TableCell>
                    <TableCell>
                      <Chip label={p.status} color={getStatusColor(p.status)} />
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="contained" onClick={() => setSelectedPengaduan(p)}>
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* PREVIEW FOTO */}
      <Dialog open={openImage} onClose={() => setOpenImage(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Foto Pengaduan
          <IconButton onClick={() => setOpenImage(false)} sx={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="img" src={selectedImage} sx={{ width: '100%' }} />
        </DialogContent>
      </Dialog>

      {/* DETAIL */}
      <Dialog open={Boolean(selectedPengaduan)} onClose={() => setSelectedPengaduan(null)} fullWidth maxWidth="sm">
        <DialogTitle>Detail Pengaduan</DialogTitle>
        <DialogContent>
          <Typography fontWeight="bold">{selectedPengaduan?.judul}</Typography>
          <Typography mb={2}>{selectedPengaduan?.isi}</Typography>

          {selectedPengaduan?.latitude && selectedPengaduan?.longitude && (
            <>
              <Box height={250}>
                <MapContainer
                  center={[selectedPengaduan.latitude, selectedPengaduan.longitude]}
                  zoom={16}
                  style={{ height: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[selectedPengaduan.latitude, selectedPengaduan.longitude]} />
                </MapContainer>
              </Box>

              <Button
                fullWidth
                sx={{ mt: 1 }}
                href={`https://www.google.com/maps?q=${selectedPengaduan.latitude},${selectedPengaduan.longitude}`}
                target="_blank"
              >
                Buka Google Maps
              </Button>
            </>
          )}

          <Select
            fullWidth
            sx={{ mt: 2 }}
            value={selectedPengaduan?.status || ''}
            onChange={(e) =>
              handleStatusChange(selectedPengaduan.id, e.target.value)
            }
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSelectedPengaduan(null)}>Batal</Button>
          <Button
            variant="contained"
            onClick={() => {
              updateStatus(selectedPengaduan.id, selectedPengaduan.status);
              setSelectedPengaduan(null);
            }}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
