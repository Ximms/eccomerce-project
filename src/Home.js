let semuaProduk = []; // Menyimpan semua data produk global

async function ambilData() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();

    semuaProduk = data;
    renderProduk(data);
    renderKategori(data); // Tambahkan kategori

    // Fitur pencarian
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
      const keyword = searchInput.value.toLowerCase();
      const hasilFilter = semuaProduk.filter((item) =>
        item.title.toLowerCase().includes(keyword)
      );
      renderProduk(hasilFilter);
    });

  } catch (error) {
    console.log("Data Error", error);
  }
}

// Render produk ke halaman
function renderProduk(data) {
  const container = document.getElementById("data-product");
  container.innerHTML = "";

  data.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = `
      bg-white shadow-md border border-gray-300 rounded-xl p-4 flex flex-col justify-between 
      hover:scale-105 hover:ring-2 hover:ring-[#91AC8F] transition-all duration-300 cursor-pointer
    `;

    postElement.innerHTML = `
      <a href="Detail.html?id=${post.id}" class="block mb-3">
        <img src="${post.image}" alt="${post.title}" class="w-full h-48 sm:h-52 md:h-56 object-contain" />
      </a>
      <h3 class="text-base sm:text-lg font-semibold line-clamp-2 min-h-[3.5rem] text-gray-800">
        ${post.title}
      </h3>
      <div class="flex items-center justify-between flex-wrap gap-4 mt-4">
        <p class="text-red-600 font-bold text-xl">
          USD $${post.price.toFixed(2)}
        </p>
        <button class="tambah-keranjang px-4 py-3 rounded font-semibold text-white text-lg bg-[#91AC8F] transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-[#91AC8F] hover:shadow-md" 
          data-id="${post.id}"
          data-title="${post.title}"
          data-price="${post.price}"
          data-image="${post.image}">
          Add to Cart
        </button>
      </div>
    `;

    container.appendChild(postElement);
  });

  // Event listener untuk tombol Add to Cart
  const tombolKeranjang = document.querySelectorAll(".tambah-keranjang");
  tombolKeranjang.forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = {
        id: btn.getAttribute("data-id"),
        title: btn.getAttribute("data-title"),
        price: parseFloat(btn.getAttribute("data-price")),
        image: btn.getAttribute("data-image"),
        quantity: 1,
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProduct = cart.find(item => item.id == product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`"${product.title}" berhasil ditambahkan ke keranjang!`);
    });
  });
}

// Render kategori otomatis
function renderKategori(data) {
  const categoryContainer = document.getElementById("category-container");
  const kategoriUnik = ["Semua", ...new Set(data.map(item => item.category))];

  categoryContainer.innerHTML = "";

  kategoriUnik.forEach(kategori => {
    const btn = document.createElement("button");
    btn.textContent = kategori;
    btn.className = `
      kategori-btn px-10 w-[277px] py-2 m-auto rounded-xl 
      bg-[#91AC8F] text-white font-medium 
      hover:bg-[#7d9978] transition-all text-sm md:text-base
    `;

    btn.addEventListener("click", () => {
      const hasil = kategori === "Semua"
        ? semuaProduk
        : semuaProduk.filter(item => item.category === kategori);

      document.getElementById("searchInput").value = ""; // Reset pencarian
      renderProduk(hasil);
    });

    categoryContainer.appendChild(btn);
  });
}

// Jalankan saat halaman dimuat
ambilData();
