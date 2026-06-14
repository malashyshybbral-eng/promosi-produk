// GANTI DENGAN URL DEPLOYMENT WEB APP APPS SCRIPT ANDA
const API_URL = "https://script.google.com/macros/s/AKfycbyGBGm3vjdv6VCM4XEeianKCKz9AHz9nkeYgrCNDfYRn1FHGIDP6WILGeMM549YYdK-/exec";

const API = {
  async get(action) {
    try {
      const response = await fetch(`${API_URL}?action=${action}`);
      const res = await response.json();
      if(res.status === "error") throw new Error(res.message);
      return res.data;
    } catch (error) {
      showToast(error.message, "error");
      console.error(error);
    }
  },

  async post(action, data = {}, id = null) {
    try {
      const payload = { action, data, id };
      const response = await fetch(API_URL, {
        method: "POST",
        mode: "no-cors", // Mengatasi CORS isu standard Google Script POST redirect
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      // Karena no-cors, data balikan tidak bisa dibaca langsung, asumsikan sukses/reload.
      return { status: "success" };
    } catch (error) {
      showToast("Gagal memproses data", "error");
      console.error(error);
    }
  }
};