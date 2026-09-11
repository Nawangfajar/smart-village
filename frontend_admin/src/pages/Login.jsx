import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

        :root{
          --blue-900: #002e72;
          --blue-800: #003b95;
          --accent: #2D62ED;
          --card-bg: #ffffff;
          --muted: #6b7280;
        }

        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: 'Poppins', sans-serif;
        }

        .login-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(1200px 600px at 10% 10%, rgba(45,98,237,0.06), transparent 10%),
                      linear-gradient(180deg, #eef6ff 0%, #e6f0ff 50%, #f8fbff 100%);
          padding: 32px;
        }

        .login-card {
          width: 100%;
          max-width: 860px;
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 24px;
          align-items: center;
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.96));
          border-radius: 16px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
          overflow: hidden;
        }

        /* LEFT: illustration + small accent strip */
        .illustration {
          padding: 40px 36px;
          background: linear-gradient(180deg, var(--blue-800), var(--blue-900));
          color: white;
          min-height: 360px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 18px;
        }

        .ill-svg {
          width: 180px;
          height: auto;
          filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.18));
        }

        .ill-title {
          font-size: 20px;
          font-weight: 700;
        }

        .ill-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.9);
          text-align: center;
          max-width: 260px;
          line-height: 1.4;
        }

        /* RIGHT: form */
        .login-form {
          padding: 36px 40px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 10px;
        }

        .brand img {
          width: 64px;
          height: 64px;
          object-fit: contain;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(45,98,237,0.06), rgba(0,59,149,0.04));
          padding: 6px;
        }

        .brand h1 {
          margin: 0;
          font-size: 20px;
          color: var(--blue-900);
          font-weight: 700;
        }

        .brand p {
          margin: 0;
          color: var(--muted);
          font-size: 13px;
        }

        h2.center {
          text-align: left;
          margin: 8px 0 12px;
          color: var(--blue-900);
          font-size: 20px;
        }

        .form {
          margin-top: 6px;
        }

        label {
          display: block;
          font-size: 13px;
          color: var(--muted);
          margin-bottom: 8px;
        }

        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #d6e1f7;
          background: #fbfdff;
          font-size: 14px;
          color: #111827;
          outline: none;
          transition: box-shadow .18s ease, border-color .18s ease, transform .08s ease;
        }

        .input:focus {
          border-color: var(--accent);
          box-shadow: 0 6px 20px rgba(45,98,237,0.12);
        }

        .field {
          margin-bottom: 14px;
        }

        .pw-row {
          position: relative;
        }

        .toggle-pw {
          position: absolute;
          right: 10px;
          top: 8px;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toggle-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          color: var(--muted);
          padding: 6px;
          border-radius: 6px;
        }

        .error {
          color: #d32f2f;
          font-size: 13px;
          margin: 8px 0 12px;
        }

        .cta {
          margin-top: 8px;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .btn {
          flex: 1;
          padding: 12px 14px;
          border-radius: 10px;
          border: none;
          font-weight: 700;
          background: linear-gradient(90deg, var(--accent), var(--blue-800));
          color: white;
          cursor: pointer;
          transition: transform .12s ease, box-shadow .12s ease, opacity .12s;
          box-shadow: 0 8px 18px rgba(45,98,237,0.18);
        }

        .btn:active { transform: translateY(1px) scale(.998); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }

        .meta {
          margin-top: 14px;
          font-size: 13px;
          color: var(--muted);
        }

        /* responsive */
        @media (max-width: 880px) {
          .login-card { grid-template-columns: 1fr; max-width: 540px; }
          .illustration { padding: 28px; min-height: 160px; }
          .ill-svg { width: 140px; }
          .login-form { padding: 28px; }
          .brand img { width: 56px; height: 56px; }
        }

      `}</style>

      <div className="login-wrap" role="main">
        <div className="login-card" aria-labelledby="login-heading">
          {/* LEFT - Illustration */}
          <div className="illustration" aria-hidden>
            {/* Tech/secure SVG illustration (keamanan/tech) */}
            <svg className="ill-svg" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="6" y="12" width="60" height="48" rx="6" fill="#fff" opacity="0.06"/>
              <rect x="10" y="16" width="52" height="20" rx="3" fill="#fff" opacity="0.08"/>
              <rect x="16" y="22" width="18" height="4" rx="1.5" fill="#fff"/>
              <rect x="16" y="28" width="28" height="6" rx="2" fill="#fff" opacity="0.9"/>
              <g transform="translate(20,36)">
                <rect x="0" y="0" width="32" height="12" rx="3" fill="#fff" opacity="0.06"/>
                <circle cx="6" cy="6" r="3" fill="#fff"/>
                <rect x="12" y="3" width="12" height="6" rx="1" fill="#2D62ED"/>
              </g>
              <g transform="translate(44,36)">
                <rect x="0" y="0" width="16" height="12" rx="2" fill="#fff" opacity="0.06"/>
                <path d="M4 2 C6 0 12 0 12 2" stroke="#fff" strokeWidth="0.8" opacity="0.9"/>
                <rect x="4" y="6" width="8" height="3" rx="1" fill="#2D62ED"/>
              </g>
            </svg>

            <div className="ill-title">Aman & Mudah</div>
            <div className="ill-desc">
              Akses dashboard Padukuhan V dengan aman.
            </div>
          </div>

          {/* RIGHT - Form */}
          <div className="login-form">
            <div className="brand">
              {/* logo — replace /public/logo.png with your own image (square) */}
              <img src="/login.jpg" alt="Logo" />
              <div>
                <h1>Padukuhan V Admin</h1>
                <p>Kelola pengaduan · inventori · kegiatan · Surat Domisili </p>
              </div>
            </div>

            <h2 id="login-heading" className="center">Masuk ke Dashboard</h2>

            <form className="form" onSubmit={handleLogin} aria-describedby="login-desc">
              <div className="field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  className="input"
                  value={username}
                  autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="field pw-row">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className="input"
                  type={showPw ? "text" : "password"}
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="toggle-pw" aria-hidden>
                  <button
                    type="button"
                    className="toggle-btn"
                    onClick={() => setShowPw((s) => !s)}
                    title={showPw ? "Sembunyikan password" : "Tampilkan password"}
                    aria-pressed={showPw}
                  >
                    {showPw ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3l18 18" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.58 10.58A3 3 0 0 0 13.42 13.42" stroke="#6B7280" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2.9 12.14C4.6 8.6 8 6 12 6c1.3 0 2.5.3 3.6.86" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 21c-1.7 3-5.1 5-9 5-4 0-7.4-2-9-5" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <div className="error" role="alert">{error}</div>}

              <div className="cta">
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? "Memeriksa..." : "Masuk"}
                </button>
              </div>

              <div className="meta" id="login-desc">
                Jika mengalami masalah login, hubungi admin padukuhan.
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
