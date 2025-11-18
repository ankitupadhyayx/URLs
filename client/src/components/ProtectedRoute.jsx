import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, backendUrl = "https://urls-backend-cm9v.onrender.com" }) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      setLoading(false);
      setOk(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${backendUrl}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Invalid");
        await res.json();
        setOk(true);
      } catch {
        localStorage.removeItem("admin-token");
        setOk(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-10">Checking auth...</div>;
  return ok ? children : <Navigate to="/admin-login" replace />;
}
