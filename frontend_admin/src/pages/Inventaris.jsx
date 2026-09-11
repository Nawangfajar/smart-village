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
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';

const API = 'http://localhost:3000/api/inventory';

const InventoryManagement = () => {
  const [inventories, setInventories] = useState([]);
  const [peminjaman, setPeminjaman] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // 🔹 FILTER: all | pinjam
  const [filterTipe, setFilterTipe] = useState('all');

  const [formData, setFormData] = useState({
    nama_barang: '',
    jumlah: '',
    tipe_inventori: 'data',
  });

  useEffect(() => {
    fetchInventories();
    if (filterTipe === 'pinjam') {
      fetchPeminjaman();
    }
  }, [filterTipe]);

  /* ================= FETCH INVENTORI ================= */
  const fetchInventories = async () => {
    try {
      let url = API;
      if (filterTipe === 'pinjam') url += '?tipe=pinjam';
      const res = await axios.get(url);
      setInventories(res.data);
    } catch {
      Swal.fire('Gagal', 'Tidak dapat memuat data inventori', 'error');
    }
  };

  /* ================= FETCH PEMINJAMAN ================= */
  const fetchPeminjaman = async () => {
    try {
      const res = await axios.get(`${API}/loans/dipinjam`);
      setPeminjaman(res.data);
    } catch {
      Swal.fire('Gagal', 'Tidak dapat memuat data peminjaman', 'error');
    }
  };

  const refreshAll = () => {
    fetchInventories();
    if (filterTipe === 'pinjam') {
      fetchPeminjaman();
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const openDialogForm = (inventory = null) => {
    if (inventory) {
      setSelectedInventory(inventory);
      setFormData({
        nama_barang: inventory.nama_barang,
        jumlah: inventory.sisa_bisa_dipinjam ?? inventory.jumlah,
        tipe_inventori: inventory.tipe_inventori,
      });
    } else {
      setSelectedInventory(null);
      setFormData({
        nama_barang: '',
        jumlah: '',
        tipe_inventori: 'data',
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedInventory) {
        await axios.put(`${API}/${selectedInventory.id}`, formData);
        Swal.fire('Berhasil', 'Inventori berhasil diperbarui', 'success');
      } else {
        await axios.post(API, formData);
        Swal.fire('Berhasil', 'Inventori berhasil ditambahkan', 'success');
      }
      setOpenDialog(false);
      refreshAll();
    } catch {
      Swal.fire('Gagal', 'Gagal menyimpan inventori', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Yakin ingin menghapus?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
    });
    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API}/${id}`);
      Swal.fire('Berhasil', 'Inventori berhasil dihapus', 'success');
      refreshAll();
    } catch {
      Swal.fire('Gagal', 'Gagal menghapus inventori', 'error');
    }
  };

  const handleCetakInventori = () => {
    window.open(`${API}/cetak`, '_blank');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* ================= INVENTORI ================= */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <InventoryIcon color="primary" />
            <Typography variant="h5" fontWeight="bold" color="primary">
              Kelola Inventori
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Filter Inventori</InputLabel>
              <Select
                value={filterTipe}
                label="Filter Inventori"
                onChange={(e) => setFilterTipe(e.target.value)}
              >
                <MenuItem value="all">Semua Inventori</MenuItem>
                <MenuItem value="pinjam">Bisa Dipinjam</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={refreshAll}
            >
              REFRESH
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openDialogForm()}
            >
              TAMBAH
            </Button>

            {/* 🔥 CETAK HANYA SAAT SEMUA INVENTORI */}
            {filterTipe === 'all' && (
              <Button
                variant="contained"
                color="success"
                startIcon={<InventoryIcon />}
                onClick={handleCetakInventori}
              >
                CETAK
              </Button>
            )}
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: '#fff' }}>No</TableCell>
                <TableCell sx={{ color: '#fff' }}>Nama Barang</TableCell>
                <TableCell sx={{ color: '#fff' }}>Jumlah Total</TableCell>

                {filterTipe === 'pinjam' && (
                  <TableCell sx={{ color: '#fff' }}>
                    Sisa Bisa Dipinjam
                  </TableCell>
                )}

                <TableCell sx={{ color: '#fff' }} align="center">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {inventories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={filterTipe === 'pinjam' ? 5 : 4}
                    align="center"
                  >
                    Tidak ada data inventori
                  </TableCell>
                </TableRow>
              ) : (
                inventories.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.nama_barang}</TableCell>
                    <TableCell>{item.jumlah_total}</TableCell>

                    {filterTipe === 'pinjam' && (
                      <TableCell>{item.sisa_bisa_dipinjam}</TableCell>
                    )}

                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => openDialogForm(item)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ================= PEMINJAMAN (HANYA PINJAM) ================= */}
      {filterTipe === 'pinjam' && (
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <PeopleIcon color="secondary" />
            <Typography variant="h5" fontWeight="bold" color="secondary">
              Data Peminjaman (Sedang Dipinjam)
            </Typography>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#9c27b0' }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff' }}>No</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Nama Peminjam</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Barang</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Jumlah</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Tanggal Pinjam</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Tanggal Sampai</TableCell>
                  <TableCell sx={{ color: '#fff' }}>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {peminjaman.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Tidak ada data peminjaman aktif
                    </TableCell>
                  </TableRow>
                ) : (
                  peminjaman.map((item, index) => {
                    const today = new Date();
                    const tanggalSampai = item.tanggal_sampai
                      ? new Date(item.tanggal_sampai)
                      : null;

                    const terlambat =
                      tanggalSampai && today > tanggalSampai;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.User?.name}</TableCell>
                        <TableCell>{item.Inventory?.nama_barang}</TableCell>
                        <TableCell>{item.jumlah_pinjam}</TableCell>

                        <TableCell>
                          {new Date(item.tanggal_pinjam).toLocaleDateString(
                            'id-ID'
                          )}
                        </TableCell>

                        <TableCell>
                          {item.tanggal_sampai
                            ? new Date(item.tanggal_sampai).toLocaleDateString(
                                'id-ID'
                              )
                            : '-'}
                        </TableCell>

                        <TableCell>
                          <Typography
                            fontWeight="bold"
                            color={terlambat ? 'error' : 'success.main'}
                          >
                            {terlambat ? 'Terlambat' : 'Aktif'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ================= DIALOG ================= */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>
          {selectedInventory ? 'Edit Inventori' : 'Tambah Inventori'}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Nama Barang"
              name="nama_barang"
              value={formData.nama_barang}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Jumlah"
              name="jumlah"
              type="number"
              value={formData.jumlah}
              onChange={handleChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Tipe Inventori</InputLabel>
              <Select
                name="tipe_inventori"
                value={formData.tipe_inventori}
                label="Tipe Inventori"
                onChange={handleChange}
              >
                <MenuItem value="data">Pencatatan Data</MenuItem>
                <MenuItem value="pinjam">Bisa Dipinjam</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InventoryManagement;
