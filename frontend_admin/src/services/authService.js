export async function loginAdmin(credentials) {
  const response = await fetch('http://localhost:3000/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
  if (!response.ok) throw new Error('Gagal login')
  return response.json()
}
