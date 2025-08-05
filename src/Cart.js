document.addEventListener("DOMContentLoaded", () => {
  // Ambil data keranjang dari localStorage, jika tidak ada gunakan array kosong
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Ambil elemen-elemen penting dari DOM
  const container = document.getElementById("cart-items");
  const itemCount = document.getElementById("item-count");
  const totalPrice = document.getElementById("total-price");
  const selectAllCheckbox = document.getElementById("select-all");

  // Fungsi untuk menghitung ulang total item dan total harga dari item yang dicentang
  function updateSummaryFromChecked() {
    const checkboxes = document.querySelectorAll(".item-checkbox");
    let total = 0;
    let count = 0;

    checkboxes.forEach((checkbox, idx) => {
      if (checkbox.checked) {
        const product = cart[idx];
        const qty = product.qty || 1;
        total += product.price * qty;
        count++;
      }
    });

    itemCount.textContent = count;
    totalPrice.textContent = `RP. ${total.toLocaleString("id-ID")}`;
  }

  // Fungsi untuk menampilkan isi keranjang
  function renderCart() {
    container.innerHTML = "";

    // Jika keranjang kosong
    if (cart.length === 0) {
      container.innerHTML = "<p class='text-center text-gray-500'>Keranjang kosong.</p>";
      itemCount.textContent = "0";
      totalPrice.textContent = "RP. 0";
      selectAllCheckbox.disabled = true;
      selectAllCheckbox.checked = false;
      return;
    }

    // Tampilkan setiap item dalam keranjang
    cart.forEach((product, index) => {
      const qty = product.qty || 1;
      const subtotal = product.price * qty;
      const isChecked = product.checked !== false;

      const div = document.createElement("div");
      div.className = "flex items-center gap-4 border rounded-lg p-4 bg-[#D9D9D9]";
      div.style.boxShadow = "0 0 15px rgba(0,0,0,0.2)";
      div.setAttribute("data-id", product.id);

      div.innerHTML = `
        <input type="checkbox" ${isChecked ? "checked" : ""} class="w-5 h-5 item-checkbox" data-index="${index}" />
        <img src="${product.image}" class="w-28 h-28 object-contain bg-white p-2 border rounded" alt="${product.title}" />
        <div class="flex flex-col flex-1">
          <h2 class="text-lg font-semibold mb-1">${product.title}</h2>
          <p class="text-red-600 text-2xl font-bold mb-2 subtotal">RP. ${subtotal.toLocaleString("id-ID")}</p>
          <div class="flex items-center gap-2">
            <button class="delete-btn" data-index="${index}">
              <img src="aset Landing/mdi_rubbish-bin.png" alt="Hapus" class="w-6 h-6 hover:opacity-70" />
            </button>
            <div class="flex items-center border px-2 rounded">
              <button class="text-xl px-2 btn-minus">-</button>
              <span class="px-2 item-qty">${qty}</span>
              <button class="text-xl px-2 btn-plus">+</button>
            </div>
          </div>
        </div>
      `;

      container.appendChild(div);
    });

    // Update ringkasan total setelah render
    updateSummaryFromChecked();

    // Event listener untuk checkbox per item
    document.querySelectorAll(".item-checkbox").forEach(cb => {
      cb.addEventListener("change", function () {
        const index = parseInt(this.getAttribute("data-index"));
        cart[index].checked = this.checked;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateSummaryFromChecked();

        // Update status "Pilih Semua"
        const allChecked = [...document.querySelectorAll(".item-checkbox")].every(c => c.checked);
        selectAllCheckbox.checked = allChecked;
      });
    });

    // Event listener untuk tombol hapus satu item
    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", function () {
        const index = parseInt(this.getAttribute("data-index"));
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart(); // render ulang setelah hapus
      });
    });
  }

  // Jalankan renderCart saat halaman dimuat
  renderCart();

  // Event handler untuk tombol + dan - quantity
  container.addEventListener("click", function (e) {
    const isPlus = e.target.classList.contains("btn-plus");
    const isMinus = e.target.classList.contains("btn-minus");
    if (!isPlus && !isMinus) return;

    const itemDiv = e.target.closest("div[data-id]");
    const id = parseInt(itemDiv.getAttribute("data-id"));
    const qtySpan = itemDiv.querySelector(".item-qty");
    const subtotalElem = itemDiv.querySelector(".subtotal");

    let qty = parseInt(qtySpan.textContent);
    const productIndex = cart.findIndex(p => p.id === id);
    if (productIndex === -1) return;

    if (isPlus) {
      qty++;
    } else if (isMinus && qty > 1) {
      qty--;
    } else if (isMinus && qty === 1) {
      alert("Minimal pembelian 1 item.");
      return;
    }

    // Simpan perubahan quantity
    cart[productIndex].qty = qty;
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update tampilan subtotal dan quantity
    qtySpan.textContent = qty;
    const subtotal = cart[productIndex].price * qty;
    subtotalElem.textContent = `RP. ${subtotal.toLocaleString("id-ID")}`;

    updateSummaryFromChecked(); // update total harga
  });

  // Tombol hapus semua isi keranjang
  document.getElementById("clear-cart").addEventListener("click", () => {
    const konfirmasi = confirm("Apakah kamu yakin ingin menghapus semua item di keranjang?");
    if (konfirmasi) {
      localStorage.removeItem("cart");
      cart = [];
      renderCart();
    }
  });

  // Tombol checkout
  document.getElementById("checkout-btn").addEventListener("click", () => {
    const selectedItems = [];
    const checkboxes = document.querySelectorAll(".item-checkbox");

    // Ambil hanya item yang dicentang
    checkboxes.forEach((checkbox, idx) => {
      if (checkbox.checked) {
        selectedItems.push(cart[idx]);
      }
    });

    // Validasi minimal 1 produk dipilih
    if (selectedItems.length === 0) {
      alert("Silakan pilih minimal 1 produk untuk checkout.");
      return;
    }

    // Simpan item terpilih dan pindah ke halaman checkout
    localStorage.setItem("checkoutItems", JSON.stringify(selectedItems));
    window.location.href = "CheckOut.html";
  });

  // Tombol pilih semua / batal pilih semua
  selectAllCheckbox.addEventListener("change", function () {
    const isChecked = this.checked;
    document.querySelectorAll(".item-checkbox").forEach((checkbox, index) => {
      checkbox.checked = isChecked;
      cart[index].checked = isChecked;
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateSummaryFromChecked();
  });

  // Set status awal checkbox "Pilih Semua"
  const allCheckedInitially = cart.length > 0 && cart.every(item => item.checked !== false);
  selectAllCheckbox.checked = allCheckedInitially;
});
