document.addEventListener("DOMContentLoaded", async () => {
    // 1. Cek Sesi Login
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = "login.html";
        return;
    }

    // TAMPILKAN KONTEN JIKA LOGIN VALID
    document.getElementById("adminContent").style.display = "block";

    const formService = document.getElementById("formService");
    const formBarber = document.getElementById("formBarber");
    const serviceList = document.getElementById("serviceList");
    const barberList = document.getElementById("barberList");

    // 2. Fungsi Load Data
    async function loadData() {
        // Load Services
        const { data: services } = await supabaseClient.from("services").select("*").order("name");
        serviceList.innerHTML = "";
        services?.forEach(s => {
            serviceList.innerHTML += `
                <div class="data-item">
                    <div>
                        <h3>${s.name}</h3>
                        <p>Rp ${s.price} • ${s.duration_minutes} menit</p>
                    </div>
                    <button class="btn-delete" onclick="deleteData('services', '${s.id}')">Hapus</button>
                </div>
            `;
        });

        // Load Barbers
        const { data: barbers } = await supabaseClient.from("barbers").select("*").order("name");
        barberList.innerHTML = "";
        barbers?.forEach(b => {
            barberList.innerHTML += `
                <div class="data-item">
                    <div>
                        <h3>${b.name}</h3>
                        <p>${b.specialty}</p>
                    </div>
                    <button class="btn-delete" onclick="deleteData('barbers', '${b.id}')">Hapus</button>
                </div>
            `;
        });
    }

    loadData(); // Panggil saat halaman dimuat

    // 3. Submit Form Layanan
    formService.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById("sName").value,
            price: parseInt(document.getElementById("sPrice").value),
            duration_minutes: parseInt(document.getElementById("sDuration").value)
        };

        const { error } = await supabaseClient.from("services").insert([payload]);
        if (error) alert(error.message);
        else {
            formService.reset();
            loadData(); // Refresh list
        }
    });

    // 4. Submit Form Barber
    formBarber.addEventListener("submit", async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById("bName").value,
            specialty: document.getElementById("bSpecialty").value
        };

        const { error } = await supabaseClient.from("barbers").insert([payload]);
        if (error) alert(error.message);
        else {
            formBarber.reset();
            loadData();
        }
    });

    // 5. Fungsi Hapus Data (dipanggil dari HTML)
    window.deleteData = async (table, id) => {
        if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
        
        const { error } = await supabaseClient.from(table).delete().eq("id", id);
        if (error) {
            alert("Gagal menghapus (Mungkin data sedang digunakan di pesanan): " + error.message);
        } else {
            loadData(); // Refresh list
        }
    };
});