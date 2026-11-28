document.addEventListener("DOMContentLoaded", async () => {
    // Elemen DOM
    const serviceSelect = document.getElementById("service_id");
    const barberSelect = document.getElementById("barber_id");
    const hairStyleRow = document.getElementById("hairStyleRow");
    const hairStyleInput = document.getElementById("hair_style");
    const styleCards = document.querySelectorAll(".style-card-vploss");
    const bookingForm = document.getElementById("bookingForm");
    const submitBtn = document.getElementById("submitBtn");
    
    // Set tanggal minimal hari ini
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("booking_date").min = today;

    // ==========================================
    // 1. Ambil Data Layanan & Barber dari Supabase
    // ==========================================
    try {
        const { data: services, error: errS } = await supabaseClient.from("services").select("*");
        const { data: barbers, error: errB } = await supabaseClient.from("barbers").select("*").eq("is_active", true);

        if (errS || errB) throw new Error("Gagal mengambil data.");

        if (services) {
            serviceSelect.innerHTML = '<option value="" disabled selected>-- Pilih Layanan --</option>';
            services.forEach(s => {
                serviceSelect.innerHTML += `<option value="${s.id}" data-name="${s.name}">${s.name} (Rp ${s.price})</option>`;
            });
        }

        if (barbers) {
            barberSelect.innerHTML = '<option value="" disabled selected>-- Pilih Barber --</option>';
            barbers.forEach(b => {
                barberSelect.innerHTML += `<option value="${b.id}">${b.name} - ${b.specialty}</option>`;
            });
        }
    } catch (err) {
        alert("Koneksi ke database gagal. Silakan refresh halaman.");
        console.error(err);
    }

    // ==========================================
    // 2. Animasi VPLOSS-Style (Anime.js & Motion)
    // ==========================================
    
    // Animasi Judul (Anime.js - Stagger Huruf)
    if (window.anime) {
        const title = document.getElementById('mainTitle');
        if (title) {
            const text = title.innerText;
            title.innerHTML = text.split('').map(char => 
                char === ' ' ? '<span style="display:inline-block; width: 0.3em;"> </span>' : `<span style="display:inline-block;">${char}</span>`
            ).join('');

            anime({
                targets: '#mainTitle span',
                translateY: [100, 0],
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 1200,
                delay: anime.stagger(50)
            });
        }
    }

    // ==========================================
    // 3. Logika Deteksi Layanan "Cut"
    // ==========================================
    serviceSelect.addEventListener("change", (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const serviceName = selectedOption.getAttribute("data-name").toLowerCase();
        
        if (serviceName.includes("cut")) {
            hairStyleRow.style.display = "block";
            hairStyleInput.required = true;
            
            // Animasi munculnya grid menggunakan Motion
            if (window.Motion) {
                Motion.animate(
                    '.style-card-vploss',
                    { opacity: [0, 1], y: [30, 0] },
                    { duration: 0.6, delay: Motion.stagger(0.1) }
                );
            }
        } else {
            hairStyleRow.style.display = "none";
            hairStyleInput.required = false;
            hairStyleInput.value = ""; 
            
            // Reset pilihan visual
            styleCards.forEach(c => c.classList.remove("selected"));
        }
    });

    // ==========================================
    // 4. Logika Klik Kartu Hair Style
    // ==========================================
    styleCards.forEach(card => {
        card.addEventListener("click", () => {
            // Hapus seleksi sebelumnya
            styleCards.forEach(c => c.classList.remove("selected"));
            
            // Tandai yang baru dipilih
            card.classList.add("selected");
            hairStyleInput.value = card.getAttribute("data-value");

            // Animasi "pop" kecil saat diklik menggunakan Motion
            if (window.Motion) {
                Motion.animate(card, { scale: [0.95, 1] }, { duration: 0.2 });
            }
        });
    });

    // ==========================================
    // 5. Submit Form dengan Validasi & Keamanan
    // ==========================================
    bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Validasi 1: Jika layanan Cut, wajib pilih gaya rambut
        if (hairStyleRow.style.display !== "none" && !hairStyleInput.value) {
            alert("Silakan pilih gaya rambut terlebih dahulu.");
            return;
        }

        // Validasi 2: Ambil nilai input dan bersihkan spasi berlebih
        const name = document.getElementById("customer_name").value.trim();
        const phone = document.getElementById("customer_phone").value.trim();
        
        if (name.length < 3) {
            alert("Nama lengkap minimal 3 karakter.");
            return;
        }

        // Validasi 3: Format nomor HP
        const phoneRegex = /^[0-9]{10,14}$/;
        if (!phoneRegex.test(phone)) {
            alert("Nomor HP tidak valid! Gunakan 10-14 digit angka.");
            return;
        }

        // Sanitasi XSS
        const sanitizedName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Proses Kirim
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "PROCESSING...";
        submitBtn.disabled = true; // Mencegah double-click

        const formData = {
            customer_name: sanitizedName,
            customer_phone: phone,
            service_id: serviceSelect.value,
            barber_id: barberSelect.value,
            booking_date: document.getElementById("booking_date").value,
            booking_time: document.getElementById("booking_time").value,
            hair_style: hairStyleRow.style.display !== "none" ? hairStyleInput.value : null,
            status: "confirmed"
        };

        const { error } = await supabaseClient.from("bookings").insert([formData]);

        if (error) {
            if (error.code === "23505") {
                alert("Maaf, jadwal barber ini sudah penuh di tanggal dan jam tersebut.");
            } else {
                alert("Terjadi kesalahan sistem: " + error.message);
            }
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        } else {
            alert("Pesanan Berhasil! Terima kasih.");
            window.location.href = "index.html"; 
        }
    });
});