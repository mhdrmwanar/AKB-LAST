# Live Feedback Survey App

Aplikasi feedback live untuk survey dengan fitur realtime dan visualisasi.

## Fitur Utama

- ✅ **Kirim feedback realtime** - Submit feedback langsung tanpa delay
- ✅ **Visualisasi hasil** - Chart statistik dan word cloud realtime
- ✅ **Fitur anonymous** - Mode anonim untuk privasi pengguna

## Struktur Aplikasi

```
App.js                          # Main app dengan navigation
src/
├── context/
│   └── FeedbackContext.js      # State management global
└── screens/
    ├── HomeScreen.js           # Landing page dengan statistik
    ├── FeedbackScreen.js       # Form submit feedback
    └── ResultsScreen.js        # Dashboard visualisasi
```

## Cara Menjalankan

```bash
npm install
npm start
```

Scan QR code dengan Expo Go app di ponsel atau jalankan di emulator.

## Fitur Detail

### Home Screen

- Menampilkan total feedback dan rating rata-rata
- Tombol navigasi ke Submit Feedback dan View Results
- Indikator fitur utama aplikasi

### Feedback Screen

- Toggle anonymous mode
- Input nama (jika tidak anonymous)
- Rating bintang 1-5
- Text area untuk feedback
- Submit realtime ke storage

### Results Screen

- Tab Statistics: Chart pie sentiment, bar chart rating
- Tab Word Cloud: Visualisasi kata-kata populer
- Tab Recent: List feedback terbaru
- Live indicator dengan refresh
- Tombol clear data

## Teknologi

- React Native + Expo
- React Navigation
- AsyncStorage untuk persistensi data lokal
- React Native Chart Kit untuk visualisasi
- Context API untuk state management

## Data Flow

1. User submit feedback → FeedbackContext
2. Context update stats & word cloud data
3. Data disimpan ke AsyncStorage
4. Semua screen update realtime
5. Results screen menampilkan visualisasi live

## Penggunaan

1. **Submit Feedback**: Pilih anonymous/named → Rating → Text → Submit
2. **View Results**: Lihat statistik, word cloud, dan feedback terbaru
3. **Real-time**: Semua perubahan langsung terlihat di Results

Aplikasi siap digunakan untuk event, survey, atau feedback collection realtime!
