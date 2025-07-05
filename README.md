
# 📤 V2-AUTOSENDER-MASDAV

**Bot WhatsApp Otomatis • Interaktif • Aman • Cepat**  
Dirancang untuk mengirim pesan massal ke WhatsApp dengan sistem owner, tombol interaktif, dan keamanan penuh.

![whatsapp-bot](https://img.shields.io/badge/whatsapp-bot-green?style=flat-square)
![node.js](https://img.shields.io/badge/node.js-18.x-green?style=flat-square)
![stable](https://img.shields.io/badge/stable-v2-blue?style=flat-square)

---

## ✨ FITUR UTAMA

| Fitur                              | Penjelasan                                                                 |
|------------------------------------|----------------------------------------------------------------------------|
| ✅ Auto Kirim Pesan                | Mengirim pesan ke banyak nomor dari `nomor.txt`                           |
| ⏳ Delay Otomatis                 | Jeda 3 menit setiap 5 nomor (anti spam block)                             |
| 🔐 Sistem Owner                   | Hanya nomor yang terdaftar yang dapat mengontrol bot                      |
| 📄 Update Pesan & Nomor          | Langsung dari WhatsApp tanpa perlu buka file                              |
| 🧠 Get ID & Member Grup          | Ambil ID grup dan daftar nomor anggotanya                                 |
| 📂 Logging Lengkap               | Simpan semua hasil sukses & gagal ke folder `logs/`                       |
| 📲 Tombol Interaktif             | Setiap pesan memiliki tombol "Profil Perusahaan" & "Kontak Admin"         |
| 🛡️ Anti Akses Liar               | Non-owner tidak akan mendapat respon apapun                               |

---

## ⚙️ PENGINSTALAN

### 1. Clone Repository

```bash
git clone https://github.com/username/V2-AUTOSENDER-MASDAV.git
cd V2-AUTOSENDER-MASDAV
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Jalankan Bot

```bash
node index.js
```

📱 Scan QR code yang muncul untuk login ke WhatsApp Web.

---

## 🧾 PENGGUNAAN

### 📋 Perintah WhatsApp (hanya untuk Owner)

| Perintah                    | Fungsi                                                     |
| --------------------------- | ---------------------------------------------------------- |
| `.menu`                     | Tampilkan menu utama & status sistem                       |
| `.updatepesan <teks>`       | Update isi pesan yang dikirim ke semua nomor               |
| `.updateno <628xxx,...>`    | Update daftar nomor yang akan dikirimi                     |
| `.mulai`                    | Kirim pesan ke semua nomor di `nomor.txt`                  |
| `.getidgroup`               | Tampilkan semua ID grup yang bot ikuti                     |
| `.getmembergroup <id grup>` | Tampilkan semua nomor dari grup tertentu                   |
| `.updateprofile <teks>`     | Update profil perusahaan (ditampilkan saat tombol ditekan) |
| `.updateadmin <teks>`       | Update kontak admin utama                                  |
| `.listowner`                | Tampilkan semua nomor owner                                |
| `.addowner <628xxx>`        | Tambahkan nomor owner                                      |
| `.delowner <628xxx>`        | Hapus owner                                                |

### 📥 Format Kirim Pesan

Setelah `.mulai`, setiap pesan akan dikirim ke nomor dalam `nomor.txt` dan disertai dengan 2 tombol:

- 📄 **Profil Perusahaan** → Menampilkan isi dari `profile.txt`
- ☎️ **Kontak Admin Utama** → Menampilkan isi dari `admin_contact.txt`

---

## 🗂️ STRUKTUR FILE

```
V2-AUTOSENDER-MASDAV/
│
├── index.js                # Main bot
├── pesan.txt               # Isi pesan
├── nomor.txt               # Nomor-nomor tujuan
├── profile.txt             # Profil perusahaan
├── admin_contact.txt       # Kontak admin utama
├── owners.json             # Daftar owner
├── /logs/                  # success.txt & failed.txt
└── /utils/                 # validate.js & logger.js
```

---

## 📄 CONTOH ISI FILE

**pesan.txt**

```
Halo, ini informasi penting dari PT Pilar Legal Utama.
Silakan cek tombol di bawah untuk info perusahaan & kontak admin.
```

**nomor.txt**

```
6281234567890
6289876543210
```

**profile.txt**

```
PT Pilar Legal Utama adalah perusahaan jasa legal yang membantu pembuatan PT, CV, Yayasan, PMA, dan lainnya.
Kami siap bantu legalitas bisnis Anda.
```

**admin_contact.txt**

```
👤 Nama: Dava
📱 WhatsApp: 0812-3456-7890
📧 Email: dava@example.com
```

---

## 🧑‍💼 DEVELOPER

**masdav**  
📷 Instagram: [@d4vrk_](https://instagram.com/d4vrk_)

---

## ⚠️ DISCLAIMER

Bot ini hanya untuk keperluan edukasi, bisnis legal, dan kampanye resmi.  
Gunakan dengan bijak dan tidak untuk spam.  
Semua risiko penyalahgunaan ditanggung pengguna.

---

## 📜 LISENSI

MIT License — Bebas digunakan & dimodifikasi dengan tetap mencantumkan kredit.

---

> ⭐ Jangan lupa kasih ⭐️ bintang repo ini jika membantu!
