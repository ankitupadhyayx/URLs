// Use your live Render backend URL
const API_BASE = 'https://urls-backend-cm9v.onrender.com/api';

// CREATE short URL
export async function shortenUrl(originalUrl) {
  const res = await fetch(`${API_BASE}/url/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl })
  });
  return res.json();
}

// GET all URLs
export async function fetchUrls() {
  const res = await fetch(`${API_BASE}/url/list/all`);
  return res.json();
}

// DELETE a URL
export async function deleteUrl(id) {
  const res = await fetch(`${API_BASE}/url/${id}`, { method: 'DELETE' });
  return res.json();
}
