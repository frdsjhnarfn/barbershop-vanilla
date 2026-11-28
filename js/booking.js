document.addEventListener("DOMContentLoaded", async () => {
    const serviceSelect = document.getElementById("service_id");
    const barberSelect = document.getElementById("barber_id");
    const hairStyleRow = document.getElementById("hairStyleRow");
    const hairStyleInput = document.getElementById("hair_style"); // Input hidden
    const styleCards = document.querySelectorAll(".style-card");
    const bookingForm = document.getElementById("bookingForm");
    const submitBtn = document.getElementById("submitBtn");
    
    // Set tanggal minimal hari ini (Tidak bisa memesan tanggal lampau)
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
    // 2. Deteksi Layanan "Cut" & Logika Kartu Hair Style
    // ==========================================
    serviceSelect.addEventListener("change", (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const serviceName = selectedOption.getAttribute("data-name").toLowerCase();
        
        if (serviceName.includes("cut")) {
            hairStyleRow.style.display = "grid";
            hairStyleInput.required = true;
        } else {
            hairStyleRow.style.display = "none";
            hairStyleInput.required = false;
            hairStyleInput.value = ""; // Reset input
            
            // Hapus efek terpilih dari semua kartu
            styleCards.forEach(c => c.classList.remove("selected"));
        }
    });

    // Klik pada Kartu Visual
    styleCards.forEach(card => {
        card.addEventListener("click", () => {
            styleCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            hairStyleInput.value = card.getAttribute("data-value");
        });
    });

    // ==========================================
    // 3. Submit Form dengan Validasi & Keamanan
    // ==========================================
    bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Validasi 1: Pastikan jika layanan Cut, gaya rambut wajib dipilih
        if (hairStyleRow.style.display !== "none" && !hairStyleInput.value) {
            alert("Silakan pilih gaya rambut terlebih dahulu.");
            return;
        }

        // Validasi 2: Ambil nilai input dan bersihkan spasi berlebih
        const name = document.getElementById("customer_name").value.trim();
        const phone = document.getElementById("customer_phone").value.trim();
        
        // Validasi 3: Pastikan nama minimal 3 karakter
        if (name.length < 3) {
            alert("Nama lengkap minimal 3 karakter.");
            return;
        }

        // Validasi 4: Format nomor HP (Hanya angka, panjang 10-14 digit)
        const phoneRegex = /^[0-9]{10,14}$/;
        if (!phoneRegex.test(phone)) {
            alert("Nomor HP tidak valid! Gunakan 10-14 digit angka (Contoh: 081234567890).");
            return;
        }

        // Validasi 5: Sanitasi Input untuk mencegah XSS (Script Injection)
        // Mengubah karakter < dan > menjadi teks biasa agar tidak dieksekusi oleh browser
        const sanitizedName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // ==========================================
        // 4. Proses Kirim ke Supabase
        // ==========================================
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Memproses...";
        submitBtn.disabled = true; // Mencegah double-click (Spam)

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
            // Tangani error bentrok jadwal (Unique Constraint dari database)
            if (error.code === "23505") {
                alert("Maaf, jadwal barber ini sudah penuh di tanggal dan jam tersebut. Silakan pilih waktu atau barber lain.");
            } else {
                alert("Terjadi kesalahan sistem: " + error.message);
            }
            
            // Nyalakan kembali tombol jika gagal
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        } else {
            // Jika berhasil
            alert("Pesanan Berhasil! Terima kasih telah memilih layanan kami.");
            window.location.href = "index.html"; // Redirect ke beranda
        }
    });
});