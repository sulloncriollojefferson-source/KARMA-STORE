const products = [
  {
    id: 1,
    name: "Camiseta Oversize Cyber Dominance'",
    price: 49.90,
    tag: "CLÁSICO",
    images: [
      "assets/products/front1.png",
      "assets/products/back1.png"
    ]
  },
  {
    id: 2,
    name: "Camiseta Oversize Venom Web'",
    price: 49.90,
    tag: "ESENCIAL",
    images: [
      "assets/products/front2.png",
      "assets/products/back2.png"
    ]
  },
  {
    id: 3,
    name: "Camiseta Oversize Ethereal Flame'",
    price: 54.90,
    tag: "NUEVO",
    images: [
      "assets/products/front3.png",
      "assets/products/back3.png"
    ]
  },
    {
  id: 4,
  name: "Camiseta Oversize Midnight Kyoto'",
  price: 54.90,
  tag: "LIMITADO",
  images: [
    "assets/products/front4.png",
    "assets/products/back4.png"
  ]
},
{
  id: 5,
  name: "Camiseta Oversize Vintage Vibes'",
  price: 49.90,
  tag: "STREET",
  images: [
    "assets/products/front5.png",
    "assets/products/back5.png"
  ]
},
{
  id: 6,
  name: "Camiseta Oversize Dark Trap'",
  price: 59.90,
  tag: "PREMIUM",
  images: [
    "assets/products/front6.png",
    "assets/products/back6.png"
  ]
}
];

let cart = JSON.parse(
  localStorage.getItem("karmaCart")
) || [];

const productsContainer = document.getElementById("products");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

function renderProducts() {

  productsContainer.innerHTML = products.map(product => {

    let imageContent = "";

    if (product.images.length > 0) {

      imageContent = `
        <img
          id="product-image-${product.id}"
          src="${product.images[0]}"
          alt="${product.name}"
        >

        <button
          class="image-arrow left"
          onclick="changeProductImage(${product.id}, -1)"
        >
          ‹
        </button>

        <button
          class="image-arrow right"
          onclick="changeProductImage(${product.id}, 1)"
        >
          ›
        </button>

        <div class="image-dots">
          <span class="dot active"></span>
          <span class="dot"></span>
        </div>
      `;

    } else {

      imageContent = `<div class="shirt">KAЯMA</div>`;

    }

    return `
      <article class="product">

        <div class="product-image">

          <span class="tag">${product.tag}</span>

          ${imageContent}

        </div>

        <div class="product-info">

          <h3>${product.name}</h3>

          <div class="sizes">

            <span>Talla:</span>

            <button class="size" onclick="selectSize(this, 'S')">S</button>
            <button class="size" onclick="selectSize(this, 'M')">M</button>
            <button class="size" onclick="selectSize(this, 'L')">L</button>
            <button class="size" onclick="selectSize(this, 'XL')">XL</button>

          </div>

          <div class="product-meta">

  <span class="price">
    S/ ${product.price.toFixed(2)}
  </span>

  <button
    class="add"
    onclick="addToCart(${product.id})"
  >
    Agregar
  </button>

</div>

<button
  class="view-product"
  onclick="openProductPage(${product.id})"
>
  Ver producto →
</button>

        </div>

      </article>
    `;

  }).join("");
}


function changeProductImage(productId, direction) {

  const product = products.find(p => p.id === productId);

  if (!product || product.images.length < 2) {
    return;
  }

  const image = document.getElementById(`product-image-${productId}`);

  let currentIndex = product.images.indexOf(
    image.getAttribute("src")
  );

  if (currentIndex === -1) {
    currentIndex = 0;
  }

  let newIndex = currentIndex + direction;

  if (newIndex >= product.images.length) {
    newIndex = 0;
  }

  if (newIndex < 0) {
    newIndex = product.images.length - 1;
  }

  image.src = product.images[newIndex];

  const dots = image.parentElement.querySelectorAll(".dot");

  dots.forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index === newIndex
    );

  });
}


function selectSize(button, size) {

  const container = button.parentElement;

  const buttons = container.querySelectorAll(".size");

  buttons.forEach(btn => {
    btn.classList.remove("selected");
  });

  button.classList.add("selected");
}


function addToCart(id) {

  const product = products.find(p => p.id === id);

  const productCards = document.querySelectorAll(".product");

  const productCard = productCards[id - 1];

  const selectedSize = productCard.querySelector(".size.selected");

  if (!selectedSize) {

    alert(
      "Selecciona una talla antes de agregar la camiseta."
    );

    return;
  }

  const size = selectedSize.textContent;

  const existingItem = cart.find(
    item => item.id === id && item.size === size
  );

  if (existingItem) {

    existingItem.quantity += 1;

  } else {

    cart.push({
      ...product,
      size: size,
      quantity: 1
    });

  }

  renderCart();
  openCart();
}


function changeQuantity(index, amount) {

  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem(
    "karmaCart",
    JSON.stringify(cart)
  );

  renderCart();
}


function removeFromCart(index) {

  cart.splice(index, 1);

  localStorage.setItem(
    "karmaCart",
    JSON.stringify(cart)
  );

  renderCart();
}


