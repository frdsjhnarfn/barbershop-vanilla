<div align="center">
  
# ✂️ BarberShop.
### *The Art of Refinement.*

Aplikasi pemesanan layanan barbershop premium berbasis web yang dibangun dengan HTML, CSS, dan Vanilla JavaScript. Mengusung desain *Editorial Minimalist* yang terinspirasi dari website *high-fashion*, aplikasi ini tidak hanya fungsional tetapi juga memberikan pengalaman visual yang mewah bagi pelanggan.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

---

## 📖 Tentang Proyek

**BarberShop** adalah solusi *end-to-end* untuk manajemen pemesanan (booking) barbershop. Proyek ini memisahkan secara jelas antara *Client Area* (tempat pelanggan memesan) dan *Admin Area* (tempat pengelola mengatur jadwal dan data master).

### ✨ Fitur Utama

**Untuk Pelanggan (Client):**
- 🎨 **Premium UI/UX**: Desain antarmuka bergaya majalah mode dengan animasi transisi yang halus.
- 💈 **Visual Hair Style**: Memilih jenis potongan rambut kini dilakukan secara visual menggunakan foto, bukan sekadar teks.
- 📅 **Real-time Booking**: Pemesanan jadwal dengan validasi otomatis untuk mencegah bentrok jadwal (*double-booking*).
- 🧾 **Cek Pesanan**: Pelanggan dapat melacak status pesanan dan membatalkannya sendiri menggunakan nomor HP.

**Untuk Pengelola (Admin):**
- 🔐 **Secure Authentication**: Sistem login khusus admin menggunakan Supabase Auth.
- 📊 **Dashboard Interaktif**: Melihat seluruh daftar pesanan yang masuk secara *real-time*.
- ⚙️ **Manajemen Data Master**: Menambah atau menghapus daftar Layanan (Services) dan Barber langsung dari web.
- ✅ **Status Management**: Mengubah status pesanan dari *Confirmed* menjadi *Completed*.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini sengaja dibangun tanpa *framework* frontend yang berat (seperti React/Next.js) untuk mengeksplorasi kemampuan maksimal dari fondasi web modern:

*   **Frontend**: HTML5 Semantic, CSS3 (Custom Properties, Flexbox, CSS Grid), Vanilla JavaScript (ES6+).
*   **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Authentication).
*   **Typography**: Google Fonts (*Playfair Display* & *Inter*).

---

🔐 Akses Administrator (Demo)
Untuk mencoba fitur Dashboard Admin, Anda dapat menggunakan kredensial dummy berikut.
Email: admin@barbershop.com
Password: admin12345