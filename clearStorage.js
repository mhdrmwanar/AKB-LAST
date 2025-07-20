// Script untuk membersihkan storage agar dashboard benar-benar kosong
// Jalankan di browser console atau dengan Node.js

if (typeof localStorage !== 'undefined') {
  // Web storage cleanup
  localStorage.removeItem('feedbacks');
  localStorage.removeItem('feedbackStats');
  console.log('Web localStorage berhasil dibersihkan');
} else if (typeof require !== 'undefined') {
  // React Native AsyncStorage cleanup (untuk testing)
  console.log(
    'Untuk React Native, gunakan fungsi clearAllFeedbacks di aplikasi'
  );
}

console.log(
  'Storage cleanup selesai. Dashboard akan kosong pada startup berikutnya.'
);
