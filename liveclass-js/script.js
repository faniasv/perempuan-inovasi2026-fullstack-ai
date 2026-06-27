// ================================================================
// main.js — JavaScript untuk Landing Page NIP Live Class
// Hubungkan ke index.html dengan: <script src="main.js"></script>
// Letakkan tag <script> tepat sebelum </body> supaya DOM sudah siap
// ================================================================


// ================================================================
// JS #1 — TYPEWRITER EFFECT
// Konsep: String indexing, setInterval, clearInterval, textContent
// ================================================================
(function typewriterEffect() {
  const el   = document.getElementById('hero-title');
  const text = 'Belajar HTML + CSS + JS dari Nol (2 Jam)';
  let i      = 0;

  // setInterval → jalankan fungsi setiap 45 milidetik
  const interval = setInterval(function () {
    el.textContent += text[i]; // tambah 1 karakter ke elemen
    i++;
    if (i >= text.length) clearInterval(interval); // berhenti setelah selesai
  }, 45);
})();

// ================================================================
// JS #2 — BACK TO TOP BUTTON
// Konsep: window scroll event, scrollY, scrollTo, display toggle
// ================================================================
(function backToTop() {
  const btn = document.getElementById('back-to-top');

  // Pantau posisi scroll halaman
  window.addEventListener('scroll', function () {
    // Ternary: tampilkan tombol jika sudah scroll > 300px
    btn.style.display = window.scrollY > 300 ? 'inline-block' : 'none';
  });

  // Klik → scroll halus ke paling atas
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

