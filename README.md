# SkinSpace AR

> Explore skincare in 3D & Augmented Reality — directly from your browser.

SkinSpace AR adalah aplikasi edukasi skincare berbasis web yang memungkinkan
pengguna menjelajahi produk skincare dalam bentuk model 3D interaktif melalui
**marker-based AR** (Hiro marker) atau **3D Sandbox mode** — tanpa perlu
instalasi aplikasi.

## ✨ Features

- 🧴 **Product Explorer** — Grid produk dengan filter kategori (Serum, Cleanser, Moisturizer)
- 📖 **Product Detail** — Informasi lengkap: manfaat, tipe kulit, key ingredients
- 🕶 **AR Scanner** — Pindai Hiro marker untuk memunculkan model 3D produk
- 🎮 **3D Sandbox Mode** — Fallback tanpa kamera untuk desktop & device tanpa webcam
- 📱 **Responsive** — Optimal di desktop & mobile
- ⚡ **Zero Install** — 100% browser-based (HTML5 + WebGL + WebRTC)
- 🔗 **Hash Router** — Navigasi tanpa reload

## 🛠 Tech Stack

| Teknologi | Fungsi |
|-----------|--------|
| Vanilla JavaScript (ES Modules) | Logika & routing |
| A-Frame | Scene 3D deklaratif |
| AR.js | Marker-based AR tracking |
| WebGL | Rendering 3D |
| WebRTC | Akses kamera |
| CSS Custom Properties | Theming |

## 🚀 Quick Start

```bash
# Clone repo
git clone https://github.com/<username>/skinspace-ar.git
cd skinspace-ar

# Jalankan local server
python -m http.server 8000
# atau
npx http-server -p 8000