document.addEventListener("DOMContentLoaded", () => {
  // Ambil elemen-elemen penting
  const checkoutContainer = document.getElementById("checkout-container");
  const totalItemsElem = document.getElementById("total-items");
  const totalHargaElem = document.getElementById("total-harga");
  const grandTotalElem = document.getElementById("grand-total");
  const bayarBtn = document.getElementById("bayar-btn");

  // Fungsi format ke mata uang USD
  const formatUSD = (number) => {
    return `USD ${number.toFixed(2)}`;
  };

  // Ambil item checkout dari localStorage
  const items = JSON.parse(localStorage.getItem("checkoutItems")) || [];

  // Biaya tetap (misalnya: ongkir, asuransi, dan platform fee)
  const ongkir = 0.70;
  const biayaAsuransi = 0.10;
  const biayaPlatform = 0.15;

  // Jika tidak ada item yang dicheckout
  if (items.length === 0) {
    checkoutContainer.innerHTML = "<p class='text-gray-500'>No products selected for checkout.</p>";
    bayarBtn.disabled = true;
    return;
  }

  let totalProduk = 0;
  let totalHargaProduk = 0;

  // Tampilkan semua item checkout di halaman
  items.forEach(item => {
    const qty = item.qty || 1;
    const subtotal = item.price * qty;

    totalProduk += qty;
    totalHargaProduk += subtotal;

    const div = document.createElement("div");
    div.className = "flex flex-col md:flex-row gap-4 border rounded mb-4 p-4";

    div.innerHTML = `
      <div class="w-full md:w-48 h-36 bg-white border rounded flex items-center justify-center">
        <img src="${item.image}" alt="${item.title}" class="max-w-full max-h-full object-contain" />
      </div>
      <div class="flex flex-col justify-between flex-1">
        <div>
          <h3 class="text-lg font-bold text-black">${item.title}</h3>
          <p class="text-gray-600 text-sm mt-1 line-clamp-2">${item.description}</p>
        </div>
        <p class="text-red-600 font-semibold text-3xl mt-2">${formatUSD(subtotal)}</p>
      </div>
    `;

    checkoutContainer.appendChild(div);
  });

  // Hitung total keseluruhan (produk + biaya lain-lain)
  const grandTotal = totalHargaProduk + ongkir + biayaAsuransi + biayaPlatform;

  // Tampilkan total produk, harga produk, dan grand total
  totalItemsElem.textContent = totalProduk;
  totalHargaElem.textContent = formatUSD(totalHargaProduk);
  grandTotalElem.textContent = formatUSD(grandTotal);

  // Tombol Bayar
  bayarBtn.addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const checkoutItems = items;

    // Filter: buang item yang telah dibayar dari cart
    cart = cart.filter(cartItem =>
      !checkoutItems.some(checkoutItem => checkoutItem.id === cartItem.id)
    );

    // Simpan kembali cart baru
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.removeItem("checkoutItems");

    // Arahkan ke halaman sukses, kirim total melalui URL
    window.location.href = `Payment Succes.html?total=${grandTotal.toFixed(2)}`;
  });
});
