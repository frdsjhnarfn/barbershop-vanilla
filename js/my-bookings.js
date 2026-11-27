document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const resultsContainer = document.getElementById("bookingResults");

    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const phone = document.getElementById("searchPhone").value;
        
        resultsContainer.innerHTML = `<p style="text-align: center; color: #666;">Mencari pesanan...</p>`;

        // Ambil data berdasarkan nomor HP
        const { data, error } = await supabaseClient
            .from("bookings")
            .select(`*, barbers (name), services (name)`)
            .eq("customer_phone", phone)
            .order("created_at", { ascending: false });

        if (error) {
            resultsContainer.innerHTML = `<p style="text-align: center; color: red;">Terjadi kesalahan saat mencari.</p>`;
            return;
        }

        if (data.length === 0) {
            resultsContainer.innerHTML = `<div class="booking-card" style="justify-content: center; color: #666;">Tidak ada pesanan ditemukan untuk nomor tersebut.</div>`;
            return;
        }

        resultsContainer.innerHTML = "";
        data.forEach(b => {
            const statusClass = b.status === 'confirmed' ? 'status-confirmed' : 
                                b.status === 'completed' ? 'status-completed' : 'status-cancelled';
            
            const hairStyle = b.hair_style ? `<span class="style-tag">Style: ${b.hair_style}</span><br>` : '';
            
            const cancelBtn = b.status === 'confirmed' 
                ? `<button class="btn-cancel" onclick="cancelBooking('${b.id}')">Batalkan Pesanan</button>` 
                : '';

            resultsContainer.innerHTML += `
                <div class="booking-card">
                    <div class="booking-info">
                        <h3>${b.services?.name}</h3>
                        ${hairStyle}
                        <p>Barber: <strong>${b.barbers?.name}</strong></p>
                        <p>Jadwal: <strong>${b.booking_date}</strong> pukul ${b.booking_time}</p>
                    </div>
                    <div class="booking-actions">
                        <span class="status-badge ${statusClass}">${b.status}</span>
                        ${cancelBtn}
                    </div>
                </div>
            `;
        });
    });

    // Fungsi untuk membatalkan pesanan
    window.cancelBooking = async (id) => {
        if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;

        const { error } = await supabaseClient
            .from("bookings")
            .update({ status: "cancelled" })
            .eq("id", id);

        if (error) {
            alert("Gagal membatalkan pesanan: " + error.message);
        } else {
            alert("Pesanan berhasil dibatalkan.");
            // Trigger ulang form submit untuk me-refresh data secara otomatis
            searchForm.dispatchEvent(new Event('submit'));
        }
    };
});