function renderCart() {

  cartCount.textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  if (!cart.length) {

    cartItems.innerHTML =
      '<p class="empty-cart">Tu carrito está vacío.</p>';

  } else {

    cartItems.innerHTML = cart.map((item, index) => `

      <div class="cart-item">

  <img
    src="${item.images[0]}"
    alt="${item.name}"
    class="cart-product-image"
  >

  <div class="cart-product-details">

    <strong>${item.name}</strong>

    <small>
      Talla: ${item.size}
    </small>

    <small>
      S/ ${item.price.toFixed(2)}
    </small>

  </div>

        <div class="quantity">

          <button onclick="changeQuantity(${index}, -1)">
            −
          </button>

          <span>
            ${item.quantity}
          </span>

          <button onclick="changeQuantity(${index}, 1)">
            +
          </button>

        </div>

        <button
          class="remove"
          onclick="removeFromCart(${index})"
        >
          Eliminar
        </button>

      </div>

    `).join("");
  }

  const total = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  cartTotal.textContent =
    `S/ ${total.toFixed(2)}`;
}


function openCart() {

  cartPanel.classList.add("open");

  overlay.classList.add("open");
}


function closeCart() {

  cartPanel.classList.remove("open");

  overlay.classList.remove("open");
}


document
  .getElementById("cartButton")
  .addEventListener("click", openCart);


document
  .getElementById("closeCart")
  .addEventListener("click", closeCart);


overlay.addEventListener(
  "click",
  closeCart
);


const paymentModal =
  document.getElementById("paymentModal");

const paymentClose =
  document.getElementById("paymentClose");

const paymentTotal =
  document.getElementById("paymentTotal");

const paymentDone =
  document.getElementById("paymentDone");

document
  .querySelector(".checkout")
  .addEventListener("click", () => {

    if (!cart.length) {

      alert(
        "Agrega al menos una prenda al carrito."
      );

      return;
    }

    const total = cart.reduce(
      (sum, item) =>
        sum + (item.price * item.quantity),
      0
    );

    paymentTotal.textContent =
      `S/ ${total.toFixed(2)}`;

    paymentModal.classList.add("open");

  });

paymentClose.addEventListener("click", () => {

  paymentModal.classList.remove("open");

});

paymentDone.addEventListener("click", () => {

  const customerName =
  document.getElementById("customerName").value.trim();

const customerPhone =
  document.getElementById("customerPhone").value.trim();

const customerAddress =
  document.getElementById("customerAddress").value.trim();

  if (!customerName || !customerPhone || !customerAddress) {
  alert("Completa todos tus datos de entrega antes de confirmar el pago.");
  return;
}

  const total = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  let message = "🔥 NUEVO PEDIDO KAЯMA 🔥\n\n";

  cart.forEach((item, index) => {

  message += "👤 DATOS DEL CLIENTE\n";
  message += `Nombre: ${customerName}\n`;
  message += `Celular: ${customerPhone}\n`;
  message += `Dirección: ${customerAddress}\n\n`;

  });

  message += "━━━━━━━━━━━━━━\n";
  message += `💰 TOTAL: S/ ${total.toFixed(2)}\n`;
  message += "💳 Método de pago: Yape\n";
  message += "✅ Cliente indica que ya realizó el pago.\n\n";
  message += "Hola KAЯMA, quiero confirmar mi pedido.";

  const phone = "51938746323";

  const whatsappURL =
    "https://wa.me/" +
    phone +
    "?text=" +
    encodeURIComponent(message);

  window.open(
  whatsappURL,
  "_blank"
);

cart = [];

localStorage.removeItem("karmaCart");

renderCart();

paymentModal.classList.remove("open");

});

paymentModal.addEventListener("click", (event) => {

  if (event.target === paymentModal) {

    paymentModal.classList.remove("open");

  }

});

renderProducts();
const productModal = document.getElementById("productModal");
const productModalImage = document.getElementById("productModalImage");
const productModalClose = document.getElementById("productModalClose");

document.querySelectorAll(".product-image img").forEach(image => {

  image.style.cursor = "zoom-in";

  image.addEventListener("click", () => {

    productModalImage.src = image.src;
    productModal.classList.add("open");

  });

});

productModalClose.addEventListener("click", () => {

  productModal.classList.remove("open");

});

productModal.addEventListener("click", (event) => {

  if (event.target === productModal) {
    productModal.classList.remove("open");
  }

});

renderCart();

const params = new URLSearchParams(window.location.search);

const productId = params.get("producto");
const productSize = params.get("talla");

if (productId && productSize) {

  const product = products.find(
    item => item.id === Number(productId)
  );

  if (product) {

    const existingItem = cart.find(
      item =>
        item.id === product.id &&
        item.size === productSize
    );

    if (existingItem) {

      existingItem.quantity += 1;

    } else {

      cart.push({
        ...product,
        size: productSize,
        quantity: 1
      });

    }

    localStorage.setItem(
      "karmaCart",
      JSON.stringify(cart)
    );

    renderCart();

    window.history.replaceState(
      {},
      document.title,
      "index.html"
    );

    openCart();

  }

}

function openProductPage(productId) {

  window.location.href =
    "producto.html?producto=" + productId;

}
