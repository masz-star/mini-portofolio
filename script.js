document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;

  /* ===== 1. Mode gelap (tersimpan di browser) ===== */
  const tombolTema = document.getElementById("tombolTema");
  const ikonTema = tombolTema.querySelector("i");

  function setTema(tema) {
    html.setAttribute("data-tema", tema);
    ikonTema.className = tema === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    try { localStorage.setItem("tema", tema); } catch (e) {}
  }

  let temaAwal = "light";
  try {
    temaAwal = localStorage.getItem("tema") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  } catch (e) {}
  setTema(temaAwal);

  tombolTema.addEventListener("click", () => {
    setTema(html.getAttribute("data-tema") === "dark" ? "light" : "dark");
  });

  /* ===== 2. Menu sidebar untuk HP ===== */
  const sidebar = document.querySelector(".sidebar");
  const tombolMenu = document.getElementById("tombolMenu");

  tombolMenu.addEventListener("click", () => {
    const terbuka = sidebar.classList.toggle("terbuka");
    tombolMenu.setAttribute("aria-expanded", terbuka);
  });

  document.querySelectorAll(".menu a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("terbuka");
      tombolMenu.setAttribute("aria-expanded", "false");
    });
  });

  /* ===== 3. Menu aktif sesuai section yang sedang dilihat ===== */
  const linkMenu = document.querySelectorAll(".menu a");
  const sections = document.querySelectorAll("main section");

  const pengamatMenu = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          linkMenu.forEach((a) =>
            a.classList.toggle("aktif", a.getAttribute("href") === "#" + entry.target.id)
          );
        }
      });
    },
    { threshold: 0.5 }
  );
  sections.forEach((s) => pengamatMenu.observe(s));

  /* ===== 4. Efek mengetik di Beranda ===== */
  const teksKetik = document.getElementById("teksKetik");
  const daftarPeran = ["Information Systems Student", "Web Developer", "Tech Enthusiast"];
  let idxPeran = 0, idxHuruf = 0, menghapus = false;

  function ketik() {
    const peran = daftarPeran[idxPeran];
    idxHuruf += menghapus ? -1 : 1;
    teksKetik.textContent = peran.slice(0, idxHuruf);

    let jeda = menghapus ? 40 : 90;
    if (!menghapus && idxHuruf === peran.length) {
      menghapus = true;
      jeda = 1500;
    } else if (menghapus && idxHuruf === 0) {
      menghapus = false;
      idxPeran = (idxPeran + 1) % daftarPeran.length;
      jeda = 400;
    }
    setTimeout(ketik, jeda);
  }
  ketik();

  /* ===== 5. Animasi muncul saat di-scroll ===== */
  const elemenReveal = document.querySelectorAll(
    "section h2, .pengantar, .tentang-teks, .tentang-foto, .kartu-skills, .kartu-tools, .info-kontak, #formKontak"
  );
  elemenReveal.forEach((el) => el.classList.add("reveal"));

  const pengamatReveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("tampil");
        pengamatReveal.unobserve(el);
        // hapus class setelah selesai supaya efek hover kartu tetap normal
        setTimeout(() => el.classList.remove("reveal", "tampil"), 800);
      });
    },
    { threshold: 0.15 }
  );
  elemenReveal.forEach((el) => pengamatReveal.observe(el));

  /* ===== 6. Validasi form kontak ===== */
  const form = document.getElementById("formKontak");
  const pesanForm = document.getElementById("pesanForm");
  const inputNama = document.getElementById("nama");
  const inputEmail = document.getElementById("email");
  const inputPesan = document.getElementById("pesan");
  const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function tampilkan(teks, jenis) {
    pesanForm.textContent = teks;
    pesanForm.className = jenis;
  }

  [inputNama, inputEmail, inputPesan].forEach((el) =>
    el.addEventListener("input", () => el.classList.remove("salah"))
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    [inputNama, inputEmail, inputPesan].forEach((el) => el.classList.remove("salah"));

    const nama = inputNama.value.trim();
    const email = inputEmail.value.trim();
    const pesan = inputPesan.value.trim();

    if (nama.length < 3) {
      inputNama.classList.add("salah");
      inputNama.focus();
      return tampilkan("Nama minimal 3 karakter.", "error");
    }
    if (!polaEmail.test(email)) {
      inputEmail.classList.add("salah");
      inputEmail.focus();
      return tampilkan("Format email belum benar.", "error");
    }
    if (pesan.length < 10) {
      inputPesan.classList.add("salah");
      inputPesan.focus();
      return tampilkan("Pesan minimal 10 karakter.", "error");
    }

    // Membuka aplikasi email dengan isi yang sudah terisi
    // (ganti dengan Formspree/EmailJS jika ingin kirim langsung dari website)
    const subjek = encodeURIComponent("Pesan dari " + nama);
    const isi = encodeURIComponent(pesan + "\n\nDari: " + nama + " (" + email + ")");
    window.location.href =
      "mailto:prasetya.arya@widyatama.ac.id?subject=" + subjek + "&body=" + isi;

    tampilkan("Terima kasih, " + nama + "! Aplikasi email kamu akan terbuka.", "sukses");
    form.reset();
  });

  /* ===== 0. Tahun otomatis di footer ===== */
  document.getElementById("tahun").textContent = new Date().getFullYear();

  /* ===== 7. Tombol kembali ke atas ===== */
  const tombolAtas = document.getElementById("tombolAtas");
  window.addEventListener("scroll", () => {
    tombolAtas.classList.toggle("terlihat", window.scrollY > 400);
  });
  tombolAtas.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
});