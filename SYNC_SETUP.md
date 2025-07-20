# 🚀 AKB Feedback - Setup Server untuk Sync Android & Web

## 📋 Status Setup

✅ **Server dibuat** - Express.js di port 3001  
✅ **Dependencies installed** - express, cors, body-parser  
✅ **API Service dibuat** - untuk koneksi dari aplikasi  
✅ **Context updated** - dengan server sync capabilities  
✅ **UI updated** - dengan status online/offline indicator  

## 🔧 Cara Setup & Test

### 1. **Jalankan Server**
```bash
cd server
node index.js
```
Server akan jalan di: http://localhost:3001

### 2. **Cari IP Address Komputer (untuk Android)**
```bash
ipconfig
```
Cari bagian "Wireless LAN adapter Wi-Fi" atau "Ethernet adapter"  
Contoh IP: `192.168.1.100`, `192.168.0.100`, `10.0.0.100`

### 3. **Update IP di Code**
File: `src/services/apiService.js`
```javascript
baseURL: Platform.OS === 'web' 
  ? 'http://localhost:3001' 
  : 'http://192.168.1.XXX:3001', // 👈 Ganti XXX dengan IP Anda
```

### 4. **Test Server API**
Buka: `server-test.html` di browser untuk test semua endpoint

### 5. **Jalankan Aplikasi**
```bash
npm start
```

## 🎯 Hasil yang Diharapkan

### **Web Browser:**
- ✅ Feedback langsung tersimpan ke server
- ✅ Status: 🟢 Online 
- ✅ Real-time sync dengan Android

### **Android (Expo):**
- ✅ Feedback langsung tersimpan ke server  
- ✅ Status: 🟢 Online (jika IP benar)
- ✅ Real-time sync dengan Web

### **Test Skenario:**
1. Buka Web → Add feedback → Lihat di server-test.html
2. Buka Android → Add feedback → Refresh Web, feedback muncul  
3. Delete di Web → Refresh Android, feedback hilang
4. Clear all di Android → Refresh Web, semua kosong

## 🔧 Troubleshooting

### **Android menunjukkan 🔴 Offline:**
- Pastikan IP address benar di `apiService.js`
- Pastikan komputer dan HP di WiFi yang sama
- Test ping dari HP ke komputer

### **Server Error:**
- Pastikan port 3001 tidak dipakai aplikasi lain
- Restart server: `Ctrl+C` lalu `node index.js` lagi

### **Data tidak sync:**
- Cek console log di aplikasi
- Test manual via server-test.html
- Pastikan kedua platform online

## 📱 Fitur Baru di Aplikasi

### **Status Indicator:**
- 🟢 **Online**: Data sync dengan server
- 🔴 **Offline**: Data tersimpan lokal saja

### **Tombol Sync Manual:**
- **Online**: Sync data terbaru dari server
- **Offline**: Coba koneksi ulang ke server

### **Automatic Sync:**
- Auto sync setiap 30 detik
- Sync saat aplikasi dibuka
- Sync setelah add/delete feedback

## 🎉 Keuntungan

✅ **Data Konsisten**: Android & Web selalu sama  
✅ **Real-time Updates**: Perubahan langsung terlihat  
✅ **Offline Support**: Masih bisa kerja tanpa internet  
✅ **Centralized**: Satu database untuk semua platform  
✅ **Scalable**: Mudah tambah platform baru  

---

**Next Steps:** Jalankan server, update IP address, dan test di kedua platform! 🚀
