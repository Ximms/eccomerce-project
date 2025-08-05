async function fetchProduct() {
  // Ambil parameter ID dari URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id"); // ambil ID dari URL

  // Jika tidak ada ID, tampilkan pesan error
  if (!id) {
    document.getElementById("product-detail").innerHTML = "<p>Produk tidak ditemukan.</p>";
    return;
  }

  try {
    // Ambil detail produk berdasarkan ID dari API
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await response.json();

    // Ambil elemen container detail produk
    const container = document.getElementById('product-detail');

    // Simpan produk ke localStorage untuk digunakan saat "Checkout Sekarang"
    localStorage.setItem("selectedProduct", JSON.stringify(product));

    // Render isi HTML detail produk
    container.innerHTML = `
  <!-- Container Responsif -->
  <div class="flex flex-col md:flex-row gap-6 w-full">

    <!-- Gambar Produk -->
    <div class="flex flex-col items-center w-full md:w-1/2 p-4 rounded">
      <img src="${product.image}" alt="${product.title}" class="w-full h-64 md:h-[370px] object-contain rounded mb-4" />
      <div class="flex gap-2 md:gap-4 justify-center flex-wrap">
        <img src="${product.image}" class="w-16 h-16 md:w-20 md:h-20 object-contain bg-white p-1 rounded shadow" />
        <img src="${product.image}" class="w-16 h-16 md:w-20 md:h-20 object-contain bg-white p-1 rounded shadow" />
        <img src="${product.image}" class="w-16 h-16 md:w-20 md:h-20 object-contain bg-white p-1 rounded shadow" />
      </div>
    </div>

    <!-- Info Produk -->
    <div class="flex flex-col w-full md:w-1/2">
      <h2 class="text-2xl md:text-3xl font-bold mb-2">${product.title}</h2>
      <p class="text-red-600 text-2xl md:text-4xl font-bold mt-3 mb-1">USD. ${(product.price).toLocaleString('en-US')}</p>
      <p class="text-gray-400 text-xl md:text-3xl mb-4 line-through">USD. ${(product.price + 30).toLocaleString('en-US')}</p>
      
      <!-- Tombol -->
      <div class="flex flex-col md:flex-row gap-4 mb-4">
        <button id="checkout-sekarang" class="w-full md:w-1/2 px-4 py-3 rounded font-semibold text-white text-lg md:text-xl bg-[#91AC8F] transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-[#91AC8F] hover:shadow-md">
          Checkout Now
        </button>
        <button id="tambah-keranjang" class="w-full md:w-1/2 px-4 py-3 rounded font-semibold text-white text-lg md:text-xl bg-[#91AC8F] transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-[#91AC8F] hover:shadow-md">
          Add to Cart
        </button>
      </div>

      <hr class="my-4 border border-gray-400" />
      
      <h3 class="text-2xl md:text-3xl font-bold mb-2">Description</h3>
      <p class="text-gray-700 text-base md:text-xl leading-relaxed">${product.description}</p>
    </div>

  </div>
`;

    // Tombol Tambah ke Keranjang
    const tambahKeranjangBtn = document.getElementById("tambah-keranjang");
    tambahKeranjangBtn.addEventListener("click", () => {
      // Ambil keranjang dari localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Cek apakah produk sudah ada dalam keranjang
      const existingProduct = cart.find(item => item.id === product.id);
      if (existingProduct) {
        // Jika sudah ada, tambahkan quantity-nya
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
      } else {
        // Jika belum ada, tambahkan produk baru
        cart.push({ ...product, quantity: 1 });
      }

      // Simpan kembali keranjang ke localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Tampilkan notifikasi
      alert(`"${product.title}" telah ditambahkan ke keranjang!`);
    });

    // Tombol Checkout Sekarang
    const checkoutBtn = document.getElementById("checkout-sekarang");
    checkoutBtn.addEventListener("click", () => {
      // Buat array produk untuk checkout
      const checkoutItem = [{
        id: product.id,
        title: product.title,
        description: product.description,
        image: product.image,
        price: product.price,
        qty: 1
      }];

      // Simpan produk ke localStorage untuk halaman checkout
      localStorage.setItem("checkoutItems", JSON.stringify(checkoutItem));

      // Arahkan ke halaman checkout
      window.location.href = "CheckOut.html";
    });

  } catch (error) {
    // Jika terjadi error saat fetch atau proses lainnya
    console.error("Gagal memuat produk:", error);
    document.getElementById("product-detail").innerHTML = "<p>Terjadi kesalahan saat memuat produk.</p>";
  }
}

// Jalankan fungsi saat halaman dimuat
fetchProduct();
