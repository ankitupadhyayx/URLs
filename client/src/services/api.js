const API_BASE = 'http://localhost:5000/api';

export async function shortenUrl(originalUrl) {
  const res = await fetch(`${API_BASE}/url/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalUrl })
  });
  return res.json();
}

export async function fetchUrls() {
  const res = await fetch(`${API_BASE}/url/list/all`);
  return res.json();
}
