import React, { useState, useEffect } from 'react';
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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';

// Format tanggal ISO -> input type date
const formatDateForInput = (isoDate) => {
  if (!isoDate) return '';
  return isoDate.split('T')[0];
};

const KegiatanManagement = () => {
  const [kegiatanList, setKegiatanList] = useState([]);
  const [selectedKegiatan, setSelectedKegiatan] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    nama_kegiatan: '',
    lokasi: '',
    tanggal: '',
    waktu: '',
    foto: null,
  });

  useEffect(() => {
    fetchKegiatan();
  }, []);

  const fetchKegiatan = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/kegiatan');
      setKegiatanList(res.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat memuat data kegiatan.',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      setFormData({ ...formData, foto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('nama_kegiatan', formData.nama_kegiatan);
    data.append('lokasi', formData.lokasi);
    data.append('tanggal', formData.tanggal);
    data.append('waktu', formData.waktu);
    if (formData.foto) {
      data.append('foto', formData.foto);
    }

    try {
      if (selectedKegiatan) {
        await axios.put(
          `http://localhost:3000/api/kegiatan/${selectedKegiatan.id}`,
          data
        );

        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Kegiatan berhasil diperbarui.',
          confirmButtonColor: '#4a6cf7',
        });

      } else {
        await axios.post('http://localhost:3000/api/kegiatan', data);

        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Kegiatan berhasil ditambahkan.',
          confirmButtonColor: '#4a6cf7',
        });
      }

      setOpenDialog(false);
      fetchKegiatan();

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat menyimpan data.',
      });
    }
  };

  const openDialogForm = (kegiatan = null) => {
    if (kegiatan) {
      setSelectedKegiatan(kegiatan);
      setFormData({
        nama_kegiatan: kegiatan.nama_kegiatan,
        lokasi: kegiatan.lokasi,
        tanggal: formatDateForInput(kegiatan.tanggal),
        waktu: kegiatan.waktu,
        foto: null,
      });
    } else {
      setSelectedKegiatan(null);
      setFormData({
        nama_kegiatan: '',
        lokasi: '',
        tanggal: '',
        waktu: '',
        foto: null,
      });
    }
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      text: 'Data kegiatan akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/kegiatan/${id}`);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Kegiatan berhasil dihapus.',
      });

      fetchKegiatan();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menghapus kegiatan.',
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Card Pengelolaan Kegiatan */}
      <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
        {/* Header Card */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <EventIcon color="primary" />
            <Typography variant="h5" fontWeight="bold" color="primary">
              Kelola Kegiatan
            </Typography>
          </Stack>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => openDialogForm()}>
            Tambah Kegiatan
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Tabel Kegiatan */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>No</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Nama Kegiatan</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Lokasi</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tanggal</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Waktu</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Foto</TableCell>
                <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kegiatanList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Tidak ada data kegiatan.
                  </TableCell>
                </TableRow>
              ) : (
                kegiatanList.map((kegiatan, index) => (
                  <TableRow key={kegiatan.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ wordBreak: 'break-word' }}>
                      {kegiatan.nama_kegiatan}
                    </TableCell>
                    <TableCell>{kegiatan.lokasi}</TableCell>
                    <TableCell>{formatDateForInput(kegiatan.tanggal)}</TableCell>
                    <TableCell>{kegiatan.waktu}</TableCell>
                    <TableCell>
                      {kegiatan.foto ? (
                        <Box
                          component="img"
                          src={`http://localhost:3000/uploads/kegiatan/${kegiatan.foto}`}
                          alt="Foto"
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                            boxShadow: 1,
                          }}
                        />
                      ) : (
                        'Tidak ada'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton color="primary" onClick={() => openDialogForm(kegiatan)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Hapus">
                        <IconButton color="error" onClick={() => handleDelete(kegiatan.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog Form */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedKegiatan ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Nama Kegiatan"
              fullWidth
              name="nama_kegiatan"
              value={formData.nama_kegiatan}
              onChange={handleChange}
            />
            <TextField
              label="Lokasi"
              fullWidth
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
            />
            <TextField
              label="Tanggal"
              fullWidth
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Waktu"
              fullWidth
              name="waktu"
              value={formData.waktu}
              onChange={handleChange}
              placeholder="Contoh: 08:00 - Selesai"
            />
            <Button variant="outlined" component="label">
              Upload Foto
              <input type="file" hidden name="foto" accept="image/*" onChange={handleChange} />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Batal
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedKegiatan ? 'Perbarui' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default KegiatanManagement;
