import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Paper,
} from "@mui/material";
import {
  Refresh,
  Description,
  Visibility,
  Close,
  BarChart,
  Mail,
  Done,
  Clear,
  CheckCircle,
  Cancel,
  Download,
} from "@mui/icons-material";

const Surat = () => {
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [availableYears, setAvailableYears] = useState([]);
  const [year, setYear] = useState(null);
  const [statistik, setStatistik] = useState({
    total: 0,
    pending: 0,
    diterima: 0,
    ditolak: 0,
  });

  const [openPreview, setOpenPreview] = useState(false);
  const [selectedSurat, setSelectedSurat] = useState(null);

  /* ================= FETCH ================= */
  const fetchSurat = async (selectedYear) => {
    try {
      const res = await axios.get("http://localhost:3000/api/surat/domisili");
      const allData = res.data || [];

      const years = [
        ...new Set(
          allData.map((s) =>
            new Date(s.createdAt || s.tanggal_surat).getFullYear()
          )
        ),
      ].sort((a, b) => b - a);

      setAvailableYears(years);
      const activeYear = selectedYear || years[0];
      setYear(activeYear);

      const statRes = await axios.get(
        `http://localhost:3000/api/surat/domisili/total?year=${activeYear}`
      );
      setStatistik(statRes.data);

      setSuratList(
        allData.filter(
          (s) =>
            new Date(s.createdAt || s.tanggal_surat).getFullYear() ===
            Number(activeYear)
        )
      );
    } catch {
      Swal.fire("Gagal", "Tidak dapat memuat data surat", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurat();
  }, []);

  /* ================= TERIMA ================= */
  const handleTerima = async (id) => {
    const confirm = await Swal.fire({
      title: "Terima surat?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Terima",
    });
    if (!confirm.isConfirmed) return;

    await axios.put(`http://localhost:3000/api/surat/domisili/${id}/terima`);
    Swal.fire("Berhasil", "Surat diterima", "success");
    fetchSurat(year);
  };

  /* ================= TOLAK ================= */
  const handleTolak = async (id) => {
    const confirm = await Swal.fire({
      title: "Tolak surat?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Tolak",
    });
    if (!confirm.isConfirmed) return;

    await axios.put(`http://localhost:3000/api/surat/domisili/${id}/tolak`);
    Swal.fire("Ditolak", "Surat ditolak", "success");
    fetchSurat(year);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" height="80vh">
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Card elevation={3}>
        <CardContent>

          {/* HEADER */}
          <Stack direction="row" justifyContent="space-between" mb={3}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Description color="primary" />
              <Typography variant="h5" fontWeight="bold" color="primary">
                Kelola Surat Domisili
              </Typography>
            </Stack>

            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={() => fetchSurat(year)}
            >
              Refresh
            </Button>
          </Stack>

          {/* FILTER */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "#f9fafb" }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography fontWeight="bold">📅 Filter Tahun</Typography>
              <select
                value={year || ""}
                onChange={(e) => fetchSurat(e.target.value)}
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <Chip label={`Tahun ${year}`} color="primary" variant="outlined" />
            </Stack>
          </Paper>

          {/* STATISTIK */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
            {[
              ["Total Surat", statistik.total, "#1976d2", <BarChart />],
              ["Pending", statistik.pending, "#0288d1", <Mail />],
              ["Diterima", statistik.diterima, "#2e7d32", <Done />],
              ["Ditolak", statistik.ditolak, "#d32f2f", <Clear />],
            ].map(([label, value, color, icon]) => (
              <Paper key={label} sx={{ p: 2, flex: 1, borderLeft: `6px solid ${color}` }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {icon}
                  <Box>
                    <Typography variant="subtitle2">{label}</Typography>
                    <Typography variant="h4" fontWeight="bold">{value}</Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>

          {/* TABLE */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: "#1976d2" }}>
                <TableRow>
                  {["No", "Nama", "Nomor", "Tanggal", "Status", "Aksi"].map((h) => (
                    <TableCell key={h} sx={{ color: "#fff" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {suratList.map((s, i) => (
                  <TableRow key={s.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{s.nama}</TableCell>
                    <TableCell>{s.nomor_surat}</TableCell>
                    <TableCell>{s.tanggal_surat}</TableCell>

                    <TableCell align="center">
                      <Chip
                        label={s.status}
                        color={
                          s.status === "Diterima"
                            ? "success"
                            : s.status === "Ditolak"
                            ? "error"
                            : "warning"
                        }
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      {s.status === "Pending" ? (
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button size="small" color="success" variant="contained"
                            startIcon={<CheckCircle />}
                            onClick={() => handleTerima(s.id)}>
                            Terima
                          </Button>
                          <Button size="small" color="error" variant="contained"
                            startIcon={<Cancel />}
                            onClick={() => handleTolak(s.id)}>
                            Tolak
                          </Button>
                          <Button size="small" variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => { setSelectedSurat(s); setOpenPreview(true); }}>
                            Lihat
                          </Button>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button size="small" variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => { setSelectedSurat(s); setOpenPreview(true); }}>
                            Lihat
                          </Button>

                          {s.status === "Diterima" && s.filePath && (
                            <IconButton
                              color="primary"
                              component="a"
                              href={`http://localhost:3000${s.filePath}`}
                              target="_blank"
                            >
                              <Download />
                            </IconButton>
                          )}
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </CardContent>
      </Card>

      {/* PREVIEW */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} fullWidth maxWidth="md">
        <DialogTitle>
          Preview Surat Domisili
          <IconButton onClick={() => setOpenPreview(false)} sx={{ float: "right" }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Paper sx={{ p: 3 }}>
            <Typography align="center" fontWeight="bold" mb={2}>
              DATA PEMOHON
            </Typography>

            <Grid container spacing={2}>
              {[
                ["Nama", selectedSurat?.nama],
                ["NIK", selectedSurat?.nik],
                ["TTL", selectedSurat?.ttl],
                ["Jenis Kelamin", selectedSurat?.jenis_kelamin],
                ["Agama", selectedSurat?.agama],
                ["Pekerjaan", selectedSurat?.pekerjaan],
                ["Alamat Asal", selectedSurat?.alamat_asal],
                ["Alamat Domisili", selectedSurat?.alamat_domisili],
                ["RT / RW", `${selectedSurat?.rt} / ${selectedSurat?.rw}`],
                ["Lama Menetap", selectedSurat?.lama_menetap],
                ["Status Tempat Tinggal", selectedSurat?.status_tempat_tinggal],
                ["Keperluan Surat", selectedSurat?.keperluan_surat],
              ].map(([label, value]) => (
                <Grid item xs={12} sm={6} key={label}>
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                  <Typography fontWeight={500}>{value || "-"}</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Surat;
