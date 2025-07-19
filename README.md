# 📊 Live Feedback Survey App

Aplikasi survey feedback realtime dengan visualisasi langsung menggunakan React Native dan Expo.

## ✨ Fitur Utama

### 🔐 Sistem Autentikasi

- Login admin dan user
- Mode anonymous untuk feedback
- Akun demo tersedia

### 📋 Survey Management

- Buat survey dengan berbagai tipe pertanyaan
- Kelola status survey (aktif/nonaktif)
- Tipe pertanyaan: Text, Rating (1-5), Yes/No

### 📊 Visualisasi Realtime

- **Statistik Live**: Total feedback, rata-rata rating
- **Sentiment Analysis**: Analisis otomatis positif/negatif/netral
- **Word Cloud**: Kata-kata yang paling sering muncul
- **Recent Feedbacks**: Feedback terbaru dari peserta
- **Charts**: Pie chart untuk distribusi sentiment

### 👥 Mode Anonymous

- Peserta dapat submit feedback tanpa identitas
- Pilihan untuk menggunakan nama atau anonymous

## 🚀 Cara Menjalankan

### Prerequisites

- Node.js (v14 atau lebih baru)
- Expo CLI
- Expo Go app di smartphone

### Instalasi

1. Clone atau download project ini
2. Buka terminal di folder project
3. Install dependencies:
   ```bash
   npm install
   ```
4. Jalankan aplikasi:
   ```bash
   npx expo start
   ```
5. Scan QR code dengan Expo Go app

## 👤 Akun Demo

### Admin

- **Username**: `admin`
- **Password**: `admin123`
- **Fitur**: Buat survey, lihat hasil, kelola survey

### User

- **Username**: `user`
- **Password**: `user123`
- **Fitur**: Submit feedback, lihat hasil

## 📱 Cara Menggunakan

### Untuk Admin:

1. Login dengan akun admin
2. Lihat daftar survey di halaman utama
3. Tap tombol "+" untuk membuat survey baru
4. Tambahkan pertanyaan dengan tipe yang berbeda
5. Survey otomatis aktif setelah dibuat
6. Lihat hasil realtime di "View Results"

### Untuk Peserta:

1. Login dengan akun user atau admin
2. Pilih survey yang tersedia
3. Tap "Submit Feedback"
4. Pilih mode anonymous atau gunakan nama
5. Jawab semua pertanyaan
6. Submit feedback
7. Lihat hasil realtime

## 🎯 Fitur Realtime

### Auto-Refresh

- Dashboard hasil di-refresh otomatis setiap 3 detik
- Indikator "LIVE" menunjukkan data realtime
- Loading indicator saat refresh

### Sentiment Analysis

Sistem otomatis menganalisis sentiment dari text response:

- **Positif**: Kata-kata seperti "good", "great", "excellent"
- **Negatif**: Kata-kata seperti "bad", "terrible", "awful"
- **Netral**: Tidak terdeteksi sentiment positif/negatif

### Word Cloud

- Ekstraksi kata-kata dari semua text response
- Filter kata-kata umum (stop words)
- Ukuran kata sesuai frekuensi kemunculan

## 🛠️ Teknologi

- **React Native** - Framework mobile
- **Expo** - Development platform
- **React Navigation** - Navigation
- **AsyncStorage** - Local storage
- **React Native Chart Kit** - Visualisasi chart
- **React Native SVG** - Graphics

## 📊 Struktur Data

### Survey

```json
{
  "id": 1,
  "title": "Product Satisfaction Survey",
  "description": "Help us improve our product",
  "questions": [
    {
      "id": 1,
      "text": "How satisfied are you?",
      "type": "rating"
    }
  ],
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Feedback

```json
{
  "id": "123456789",
  "surveyId": 1,
  "answers": [5, "Great product!", true],
  "isAnonymous": false,
  "participantName": "John Doe",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "sentiment": "positive"
}
```

## 🎨 Desain

- **Material Design** inspired
- **Responsive** layout
- **Dark/Light** theme support
- **Smooth animations**
- **Professional** color scheme

## 🔄 Alur Aplikasi

1. **Login** → Pilih role (admin/user)
2. **Survey List** → Lihat survey yang tersedia
3. **Submit Feedback** → Isi feedback untuk survey
4. **View Results** → Lihat visualisasi realtime
5. **Create Survey** → (Admin only) Buat survey baru

## 📈 Metrics yang Ditampilkan

- Total feedback yang diterima
- Rata-rata rating (untuk pertanyaan rating)
- Distribusi sentiment (positif/netral/negatif)
- Word cloud dari text responses
- Timeline feedback terbaru
- Statistik per survey

## 🚧 Pengembangan Selanjutnya

- [ ] WebSocket untuk realtime yang lebih responsif
- [ ] Export hasil ke PDF/Excel
- [ ] Notifikasi push untuk feedback baru
- [ ] Analitik yang lebih advanced
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Offline support

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat issue di repository atau hubungi developer.

---

**Happy Surveying! 📊✨**
