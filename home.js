
    // -------------------------------------------------------------
    // 1. DATA STATE: Products, Cart, Appointments
    // -------------------------------------------------------------
    const IMG_SHOP_PRODUCTS = 'images/shop_products.jpg';
    const CLINIC_PRODUCTS = [
      {
        id: 'prod-1',
        name: 'Organic Herbal Flea & Tick Shampoo',
        category: 'grooming',
        price: 549,
        originalPrice: 650,
        rating: 4.9,
        reviewsCount: 42,
        image: IMG_SHOP_PRODUCTS,
        badge: 'Bestseller',
        description: 'Veterinary formulated with pure neem extracts, lavender oil, and aloe vera. Gentle on puppy skin while repelling ticks and fleas.',
        dosage: 'Use during weekly baths. Lather gently and leave for 5 minutes before warm rinse.'
      },
      {
        id: 'prod-2',
        name: 'Omega-3 Skin & Coat Vitality Drops',
        category: 'supplements',
        price: 899,
        originalPrice: 999,
        rating: 5.0,
        reviewsCount: 68,
        image: IMG_SHOP_PRODUCTS,
        badge: 'Vet Pick',
        description: 'Wild Alaskan salmon oil concentrate rich in EPA & DHA. Drastically curtails shedding and promotes a lustrous, silky coat.',
        dosage: '1 to 2 droppers daily mixed with morning meals for dogs and cats.'
      },
      {
        id: 'prod-3',
        name: 'Grain-Free Oven-Baked Crunch Treats',
        category: 'nutrition',
        price: 349,
        originalPrice: 420,
        rating: 4.8,
        reviewsCount: 89,
        image: IMG_SHOP_PRODUCTS,
        badge: 'Natural',
        description: 'Human-grade real chicken breast, pumpkin puree, and flaxseeds. Slow oven-baked with zero corn, wheat, or synthetic preservatives.',
        dosage: '3 to 5 treats per day as rewards or training incentives.'
      },
      {
        id: 'prod-4',
        name: 'Advanced Canine Joint & Hip Chews',
        category: 'supplements',
        price: 1150,
        originalPrice: 1350,
        rating: 4.9,
        reviewsCount: 37,
        image: IMG_SHOP_PRODUCTS,
        badge: 'Clinical Grade',
        description: 'Loaded with Glucosamine HCl, Chondroitin Sulfate, and MSM. Recommended by Dr. Niha for senior pets and agile active breeds.',
        dosage: '1 soft chew daily per 10kg body weight.'
      },
      {
        id: 'prod-5',
        name: 'Veterinary Probiotic Digestive Paste',
        category: 'supplements',
        price: 680,
        originalPrice: 780,
        rating: 4.9,
        reviewsCount: 51,
        image: IMG_SHOP_PRODUCTS,
        badge: 'Fast Relief',
        description: 'Fast-acting prebiotic and multi-strain probiotic formulation to settle upset stomachs, loose stool, and antibiotic recovery.',
        dosage: 'Administer 2ml orally twice daily for 3 days or as advised by Dr. Niha.'
      },
      {
        id: 'prod-6',
        name: 'Soothing Oatmeal & Lavender Conditioner',
        category: 'grooming',
        price: 499,
        originalPrice: 580,
        rating: 4.7,
        reviewsCount: 29,
        image: IMG_SHOP_PRODUCTS,
        badge: 'Hypoallergenic',
        description: 'Colloidal oatmeal formula specially pH-balanced for canine and feline dermis. Deeply hydrates and stops excessive itching.',
        dosage: 'Apply after shampooing, massage through coat, and rinse thoroughly.'
      },
      {
        id: 'prod-7',
        name: 'Enzymatic Dental Cleansing Gel & Finger Brush',
        category: 'grooming',
        price: 420,
        originalPrice: 490,
        rating: 4.8,
        reviewsCount: 64,
        image: IMG_SHOP_PRODUCTS,
        badge: 'Fresh Breath',
        description: 'Poultry-flavored dental enzyme paste that destroys tartar-forming bacteria without requiring foaming rinses.',
        dosage: 'Brush 3 times a week across outer gum line.'
      },
      {
        id: 'prod-8',
        name: 'Interactive Dental Chew & Treat Ball',
        category: 'accessories',
        price: 299,
        originalPrice: 380,
        rating: 4.7,
        reviewsCount: 33,
        image: IMG_SHOP_PRODUCTS,
        badge: 'Durable',
        description: 'BPA-free natural rubber teeth-cleaning ball that gently massages gums while dispensing crunchy kibble or treats.',
        dosage: 'Fill with small kibble or treats for mental enrichment.'
      }
    ];

    // State Variables
    let currentView = 'home';
    let cart = [];
    let appliedCoupon = null;
    let selectedCategory = 'all';
    let searchQuery = '';
    let sortOption = 'featured';

    // -------------------------------------------------------------
    // 2. VIEW SWITCHING & ROUTING
    // -------------------------------------------------------------
    function switchView(viewName) {
      currentView = viewName;

      // Toggle views
      const views = document.querySelectorAll('.page-view');
      views.forEach(v => {
        if (v.id === 'view-' + viewName) {
          v.classList.remove('hidden');
          v.classList.add('block');
        } else {
          v.classList.add('hidden');
          v.classList.remove('block');
        }
      });

      // Update Desktop Header Nav button styles
      document.querySelectorAll('.nav-item-btn').forEach(btn => {
        if (btn.getAttribute('data-target') === viewName) {
          btn.className = 'nav-item-btn px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 text-brand-deep bg-brand-mist shadow-sm';
        } else {
          btn.className = 'nav-item-btn px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-gray-600 hover:text-brand-deep hover:bg-brand-mist/60';
        }
      });

      // Update Mobile Drawer button styles
      document.querySelectorAll('.mobile-nav-link').forEach(btn => {
        if (btn.getAttribute('data-target') === viewName) {
          btn.className = 'mobile-nav-link text-left px-4 py-2.5 rounded-lg text-base font-semibold bg-brand-mist text-brand-deep';
        } else {
          btn.className = 'mobile-nav-link text-left px-4 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-brand-mist/50';
        }
      });

      // Close mobile drawer if open
      closeMobileMenu();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // If switching to shop, re-render
      if (viewName === 'shop') {
        renderShopCatalog();
      }
    }

    // -------------------------------------------------------------
    // 3. CART SYSTEM
    // -------------------------------------------------------------
    function addToCart(productId, quantity = 1) {
      const product = CLINIC_PRODUCTS.find(p => p.id === productId);
      if (!product) return;

      const existingIndex = cart.findIndex(item => item.id === productId);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }

      updateCartUI();
      showToast('Added ' + product.name + ' to your basket!', 'success');
    }

    function updateItemQuantity(productId, delta) {
      const index = cart.findIndex(item => item.id === productId);
      if (index === -1) return;

      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
        showToast('Item removed from basket', 'info');
      }
      updateCartUI();
    }

    function removeFromCart(productId) {
      cart = cart.filter(item => item.id !== productId);
      updateCartUI();
      showToast('Item removed from basket', 'info');
    }

    function calculateCartTotals() {
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      let discount = 0;
      if (appliedCoupon === 'NIHA10') {
        discount = Math.round(subtotal * 0.10);
      }
      const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 70;
      const total = Math.max(0, subtotal - discount + shipping);

      return { subtotal, discount, shipping, total };
    }

    function updateCartUI() {
      const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      
      // Update badge counts
      const badge = document.getElementById('cart-badge-count');
      if (badge) badge.textContent = totalCount;

      const mobBadge = document.getElementById('mobile-cart-badge');
      if (mobBadge) mobBadge.textContent = totalCount;

      const drawerCount = document.getElementById('cart-drawer-count');
      if (drawerCount) drawerCount.textContent = totalCount + (totalCount === 1 ? ' item selected' : ' items selected');

      // Render items in drawer
      const container = document.getElementById('cart-items-container');
      if (!container) return;

      if (cart.length === 0) {
        container.innerHTML = `
          <div class="text-center py-12 space-y-3">
            <div class="w-16 h-16 rounded-full bg-brand-mist text-brand-medium flex items-center justify-center mx-auto">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <h4 class="text-base font-bold text-brand-deep">Your basket is empty</h4>
            <p class="text-xs text-gray-500 max-w-xs mx-auto">Browse our vet-approved pharmacy and pet wellness items.</p>
            <button type="button" id="cart-start-shopping-btn" class="mt-2 px-5 py-2 rounded-xl text-xs font-semibold bg-brand-deep text-white hover:bg-brand-medium">
              Browse Pet Shop
            </button>
          </div>
        `;
        const startShoppingBtn = document.getElementById('cart-start-shopping-btn');
        if (startShoppingBtn) {
          startShoppingBtn.addEventListener('click', () => {
            closeCartDrawer();
            switchView('shop');
          });
        }
      } else {
        container.innerHTML = cart.map(item => `
          <div class="flex items-center gap-3 p-3 rounded-2xl bg-brand-silk border border-brand-soft/40">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover shrink-0">
            <div class="flex-grow min-w-0">
              <h5 class="text-xs font-bold text-brand-dark truncate">${item.name}</h5>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs font-bold text-brand-deep">₹${item.price}</span>
                <span class="text-[10px] text-gray-400 line-through">₹${item.originalPrice}</span>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <div class="flex items-center border border-brand-soft rounded-lg bg-white overflow-hidden">
                  <button type="button" class="btn-qty-minus px-2 py-0.5 text-xs text-gray-600 hover:bg-brand-mist" data-id="${item.id}">-</button>
                  <span class="px-2 text-xs font-semibold">${item.quantity}</span>
                  <button type="button" class="btn-qty-plus px-2 py-0.5 text-xs text-gray-600 hover:bg-brand-mist" data-id="${item.id}">+</button>
                </div>
                <button type="button" class="btn-remove-item text-[11px] text-red-500 hover:underline" data-id="${item.id}">Remove</button>
              </div>
            </div>
          </div>
        `).join('');

        // Attach listeners for dynamic items
        container.querySelectorAll('.btn-qty-minus').forEach(btn => {
          btn.addEventListener('click', () => updateItemQuantity(btn.getAttribute('data-id'), -1));
        });
        container.querySelectorAll('.btn-qty-plus').forEach(btn => {
          btn.addEventListener('click', () => updateItemQuantity(btn.getAttribute('data-id'), 1));
        });
        container.querySelectorAll('.btn-remove-item').forEach(btn => {
          btn.addEventListener('click', () => removeFromCart(btn.getAttribute('data-id')));
        });
      }

      // Update Breakdown
      const totals = calculateCartTotals();
      const subtotalEl = document.getElementById('cart-subtotal-text');
      if (subtotalEl) subtotalEl.textContent = '₹' + totals.subtotal;

      const discountRow = document.getElementById('cart-discount-row');
      const discountEl = document.getElementById('cart-discount-text');
      if (discountRow && discountEl) {
        if (totals.discount > 0) {
          discountRow.classList.remove('hidden');
          discountEl.textContent = '-₹' + totals.discount;
        } else {
          discountRow.classList.add('hidden');
        }
      }

      const deliveryEl = document.getElementById('cart-delivery-text');
      if (deliveryEl) {
        deliveryEl.textContent = totals.shipping === 0 ? 'FREE' : '₹' + totals.shipping;
      }

      const totalEl = document.getElementById('cart-total-text');
      if (totalEl) totalEl.textContent = '₹' + totals.total;

      const checkoutBtn = document.getElementById('btn-proceed-checkout');
      if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
        if (cart.length === 0) {
          checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
          checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
      }
    }

    function openCartDrawer() {
      const backdrop = document.getElementById('cart-drawer-backdrop');
      const drawer = document.getElementById('cart-drawer');
      if (backdrop && drawer) {
        backdrop.classList.remove('hidden');
        setTimeout(() => {
          drawer.classList.remove('translate-x-full');
        }, 10);
      }
    }

    function closeCartDrawer() {
      const backdrop = document.getElementById('cart-drawer-backdrop');
      const drawer = document.getElementById('cart-drawer');
      if (backdrop && drawer) {
        drawer.classList.add('translate-x-full');
        setTimeout(() => {
          backdrop.classList.add('hidden');
        }, 300);
      }
    }

    // -------------------------------------------------------------
    // 4. RENDERING PRODUCTS (Shop Catalog & Home Featured)
    // -------------------------------------------------------------
    function getFilteredProducts() {
      let filtered = [...CLINIC_PRODUCTS];

      if (selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }

      if (sortOption === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortOption === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortOption === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      return filtered;
    }

    function renderShopCatalog() {
      const grid = document.getElementById('shop-products-grid');
      const emptyState = document.getElementById('shop-empty-state');
      if (!grid) return;

      const products = getFilteredProducts();

      if (products.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
      }

      if (emptyState) emptyState.classList.add('hidden');

      grid.innerHTML = products.map(product => `
        <div class="bg-white rounded-2xl overflow-hidden border border-brand-soft/40 hover:border-brand-medium hover:shadow-purple-soft transition-all duration-300 flex flex-col justify-between group">
          <div class="relative">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500">
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-deep text-white shadow-sm">
              ${product.badge}
            </span>
          </div>

          <div class="p-5 flex-grow flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span class="capitalize font-medium text-brand-medium">${product.category}</span>
                <span class="flex items-center text-accent-gold font-bold">★ ${product.rating}</span>
              </div>
              <h4 class="font-bold text-brand-dark text-sm leading-snug line-clamp-2">${product.name}</h4>
              <p class="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">${product.description}</p>
            </div>

            <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span class="text-base font-extrabold text-brand-deep">₹${product.price}</span>
                <span class="text-xs text-gray-400 line-through ml-1">₹${product.originalPrice}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <button type="button" class="btn-quick-view p-2 rounded-xl text-gray-500 hover:text-brand-deep hover:bg-brand-mist" data-id="${product.id}" title="Quick Details">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
                <button type="button" class="btn-add-product px-3.5 py-1.5 rounded-xl font-bold text-xs bg-brand-deep text-white hover:bg-brand-medium transition-colors shadow-sm" data-id="${product.id}">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      `).join('');

      // Attach event listeners
      grid.querySelectorAll('.btn-add-product').forEach(btn => {
        btn.addEventListener('click', () => {
          addToCart(btn.getAttribute('data-id'), 1);
        });
      });

      grid.querySelectorAll('.btn-quick-view').forEach(btn => {
        btn.addEventListener('click', () => {
          openProductModal(btn.getAttribute('data-id'));
        });
      });
    }

    function renderHomeFeatured() {
      const container = document.getElementById('home-featured-products-grid');
      if (!container) return;

      const featured = CLINIC_PRODUCTS.slice(0, 4);
      container.innerHTML = featured.map(product => `
        <div class="bg-white rounded-2xl overflow-hidden border border-brand-soft/40 hover:border-brand-medium hover:shadow-purple-soft transition-all duration-300 flex flex-col justify-between group">
          <div class="relative">
            <img src="${product.image}" alt="${product.name}" class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500">
            <span class="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-deep text-white">
              ${product.badge}
            </span>
          </div>

          <div class="p-5 flex-grow flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span class="capitalize text-brand-medium font-semibold">${product.category}</span>
                <span class="flex items-center text-accent-gold font-bold">★ ${product.rating}</span>
              </div>
              <h4 class="font-bold text-brand-dark text-sm leading-snug">${product.name}</h4>
              <p class="text-xs text-gray-500 mt-1.5 line-clamp-2">${product.description}</p>
            </div>

            <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span class="text-base font-extrabold text-brand-deep">₹${product.price}</span>
                <span class="text-xs text-gray-400 line-through ml-1">₹${product.originalPrice}</span>
              </div>
              <button type="button" class="btn-home-add px-3.5 py-1.5 rounded-xl font-bold text-xs bg-brand-deep text-white hover:bg-brand-medium transition-colors shadow-sm" data-id="${product.id}">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.btn-home-add').forEach(btn => {
        btn.addEventListener('click', () => {
          addToCart(btn.getAttribute('data-id'), 1);
        });
      });
    }

    function openProductModal(productId) {
      const product = CLINIC_PRODUCTS.find(p => p.id === productId);
      if (!product) return;

      const modal = document.getElementById('product-detail-modal');
      const content = document.getElementById('product-modal-content');
      if (!modal || !content) return;

      content.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
          <img src="${product.image}" alt="${product.name}" class="w-full h-56 object-cover rounded-2xl border border-brand-soft/40 shadow-sm">
          <div>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-mist text-brand-deep">
              ${product.category} • ${product.badge}
            </span>
            <h3 class="text-xl font-serif font-bold text-brand-dark mt-2">${product.name}</h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-accent-gold text-xs font-bold">★★★★★ (${product.rating})</span>
              <span class="text-xs text-gray-500">• ${product.reviewsCount} pet parent reviews</span>
            </div>
            <div class="mt-3">
              <span class="text-2xl font-bold text-brand-deep">₹${product.price}</span>
              <span class="text-sm text-gray-400 line-through ml-1.5">₹${product.originalPrice}</span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-gray-100 space-y-3">
          <div>
            <h5 class="text-xs font-bold uppercase text-gray-500">Dr. Niha's Clinical Review & Details:</h5>
            <p class="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">${product.description}</p>
          </div>
          <div class="p-3 rounded-xl bg-brand-mist text-xs text-brand-dark">
            <strong>Usage & Dosage:</strong> ${product.dosage}
          </div>
        </div>

        <div class="pt-4 flex items-center justify-between gap-3">
          <button type="button" id="modal-add-to-cart-btn" class="w-full py-3 rounded-xl font-bold text-white bg-brand-deep hover:bg-brand-medium text-sm transition-colors shadow-md">
            Add to Basket (₹${product.price})
          </button>
        </div>
      `;

      const addBtn = document.getElementById('modal-add-to-cart-btn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          addToCart(product.id, 1);
          modal.classList.add('hidden');
        });
      }

      modal.classList.remove('hidden');
    }

    // -------------------------------------------------------------
    // 5. APPOINTMENT BOOKING WIZARD LOGIC
    // -------------------------------------------------------------
    let currentBookingStep = 1;

    function openBookingModal(preselectedService = null) {
      const modal = document.getElementById('booking-modal');
      if (!modal) return;

      // Reset to Step 1
      setBookingStep(1);

      // Pre-select service if passed
      if (preselectedService) {
        const serviceSelect = document.getElementById('booking-service-input');
        if (serviceSelect) {
          serviceSelect.value = preselectedService;
        }
      }

      // Default date to tomorrow
      const dateInput = document.getElementById('booking-date-input');
      if (dateInput && !dateInput.value) {
        const tmr = new Date();
        tmr.setDate(tmr.getDate() + 1);
        dateInput.value = tmr.toISOString().split('T')[0];
        dateInput.min = new Date().toISOString().split('T')[0];
      }

      modal.classList.remove('hidden');
    }

    function closeBookingModal() {
      const modal = document.getElementById('booking-modal');
      if (modal) {
        modal.classList.add('hidden');
        // Reset form & views
        const form = document.getElementById('appointment-form');
        if (form) form.reset();
        document.getElementById('booking-success-view').classList.add('hidden');
        document.getElementById('appointment-form').classList.remove('hidden');
      }
    }

    function setBookingStep(step) {
      currentBookingStep = step;

      // Toggle step sections
      for (let i = 1; i <= 3; i++) {
        const stepSection = document.getElementById('booking-step-' + i);
        const badge = document.getElementById('step-badge-' + i);
        if (stepSection && badge) {
          if (i === step) {
            stepSection.classList.remove('hidden');
            badge.className = 'w-7 h-7 rounded-full bg-brand-deep text-white flex items-center justify-center text-xs font-bold';
          } else if (i < step) {
            stepSection.classList.add('hidden');
            badge.className = 'w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold';
          } else {
            stepSection.classList.add('hidden');
            badge.className = 'w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold';
          }
        }
      }
    }

    // -------------------------------------------------------------
    // 6. TOAST NOTIFICATION SYSTEM
    // -------------------------------------------------------------
    function showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = 'pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-semibold text-white transition-all transform translate-y-4 opacity-0 ' + 
        (type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-brand-deep');

      toast.innerHTML = `
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>${message}</span>
      `;

      container.appendChild(toast);

      // Animate in
      setTimeout(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
      }, 10);

      // Remove after 3.5 seconds
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    function toggleMobileMenu(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      const drawer = document.getElementById('mobile-menu-drawer');
      const toggleBtn = document.getElementById('mobile-menu-toggle');
      const hamburger = document.getElementById('hamburger-icon');
      const closeIcon = document.getElementById('close-icon');

      if (!drawer) return;

      const isOpen = drawer.classList.contains('open');

      if (!isOpen) {
        drawer.classList.remove('hidden');
        drawer.classList.add('open');
        drawer.style.display = 'block';
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
        if (hamburger) hamburger.classList.add('hidden');
        if (closeIcon) closeIcon.classList.remove('hidden');
      } else {
        closeMobileMenu();
      }
    }

    function closeMobileMenu() {
      const drawer = document.getElementById('mobile-menu-drawer');
      const toggleBtn = document.getElementById('mobile-menu-toggle');
      const hamburger = document.getElementById('hamburger-icon');
      const closeIcon = document.getElementById('close-icon');

      if (drawer) {
        drawer.classList.remove('open');
        drawer.classList.add('hidden');
        drawer.style.display = 'none';
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        if (hamburger) hamburger.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
      }
    }

    window.toggleMobileMenu = toggleMobileMenu;
    window.closeMobileMenu = closeMobileMenu;

    // -------------------------------------------------------------
    // 7. INITIALIZATION & EVENT LISTENERS
    // -------------------------------------------------------------
    window.addEventListener('DOMContentLoaded', () => {

      // Brand Logo click -> Home
      const brandLogo = document.getElementById('nav-brand-logo');
      if (brandLogo) {
        brandLogo.addEventListener('click', () => switchView('home'));
      }

      // Desktop Nav Links
      document.querySelectorAll('.nav-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          switchView(btn.getAttribute('data-target'));
        });
      });

      // Mobile Nav Links
      document.querySelectorAll('.mobile-nav-link').forEach(btn => {
        btn.addEventListener('click', () => {
          switchView(btn.getAttribute('data-target'));
        });
      });

      // Footer Nav Links
      document.querySelectorAll('.footer-nav-link').forEach(btn => {
        btn.addEventListener('click', () => {
          switchView(btn.getAttribute('data-target'));
        });
      });

      // Buttons linking to Shop view
      document.querySelectorAll('.btn-navigate-shop').forEach(btn => {
        btn.addEventListener('click', () => switchView('shop'));
      });

      // Buttons linking to Services view
      document.querySelectorAll('.btn-navigate-services').forEach(btn => {
        btn.addEventListener('click', () => switchView('services'));
      });

      // Buttons linking to About view
      document.querySelectorAll('.btn-navigate-about').forEach(btn => {
        btn.addEventListener('click', () => switchView('about'));
      });

      // Global CTA Book Appointment Buttons
      document.querySelectorAll('.btn-open-booking').forEach(btn => {
        btn.addEventListener('click', () => openBookingModal());
      });

      const headerCta = document.getElementById('header-cta-book-btn');
      if (headerCta) headerCta.addEventListener('click', () => openBookingModal());

      const mobileCta = document.getElementById('mobile-cta-book-btn');
      if (mobileCta) mobileCta.addEventListener('click', () => {
        closeMobileMenu();
        openBookingModal();
      });

      // Specific Service Booking Buttons (e.g. from Services page or Home)
      document.querySelectorAll('.btn-book-specific').forEach(btn => {
        btn.addEventListener('click', () => {
          const serviceName = btn.getAttribute('data-service');
          openBookingModal(serviceName);
        });
      });

      // Quick Booking Widget on Home
      const quickFindSlotBtn = document.getElementById('quick-find-slot-btn');
      if (quickFindSlotBtn) {
        quickFindSlotBtn.addEventListener('click', () => {
          const petType = document.getElementById('quick-pet-select').value;
          const serviceName = document.getElementById('quick-service-select').value;
          openBookingModal(serviceName);
          // Set radio button for pet species
          const radio = document.querySelector(`input[name="pet_species"][value="${petType === 'Dog' ? 'Dog' : petType === 'Cat' ? 'Cat' : petType === 'Bird' ? 'Bird' : 'Rabbit/Other'}"]`);
          if (radio) radio.checked = true;
        });
      }

      // Mobile Menu Toggle
      const mobileToggle = document.getElementById('mobile-menu-toggle');
      if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
      }

      // Close mobile drawer when clicking outside
      document.addEventListener('click', (e) => {
        const drawer = document.getElementById('mobile-menu-drawer');
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        if (drawer && drawer.classList.contains('open')) {
          if (!drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
            closeMobileMenu();
          }
        }
      });

      // Auto close on tablet/desktop resize
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
          closeMobileMenu();
        }
      });

      // Cart Drawer Handlers
      const cartToggleBtn = document.getElementById('cart-toggle-btn');
      if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCartDrawer);

      const mobileCartBtn = document.getElementById('mobile-cart-btn');
      if (mobileCartBtn) mobileCartBtn.addEventListener('click', openCartDrawer);

      const closeCartBtn = document.getElementById('close-cart-btn');
      if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);

      const cartBackdrop = document.getElementById('cart-drawer-backdrop');
      if (cartBackdrop) {
        cartBackdrop.addEventListener('click', (e) => {
          if (e.target === cartBackdrop) closeCartDrawer();
        });
      }

      // Coupon Code Application
      const applyCouponBtn = document.getElementById('apply-coupon-btn');
      if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', () => {
          const codeInput = document.getElementById('coupon-code-input');
          const feedback = document.getElementById('coupon-feedback');
          const code = codeInput ? codeInput.value.trim().toUpperCase() : '';

          if (code === 'NIHA10') {
            appliedCoupon = 'NIHA10';
            feedback.className = 'text-[11px] font-semibold text-emerald-600 block';
            feedback.textContent = '🎉 Coupon NIHA10 applied: 10% clinic discount!';
            updateCartUI();
            showToast('10% Discount applied!', 'success');
          } else {
            feedback.className = 'text-[11px] font-semibold text-red-500 block';
            feedback.textContent = 'Invalid promo code. Use NIHA10 for 10% off.';
          }
        });
      }

      // Checkout Button
      const checkoutBtn = document.getElementById('btn-proceed-checkout');
      if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
          if (cart.length === 0) return;
          closeCartDrawer();
          const totals = calculateCartTotals();
          document.getElementById('checkout-order-id').textContent = 'NPC-ORD-' + Math.floor(1000 + Math.random() * 9000);
          document.getElementById('checkout-total-paid').textContent = '₹' + totals.total;
          document.getElementById('checkout-modal').classList.remove('hidden');
          // Clear cart
          cart = [];
          appliedCoupon = null;
          updateCartUI();
        });
      }

      const closeCheckoutBtn = document.getElementById('close-checkout-modal-btn');
      if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', () => {
          document.getElementById('checkout-modal').classList.add('hidden');
          switchView('shop');
        });
      }

      // Product Modal Close Handlers
      const closeProductBtn = document.getElementById('close-product-modal-btn');
      if (closeProductBtn) {
        closeProductBtn.addEventListener('click', () => {
          document.getElementById('product-detail-modal').classList.add('hidden');
        });
      }

      // Booking Modal Close Handlers
      const closeBookingBtn = document.getElementById('close-booking-modal-btn');
      if (closeBookingBtn) closeBookingBtn.addEventListener('click', closeBookingModal);

      // Booking Step Buttons
      const btnNext1 = document.getElementById('btn-next-step-1');
      if (btnNext1) {
        btnNext1.addEventListener('click', () => {
          const petName = document.getElementById('pet-name-input').value.trim();
          if (!petName) {
            showToast("Please enter your pet's name to proceed", "error");
            document.getElementById('pet-name-input').focus();
            return;
          }
          setBookingStep(2);
        });
      }

      const btnBack2 = document.getElementById('btn-back-step-2');
      if (btnBack2) btnBack2.addEventListener('click', () => setBookingStep(1));

      const btnNext2 = document.getElementById('btn-next-step-2');
      if (btnNext2) {
        btnNext2.addEventListener('click', () => {
          const date = document.getElementById('booking-date-input').value;
          if (!date) {
            showToast('Please pick your appointment date', 'error');
            return;
          }
          setBookingStep(3);
        });
      }

      const btnBack3 = document.getElementById('btn-back-step-3');
      if (btnBack3) btnBack3.addEventListener('click', () => setBookingStep(2));

      // Booking Form Submission
      const appointmentForm = document.getElementById('appointment-form');
      if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
          e.preventDefault();

          const parentName = document.getElementById('guardian-name-input').value.trim();
          const phone = document.getElementById('guardian-phone-input').value.trim();
          const petName = document.getElementById('pet-name-input').value.trim();
          const service = document.getElementById('booking-service-input').value;
          const date = document.getElementById('booking-date-input').value;
          const slot = document.getElementById('booking-slot-input').value;

          if (!parentName || !phone) {
            showToast('Please enter your name and phone number', 'error');
            return;
          }

          // Generate reference number
          const ref = 'NPC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

          // Populate success screen
          document.getElementById('confirm-ref-id').textContent = ref;
          document.getElementById('confirm-pet-service').textContent = petName + ' • ' + service;
          document.getElementById('confirm-date-slot').textContent = date + ' (' + slot + ')';

          // Show success screen
          appointmentForm.classList.add('hidden');
          document.getElementById('booking-success-view').classList.remove('hidden');

          showToast('Appointment booked with Dr. Niha!', 'success');
        });
      }

      const btnDoneBooking = document.getElementById('btn-done-booking');
      if (btnDoneBooking) {
        btnDoneBooking.addEventListener('click', () => {
          closeBookingModal();
          switchView('home');
        });
      }

      // Copy Address Button
      const copyAddressBtn = document.getElementById('copy-address-btn');
      if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', () => {
          const address = 'Street No. 16, Sector 2B, opp. Biryani & Biryani, Kyettaian Gouda Nilayam, Alkapur Township, Puppalguda, Manikonda, Hyderabad, Telangana';
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(address).then(() => {
              showToast('Clinic address copied to clipboard!', 'success');
            }).catch(() => {
              showToast('Address: Puppalguda, Manikonda, Hyderabad', 'info');
            });
          } else {
            showToast('Address: Puppalguda, Manikonda, Hyderabad', 'info');
          }
        });
      }

      // Category Filters in Shop
      document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedCategory = btn.getAttribute('data-category');
          
          document.querySelectorAll('.category-filter-btn').forEach(b => {
            if (b === btn) {
              b.className = 'category-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all bg-brand-deep text-white shadow-sm';
            } else {
              b.className = 'category-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all bg-white border border-brand-soft/60 text-gray-700 hover:bg-brand-mist';
            }
          });

          renderShopCatalog();
        });
      });

      // Shop Search Input
      const searchInput = document.getElementById('shop-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value;
          renderShopCatalog();
        });
      }

      // Shop Sort Select
      const sortSelect = document.getElementById('shop-sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          sortOption = e.target.value;
          renderShopCatalog();
        });
      }

      // Reset Shop Filters
      const resetFiltersBtn = document.getElementById('reset-shop-filters');
      if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
          selectedCategory = 'all';
          searchQuery = '';
          sortOption = 'featured';
          if (searchInput) searchInput.value = '';
          if (sortSelect) sortSelect.value = 'featured';

          document.querySelectorAll('.category-filter-btn').forEach(b => {
            if (b.getAttribute('data-category') === 'all') {
              b.className = 'category-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all bg-brand-deep text-white shadow-sm';
            } else {
              b.className = 'category-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all bg-white border border-brand-soft/60 text-gray-700 hover:bg-brand-mist';
            }
          });

          renderShopCatalog();
        });
      }

      // Initial Renders
      renderHomeFeatured();
      renderShopCatalog();
      updateCartUI();

    });
  
