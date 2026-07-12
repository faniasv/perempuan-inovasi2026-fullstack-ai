// Menangkap elemen HTML
const btnCari = document.getElementById("btn-cari");
const inputFase = document.getElementById("fase-haid");
const inputGejala = document.getElementById("gejala");
const containerHasil = document.getElementById("hasil-rekomendasi");
const listRiwayat = document.getElementById("list-riwayat");
const aksiHasil = document.querySelector(".aksi-hasil");

btnCari.addEventListener("click", async () => {

    const fase = inputFase.value;
    const gejala = inputGejala.value;

    if (!fase || !gejala) {
        alert("Halo! Tolong pilih fase menstruasi dan ceritakan gejalamu dulu ya.");
        return;
    }

    // Loading
    containerHasil.classList.remove("hidden");

    containerHasil.innerHTML = `
        <div class="loading-box">
            <div class="spinner"></div>

            <h3>🌙 Luna sedang berpikir...</h3>

            <p>Meracik rekomendasi gizi terbaik untukmu.</p>
        </div>
    `;

    btnCari.disabled = true;
    btnCari.innerText = "Menganalisis...";

    const prompt = `
Kamu adalah asisten ahli gizi virtual yang ramah dan suportif bernama Luna.
Pengguna sedang berada di fase menstruasi: "${fase}" dan mengalami gejala: "${gejala}".

Tugasmu:
1. Validasi perasaannya dengan empati (1 kalimat singkat).
2. Sebutkan 2-3 nutrisi yang secara medis cocok untuk meredakan gejala tersebut.
3. Berikan 1 ide menu sederhana yang mudah dibuat di rumah.

Aturan Output:
- Gunakan HTML.
- Awali dengan "Halo, Luna di sini untukmu!"
- Gunakan <h3>, <ul>, <li>.
- Jangan gunakan CSS inline.
- Jangan memberikan diagnosis.
- Gunakan bahasa Indonesia yang hangat.
- Maksimal 250 kata.
`;

    try {

        const response = await fetch("http://localhost:3001/api/rekomendasi", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt
            })

        });

        if (!response.ok) {

            const error = await response.json();

            throw new Error(error.error.message);

        }

        const data = await response.json();

        const resultHTML = DOMPurify.sanitize(
            data.candidates[0].content.parts[0].text
        );

        containerHasil.innerHTML = resultHTML;

        aksiHasil.classList.remove("hidden");

        simpanRiwayat(fase, gejala, resultHTML);

        tampilkanRiwayat();

    }

    catch (error) {

        console.error(error);

        aksiHasil.classList.add("hidden");

        containerHasil.innerHTML =
            "<p>Maaf, Luna sedang mengalami gangguan koneksi. Yuk coba lagi sebentar.</p>";

    }

    finally {

        btnCari.disabled = false;

        btnCari.innerText = "Cari Rekomendasi Gizi";

    }

});

function simpanRiwayat(fase, gejala, hasil) {

    const riwayat =
        JSON.parse(localStorage.getItem("riwayatLuna")) || [];

    riwayat.unshift({

        fase,
        gejala,
        hasil

    });

    localStorage.setItem(
        "riwayatLuna",
        JSON.stringify(riwayat)
    );

}

function tampilkanRiwayat() {

    const riwayat =
        JSON.parse(localStorage.getItem("riwayatLuna")) || [];

    if (riwayat.length === 0) {

        listRiwayat.innerHTML = `
            <p class="empty-history">
                🌸 Belum ada rekomendasi tersimpan.
            </p>
        `;

        return;

    }

    listRiwayat.innerHTML = "";

    riwayat.forEach((item) => {

        const card = document.createElement("div");

        card.className = "item-riwayat";

        card.innerHTML = `
            <strong>🌙 ${item.fase}</strong>
            <p>${item.gejala}</p>
        `;

        card.addEventListener("click", () => {

            containerHasil.classList.remove("hidden");

            containerHasil.innerHTML = item.hasil;

            aksiHasil.classList.remove("hidden");

        });

        listRiwayat.appendChild(card);

    });

}

// Saat halaman pertama dibuka
tampilkanRiwayat();

// Sembunyikan tombol aksi
aksiHasil.classList.add("hidden");