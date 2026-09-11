// src/pages/admin/DashboardBeranda.jsx
import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Container,
  Stack,
  Divider,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function DashboardBeranda() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #f8f9fa, #e0eafc)',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            background: 'white',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Stack spacing={2} alignItems="center">
            <AdminPanelSettingsIcon
              sx={{ fontSize: 60, color: '#1976d2', mb: 1 }}
            />
            <Typography variant="h4" fontWeight="bold" color="primary">
              Selamat Datang 
            </Typography>
            <Typography variant="h5" fontWeight={500}>
              Dashboard Admin Padukuhan V
            </Typography>
            <Divider flexItem sx={{ my: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Gunakan menu navigasi di samping untuk mengelola <strong>Pengaduan</strong>, <strong>Inventori</strong>, <strong>Kegiatan</strong>, dan <strong>Surat Domisili</strong>. Akses cepat, efisien, dan terorganisir untuk administrasi padukuhan Anda.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
