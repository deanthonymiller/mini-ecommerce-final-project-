document.addEventListener("DOMContentLoaded", () => {
  // Dark mode toggle 
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      const isDark = document.body.classList.contains("dark-mode");
      darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    });
  }

  //Product data 
  const products = [
    {
      id: "1",
      name: "Red Hoodie",
      price: 29.99,
      image: "images/product1.png",
      description: "This cozy red hoodie is perfect for everyday wear. Soft fabric, relaxed fit, and just enough style to make it your new favorite.",
      features: [
        "100% cotton, medium weight",
        "Unisex fit (S–XXL)",
        "Machine washable",
        "Front pocket and drawstring hood"
      ],
      reviews: [
        { author: "Alex", rating: 5, text: "Super comfy, I wear it almost every day." },
        { author: "Taylor", rating: 4, text: "Great quality for the price. The color really pops." }
      ]
    },
    {
      id: "2",
      name: "Blue T-Shirt",
      price: 19.99,
      image: "images/product2.png",
      description: "A classic blue tee that goes with everything.",
      features: [
        "Soft cotton blend",
        "Regular fit",
        "Breathable fabric"
      ],
      reviews: [
        { author: "Sam", rating: 5, text: "Love the fit and color!" }
      ]
    },
    {
      id: "3",
      name: "Cool Cap",
      price: 14.99,
      image: "images/product3.png",
      description: "Keep the sun out of your eyes and your style on point.",
      features: [
        "Adjustable strap",
        "Lightweight material",
        "Embroidered logo"
      ],
      reviews: [
        { author: "Jordan", rating: 4, text: "Nice cap, fits well." }
      ]
    },
    {
      id: "4",
      name: "Canvas Tote Bag",
      price: 24.99,
      image: "images/product4.png",
      description: "Sturdy canvas tote bag for groceries, books, or everyday carry.",
      features: [
        "Reinforced handles",
        "Eco-friendly material",
        "Spacious interior"
      ],
      reviews: [
        { author: "Riley", rating: 5, text: "I use this bag all the time!" }
      ]
    },
    {
      id: "5",
      name: "Wireless Earbuds",
      price: 49.99,
      image: "images/product5.png",
      description: "Enjoy your music wire-free with clear sound.",
      features: [
        "Bluetooth connectivity",
        "Charging case included",
        "Up to 6 hours of playtime"
      ],
      reviews: [
        { author: "Chris", rating: 4, text: "Good sound for the price." }
      ]
    },
    {
      id: "6",
      name: "Smartwatch Band",
      price: 15.99,
      image: "images/product6.png",
      description: "Comfortable replacement band for your smartwatch.",
      features: [
        "Adjustable fit",
        "Sweat-resistant material",
        "Quick-release pins"
      ],
      reviews: [
        { author: "Pat", rating: 5, text: "Much more comfortable than the original band." }
      ]
    }
  ];

  // Cart helpers 
  function getCart() {
    const stored = localStorage.getItem("miniStoreCart");
    return stored ? JSON.parse(stored) : [];
  }

  function saveCart(cart) {
    localStorage.setItem("miniStoreCart", JSON.stringify(cart));
  }

  function addToCart(productId) {
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }

    saveCart(cart);
    alert("Item added to cart!");
  }

  function clearCart() {
    localStorage.removeItem("miniStoreCart");
  }

  //Product detail page rendering
  const productDetailSection = document.getElementById("product-detail");

  if (productDetailSection) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id") || "1";

    const product = products.find(p => p.id === productId);

    if (!product) {
      productDetailSection.innerHTML = "<p>Product not found.</p>";
    } else {
      const imgEl = document.getElementById("prod-image");
      const nameEl = document.getElementById("prod-name");
      const priceEl = document.getElementById("prod-price");
      const descEl = document.getElementById("prod-description");
      const featuresEl = document.getElementById("prod-features");
      const reviewsEl = document.getElementById("prod-reviews");

      if (imgEl) {
        imgEl.src = product.image;
        imgEl.alt = product.name;
      }
      if (nameEl) {
        nameEl.textContent = product.name;
      }
      if (priceEl) {
        priceEl.textContent = `$${product.price.toFixed(2)}`;
      }
      if (descEl) {
        descEl.textContent = product.description;
      }
      if (featuresEl) {
        featuresEl.innerHTML = "";
        product.features.forEach(feature => {
          const li = document.createElement("li");
          li.textContent = feature;
          featuresEl.appendChild(li);
        });
      }
      if (reviewsEl) {
        reviewsEl.innerHTML = "";
        product.reviews.forEach(review => {
          const li = document.createElement("li");
          const stars = "⭐".repeat(review.rating) + "☆".repeat(5 - review.rating);
          li.innerHTML = `<strong>${review.author}</strong> – ${stars}<br>${review.text}`;
          reviewsEl.appendChild(li);
        });
      }

      //Add to Cart button
      const detailAddButton = document.getElementById("detail-add-to-cart");
      if (detailAddButton) {
        detailAddButton.addEventListener("click", () => {
          addToCart(product.id);
        });
      }
    }
  }

  // Category filter on products.html 
  const categoryFilter = document.getElementById("category-filter");

  if (categoryFilter) {
    const productCards = document.querySelectorAll(".product-card");

    categoryFilter.addEventListener("change", () => {
      const selected = categoryFilter.value;

      productCards.forEach(card => {
        const category = card.dataset.category;
        if (selected === "all" || category === selected) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  //  Add-to-cart buttons on listing pages
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  addToCartButtons.forEach(button => {
    const productId = button.dataset.id;
    if (!productId) return;

    button.addEventListener("click", () => {
      addToCart(productId);
    });
  });

  // Cart page rendering
  const cartBody = document.getElementById("cart-body");
  const cartTotal = document.getElementById("cart-total");
  const cartEmptyMessage = document.getElementById("cart-empty-message");
  const clearCartButton = document.getElementById("clear-cart");

  if (cartBody && cartTotal && cartEmptyMessage) {
    function renderCart() {
      const cart = getCart();
      cartBody.innerHTML = "";
      let total = 0;

      if (cart.length === 0) {
        cartEmptyMessage.style.display = "block";
      } else {
        cartEmptyMessage.style.display = "none";
      }

      cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        const subtotal = product.price * item.quantity;
        total += subtotal;

        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${product.name}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td>$${subtotal.toFixed(2)}</td>
        `;

        cartBody.appendChild(tr);
      });

      cartTotal.textContent = `$${total.toFixed(2)}`;
    }

    renderCart();

    if (clearCartButton) {
      clearCartButton.addEventListener("click", () => {
        clearCart();
        renderCart();
      });
    }
  }

  // Checkout page logic
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutSummary = document.getElementById("checkout-summary");
  const checkoutMessage = document.getElementById("checkout-message");

  if (checkoutSummary) {
    const cart = getCart();
    if (cart.length === 0) {
      checkoutSummary.textContent = "Your cart is empty. Please add items before checking out.";
    } else {
      let total = 0;
      let itemCount = 0;
      cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        const subtotal = product.price * item.quantity;
        total += subtotal;
        itemCount += item.quantity;
      });

      checkoutSummary.textContent = `You have ${itemCount} item(s) in your cart. Order total: $${total.toFixed(2)}.`;
    }
  }

  if (checkoutForm && checkoutMessage) {
    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("checkout-name").value.trim();
      const email = document.getElementById("checkout-email").value.trim();
      const address = document.getElementById("checkout-address").value.trim();
      const city = document.getElementById("checkout-city").value.trim();
      const state = document.getElementById("checkout-state").value.trim();
      const zip = document.getElementById("checkout-zip").value.trim();
      const payment = document.getElementById("checkout-payment").value;
      const newsletter = document.getElementById("checkout-newsletter").checked;

      const cart = getCart();

      if (cart.length === 0) {
        checkoutMessage.textContent = "Your cart is empty. Please add items before placing an order.";
        checkoutMessage.style.color = "red";
        return;
      }

      if (!name || !email || !address || !city || !state || !zip) {
        checkoutMessage.textContent = "Please fill out all required fields.";
        checkoutMessage.style.color = "red";
        return;
      }

      // Process order   
      clearCart();
      checkoutForm.reset();
      checkoutMessage.textContent = `Thank you, ${name}! Your order has been placed using ${payment}.`;
      checkoutMessage.style.color = "green";

      if (checkoutSummary) {
        checkoutSummary.textContent = "Your cart is now empty. Thanks for your order!";
      }

      if (newsletter) {
        checkoutMessage.textContent += " You’ve also been signed up for store updates.";
      }
    });
  }
});
