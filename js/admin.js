document.addEventListener("DOMContentLoaded", async () => {
    // 1. Cek apakah admin sudah login
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = "login.html"; // Tendang ke halaman login jika belum login
        return;
    }

    // TAMPILKAN KONTEN JIKA LOGIN VALID
    document.getElementById("adminContent").style.display = "block";

    const tableBody = document.getElementById("bookingsTableBody");
    const logoutBtn = document.getElementById("logoutBtn");

    // 2. Fungsi untuk mengambil dan menampilkan data
    async function fetchBookings() {
        // Mengambil data beserta relasi tabel barbers dan services
        const { data, error } = await supabaseClient
            .from("bookings")
            .select(`*, barbers (name), services (name, price)`)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Gagal memuat data.</td></tr>`;
            return;
        }

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada pesanan.</td></tr>`;
            return;
        }

        tableBody.innerHTML = "";
        data.forEach(b => {
            const statusClass = b.status === 'confirmed' ? 'status-confirmed' : 
                                b.status === 'completed' ? 'status-completed' : 'status-cancelled';
            
            const hairStyle = b.hair_style ? `<div style="font-size: 0.75rem; color: var(--accent); margin-top: 5px;">Style: ${b.hair_style}</div>` : '';
            
            const actionBtn = b.status === 'confirmed' 
                ? `<button class="btn-sm" onclick="updateStatus('${b.id}', 'completed')">Tandai Selesai</button>` 
                : `<span style="color: #666; font-size: 0.8rem;">-</span>`;

            tableBody.innerHTML += `
                <tr>
                    <td>
                        <strong>${b.customer_name}</strong><br>
                        <span style="color: #888; font-size: 0.8rem;">${b.customer_phone}</span>
                    </td>
                    <td>
                        ${b.services?.name || '-'}
                        ${hairStyle}
                    </td>
                    <td>${b.barbers?.name || '-'}</td>
                    <td>
                        ${b.booking_date}<br>
                        <span style="color: #888; font-size: 0.8rem;">${b.booking_time}</span>
                    </td>
                    <td><span class="status-badge ${statusClass}">${b.status}</span></td>
                    <td>${actionBtn}</td>
                </tr>
            `;
        });
    }

    // Panggil fungsi fetch saat halaman dimuat
    fetchBookings();

    // 3. Fungsi Logout
    logoutBtn.addEventListener("click", async () => {
        await supabaseClient.auth.signOut();
        window.location.href = "login.html";
    });

    // 4. Fungsi Update Status (dipanggil dari HTML tombol)
    window.updateStatus = async (id, newStatus) => {
        if (!confirm("Ubah status pesanan ini menjadi selesai?")) return;
        
        const { error } = await supabaseClient
            .from("bookings")
            .update({ status: newStatus })
            .eq("id", id);

        if (error) {
            alert("Gagal mengubah status: " + error.message);
        } else {
            fetchBookings(); // Refresh tabel
        }
    };
});