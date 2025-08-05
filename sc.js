// Fungsi async untuk mengambil dan menampilkan 1 produk
async function getProduct() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();

    const product = data[0]; // Ambil produk pertama saja

    const productElement = document.createElement('div');
    productElement.className = "bg-white border border-gray-300 rounded-xl w-[350px] p-4 shadow-lg flex flex-col items-center text-center";

    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="w-[200px] h-[200px] object-contain mb-4" />
      <h2 class="text-lg font-semibold line-clamp-2 mb-2 h-12">${product.title}</h2>
      <p class="text-green-600 font-bold text-xl mb-2">USD ${product.price}</p>
      <p class="text-sm text-gray-600 mb-4 line-clamp-3">${product.description}</p>
      <button class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">Beli Sekarang</button>
    `;

    document.getElementById('product-container').appendChild(productElement);
  } catch (error) {
    console.error("Gagal memuat produk:", error);
  }
}

// Panggil fungsi
getProduct();
