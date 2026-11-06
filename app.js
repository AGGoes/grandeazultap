/**
 * GRANDE AZUL - LÓGICA DO E-COMMERCE & INTERAÇÕES
 * Nuvemshop / Negócios Eletrônicos - 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado Global da Aplicação
  const state = {
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'default',
    cart: JSON.parse(localStorage.getItem('ga_cart') || '[]'),
    appliedCoupon: null,
    shippingCost: 0,
    shippingZip: '',
    shippingFreeThreshold: 399.00,
    showTapMetrics: false,
    wizardSelection: {
      level: null,
      water: null,
      priority: null
    }
  };

  // Elementos do DOM
  const productsGrid = document.getElementById('productsGrid');
  const categoryTabs = document.getElementById('categoryTabs');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const productCountLabel = document.getElementById('productCountLabel');
  
  // Carrinho
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartTriggerBtn = document.getElementById('cartTriggerBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartBadge = document.getElementById('cartBadge');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartDiscountEl = document.getElementById('cartDiscount');
  const cartShippingEl = document.getElementById('cartShipping');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartShippingBarFill = document.getElementById('cartShippingBarFill');
  const cartShippingBarText = document.getElementById('cartShippingBarText');
  const shippingCepInput = document.getElementById('shippingCepInput');
  const shippingCalcBtn = document.getElementById('shippingCalcBtn');
  const shippingResultRow = document.getElementById('shippingResultRow');
  const checkoutOrderBtn = document.getElementById('checkoutOrderBtn');
  
  // Modal de Produto
  const productModalBackdrop = document.getElementById('productModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalProductTitle = document.getElementById('modalProductTitle');
  const modalJpSubtitle = document.getElementById('modalJpSubtitle');
  const modalProductSku = document.getElementById('modalProductSku');
  const modalProductPrice = document.getElementById('modalProductPrice');
  const modalProductInstallments = document.getElementById('modalProductInstallments');
  const modalProductImage = document.getElementById('modalProductImage');
  const modalProductDesc = document.getElementById('modalProductDesc');
  const modalSpecsContainer = document.getElementById('modalSpecsContainer');
  const modalSizeChartTabBtn = document.getElementById('modalSizeChartTabBtn');
  const modalSizeChartPanel = document.getElementById('modalSizeChartPanel');
  const modalMaintenanceText = document.getElementById('modalMaintenanceText');
  const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
  const modalQtyInput = document.getElementById('modalQtyInput');
  const modalWhatsappConsultBtn = document.getElementById('modalWhatsappConsultBtn');

  // Checkout Modal
  const checkoutModalBackdrop = document.getElementById('checkoutModalBackdrop');
  const checkoutModalCloseBtn = document.getElementById('checkoutModalCloseBtn');

  // Toggle TAP
  const tapViewToggle = document.getElementById('tapViewToggle');

  // Toast
  const toastNotification = document.getElementById('toastNotification');

  // ==========================================================================
  // INICIALIZAÇÃO
  // ==========================================================================
  function init() {
    renderCategoryTabs();
    renderProducts();
    renderTapPricingTable();
    updateCartUI();
    bindEvents();
    setupWizard();
  }

  // ==========================================================================
  // FORMATAÇÃO E HELPERS
  // ==========================================================================
  function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.innerHTML = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }

  // ==========================================================================
  // RENDERIZAÇÃO DAS CATEGORIAS
  // ==========================================================================
  function renderCategoryTabs() {
    if (!categoryTabs) return;
    categoryTabs.innerHTML = CATEGORIES.map(cat => {
      const isActive = state.selectedCategory === cat.id;
      return `
        <button class="category-tab-btn ${isActive ? 'active' : ''}" data-cat="${cat.id}">
          <span>${cat.name}</span>
          <span class="jp-sub" style="font-size: 0.65rem; opacity: 0.85;">(${cat.jpName})</span>
          <span class="tab-count">${cat.count}</span>
        </button>
      `;
    }).join('');

    categoryTabs.querySelectorAll('.category-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedCategory = btn.getAttribute('data-cat');
        renderCategoryTabs();
        renderProducts();
      });
    });
  }

  // ==========================================================================
  // FILTRAGEM E ORDENAÇÃO DE PRODUTOS
  // ==========================================================================
  function getFilteredProducts() {
    let list = [...PRODUCTS];

    // Categoria
    if (state.selectedCategory !== 'all') {
      list = list.filter(p => p.categorySlug === state.selectedCategory);
    }

    // Busca
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.jpName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q)
      );
    }

    // Ordenação
    if (state.sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'margin-desc') {
      list.sort((a, b) => b.margin - a.margin);
    } else if (state.sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }

  // ==========================================================================
  // RENDERIZAÇÃO DOS PRODUTOS
  // ==========================================================================
  function renderProducts() {
    if (!productsGrid) return;
    const filtered = getFilteredProducts();

    if (productCountLabel) {
      productCountLabel.textContent = `Exibindo ${filtered.length} de ${PRODUCTS.length} itens`;
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
          <i class="fa-solid fa-water" style="font-size: 2.5rem; color: #94a3b8; margin-bottom: 14px;"></i>
          <h3 style="font-family: var(--font-serif-jp); margin-bottom: 6px;">Nenhum produto encontrado</h3>
          <p style="color: var(--color-sumi-muted); font-size: 0.9rem;">Tente buscar por outro termo ou selecione todas as categorias.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(p => {
      const unitProfit = p.price - p.costPrice;
      const markup = ((p.price / p.costPrice - 1) * 100).toFixed(1);

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="card-badge-container">
            <span class="product-badge-jp">${p.jpBadge}</span>
            <span class="product-badge-hanko">${p.badge}</span>
          </div>

          <div class="product-image-container" onclick="window.gaOpenProductModal(${p.id})">
            <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='assets/logo.jpg'">
            <div class="quick-view-overlay">
              <i class="fa-solid fa-magnifying-glass-plus"></i> Ver Detalhes
            </div>
          </div>

          <div class="product-content">
            <div class="product-sku-cat">
              <span>${p.sku}</span>
              <span>${p.category}</span>
            </div>

            <div class="product-jp-title">${p.jpName}</div>
            <h3 class="product-title" onclick="window.gaOpenProductModal(${p.id})">${p.name}</h3>

            <p class="product-specs-snippet">${p.shortDesc}</p>

            <!-- Métricas de Gestão Nuvemshop / TAP -->
            <div class="product-tap-meta">
              <div class="tap-meta-row">
                <span>Custo Unitário:</span>
                <strong>${formatBRL(p.costPrice)}</strong>
              </div>
              <div class="tap-meta-row">
                <span>Margem Bruta (TAP):</span>
                <span class="tap-meta-margin">${p.margin.toFixed(1)}%</span>
              </div>
              <div class="tap-meta-row">
                <span>Lucro Bruto:</span>
                <span style="color: #16a34a; font-weight: 700;">+${formatBRL(unitProfit)}</span>
              </div>
              <div class="tap-meta-row">
                <span>Markup Comercial:</span>
                <span>${markup}%</span>
              </div>
            </div>

            <div class="product-pricing">
              <div class="price-main">${formatBRL(p.price)}</div>
              <div class="price-installments">${p.installments}</div>
              <div class="price-pix">ou ${formatBRL(p.pixPrice)} à vista no Pix (5% OFF)</div>
            </div>

            <div class="card-actions">
              <button class="btn-add-cart" onclick="window.gaAddToCart(${p.id})">
                <i class="fa-solid fa-cart-shopping"></i> Comprar
              </button>
              <button class="btn-details-quick" title="Ficha Técnica & Medidas" onclick="window.gaOpenProductModal(${p.id})">
                <i class="fa-solid fa-sliders"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // ==========================================================================
  // TABELA DE PRECIFICAÇÃO E VIABILIDADE TAP (DOCUMENTO OFICIAL)
  // ==========================================================================
  function renderTapPricingTable() {
    const tableBody = document.getElementById('tapPricingTableBody');
    if (!tableBody) return;

    let totalCost = 0;
    let totalSale = 0;

    tableBody.innerHTML = PRODUCTS.map((item, idx) => {
      totalCost += item.costPrice;
      totalSale += item.price;
      const profit = item.price - item.costPrice;

      return `
        <tr>
          <td><strong>#${item.id}</strong></td>
          <td><span class="hanko-stamp" style="font-size: 0.65rem;">${item.category}</span></td>
          <td>
            <strong>${item.name}</strong><br>
            <span style="font-family: var(--font-jp); font-size: 0.72rem; color: #64748b;">${item.jpName}</span>
          </td>
          <td>${formatBRL(item.costPrice)}</td>
          <td><strong>${formatBRL(item.price)}</strong></td>
          <td><span style="color: #16a34a; font-weight: 600;">+${formatBRL(profit)}</span></td>
          <td><span class="tap-margin-badge">${item.margin.toFixed(1)}%</span></td>
        </tr>
      `;
    }).join('');

    const totalProfit = totalSale - totalCost;
    const avgMargin = (totalProfit / totalSale) * 100;

    const summaryRow = document.getElementById('tapPricingTableFooter');
    if (summaryRow) {
      summaryRow.innerHTML = `
        <tr style="background: #e2e8f0; font-weight: 800; font-size: 0.88rem;">
          <td colspan="3">TOTAIS DO PORTFÓLIO GRANDE AZUL (17 ITENS)</td>
          <td>${formatBRL(totalCost)}</td>
          <td>${formatBRL(totalSale)}</td>
          <td style="color: #16a34a;">+${formatBRL(totalProfit)}</td>
          <td><span class="tap-margin-badge" style="background: #166534; color: white;">${avgMargin.toFixed(1)}% Médio</span></td>
        </tr>
      `;
    }
  }

  // ==========================================================================
  // MODAL DE PRODUTO, ESPECIFICAÇÕES & TABELA DE MEDIDAS
  // ==========================================================================
  window.gaOpenProductModal = function(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    modalProductTitle.textContent = product.name;
    modalJpSubtitle.textContent = product.jpName;
    modalProductSku.textContent = `SKU: ${product.sku} | Categoria: ${product.category} (${product.jpCategory})`;
    modalProductPrice.textContent = formatBRL(product.price);
    modalProductInstallments.innerHTML = `${product.installments} • ou <strong style="color: #15803d;">${formatBRL(product.pixPrice)}</strong> via Pix`;
    modalProductImage.src = product.image;
    modalProductDesc.textContent = product.fullDesc;
    modalQtyInput.value = 1;

    // Link WhatsApp Consultivo Personalizado
    const message = encodeURIComponent(`Olá, Grande Azul! Gostaria de uma consultoria técnica sobre o produto: ${product.name} (SKU: ${product.sku}). Podem me auxiliar?`);
    modalWhatsappConsultBtn.href = `https://wa.me/5511999998888?text=${message}`;

    // Renderizar Tabela de Especificações Técnicas
    modalSpecsContainer.innerHTML = Object.entries(product.specs).map(([key, val]) => `
      <tr>
        <th>${key}</th>
        <td>${val}</td>
      </tr>
    `).join('');

    // Dicas de Manutenção
    modalMaintenanceText.textContent = product.maintenanceTip || 'Lave sempre com água doce corrente após a submersão no mar e guarde protegido dos raios solares UV.';

    // Gerenciar Tabela de Medidas (Se houver)
    if (product.sizeChart) {
      modalSizeChartTabBtn.style.display = 'inline-block';
      const chart = product.sizeChart;
      
      let tableHtml = `
        <div class="size-chart-table-wrap">
          <table class="size-chart-table">
            <thead>
              <tr>
                ${chart.headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${chart.rows.map(row => `
                <tr>
                  ${row.map(cell => `<td>${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <p style="font-size: 0.74rem; color: var(--color-sumi-muted); margin-top: 8px;">
          * Em caso de dúvida entre dois tamanhos para vestuário e calçados náuticos, consulte nosso consultor via WhatsApp.
        </p>
      `;
      modalSizeChartPanel.innerHTML = tableHtml;
    } else {
      modalSizeChartTabBtn.style.display = 'none';
      modalSizeChartPanel.innerHTML = '';
    }

    // Configurar botão de adicionar do modal
    modalAddToCartBtn.onclick = () => {
      const qty = parseInt(modalQtyInput.value) || 1;
      addToCart(product.id, qty);
      closeProductModal();
    };

    // Resetar abas do modal para "Especificações"
    switchModalTab('specs');

    // Abrir Modal
    productModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeProductModal() {
    productModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function switchModalTab(tabId) {
    document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.modal-tab-panel').forEach(p => p.classList.remove('active'));

    const btn = document.querySelector(`.modal-tab-btn[data-tab="${tabId}"]`);
    const panel = document.getElementById(`modalTabPanel-${tabId}`);
    if (btn) btn.classList.add('active');
    if (panel) panel.classList.add('active');
  }

  // ==========================================================================
  // CARRINHO DE COMPRAS (SHOPPING CART & NUVEMSHOP CHECKOUT FLOW)
  // ==========================================================================
  window.gaAddToCart = function(productId, qty = 1) {
    addToCart(productId, qty);
  };

  function addToCart(productId, qty = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = state.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += qty;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        jpName: product.jpName,
        price: product.price,
        image: product.image,
        sku: product.sku,
        quantity: qty
      });
    }

    saveCart();
    updateCartUI();
    openCartDrawer();
    showToast(`
      <i class="fa-solid fa-circle-check" style="color: #4ade80;"></i>
      <span><strong>${product.name}</strong> adicionado ao carrinho!</span>
    `);
  }

  function saveCart() {
    localStorage.setItem('ga_cart', JSON.stringify(state.cart));
  }

  function openCartDrawer() {
    cartDrawerOverlay.classList.add('active');
    cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    cartDrawerOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateCartUI() {
    const totalItems = state.cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Atualizar badge no header
    if (cartBadge) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    }

    // Atualizar Barra de Progresso de Frete Grátis
    if (cartShippingBarFill && cartShippingBarText) {
      const remaining = state.shippingFreeThreshold - subtotal;
      if (subtotal >= state.shippingFreeThreshold || state.cart.length === 0) {
        if (state.cart.length > 0) {
          cartShippingBarFill.style.width = '100%';
          cartShippingBarText.innerHTML = `🎉 <strong>Parabéns!</strong> Você ganhou <strong>Frete Grátis para todo o Brasil</strong>!`;
          state.shippingCost = 0;
        } else {
          cartShippingBarFill.style.width = '0%';
          cartShippingBarText.innerHTML = `Faltam R$ 399,00 para <strong>Frete Grátis</strong> em compras para todo o Brasil!`;
        }
      } else {
        const percent = Math.min(100, Math.round((subtotal / state.shippingFreeThreshold) * 100));
        cartShippingBarFill.style.width = `${percent}%`;
        cartShippingBarText.innerHTML = `Adicione mais <strong>${formatBRL(remaining)}</strong> para ganhar <strong>Frete Grátis</strong>!`;
      }
    }

    // Renderizar Itens do Carrinho
    if (cartItemsContainer) {
      if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="cart-empty-state">
            <i class="fa-solid fa-basket-shopping"></i>
            <h4 style="font-family: var(--font-serif-jp); margin-bottom: 6px;">Seu carrinho está vazio</h4>
            <p style="font-size: 0.8rem;">Explore o catálogo de mergulho Grande Azul e selecione seus equipamentos.</p>
          </div>
        `;
      } else {
        cartItemsContainer.innerHTML = state.cart.map(item => `
          <div class="cart-item-row">
            <img class="cart-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='assets/logo.jpg'">
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <div class="cart-item-price">${formatBRL(item.price)}</div>
              <div class="cart-item-qty-ctrl">
                <button class="qty-btn" onclick="window.gaChangeQty(${item.id}, -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="window.gaChangeQty(${item.id}, 1)">+</button>
              </div>
            </div>
            <button class="cart-item-remove-btn" title="Remover item" onclick="window.gaRemoveFromCart(${item.id})">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `).join('');
      }
    }

    // Cálculo de Descontos e Frete
    let discount = 0;
    if (state.appliedCoupon) {
      if (state.appliedCoupon === 'GRANDEAZUL10') {
        discount = subtotal * 0.10;
      } else if (state.appliedCoupon === 'BEMVINDO') {
        discount = 50.00;
      }
    }

    const shipping = subtotal >= state.shippingFreeThreshold ? 0 : state.shippingCost;
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatBRL(subtotal);
    if (cartDiscountEl) cartDiscountEl.textContent = discount > 0 ? `-${formatBRL(discount)}` : 'R$ 0,00';
    if (cartShippingEl) cartShippingEl.textContent = shipping === 0 ? (subtotal > 0 ? 'GRÁTIS' : 'R$ 0,00') : formatBRL(shipping);
    if (cartTotalEl) cartTotalEl.textContent = formatBRL(finalTotal);

    if (checkoutOrderBtn) {
      checkoutOrderBtn.disabled = state.cart.length === 0;
      checkoutOrderBtn.style.opacity = state.cart.length === 0 ? '0.6' : '1';
    }
  }

  window.gaChangeQty = function(id, delta) {
    const item = state.cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      state.cart = state.cart.filter(i => i.id !== id);
    }
    saveCart();
    updateCartUI();
  };

  window.gaRemoveFromCart = function(id) {
    state.cart = state.cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
  };

  // Cálculo de Frete Simulado
  if (shippingCalcBtn && shippingCepInput) {
    shippingCalcBtn.addEventListener('click', () => {
      const cep = shippingCepInput.value.replace(/\D/g, '');
      if (cep.length !== 8) {
        alert('Por favor, informe um CEP válido com 8 dígitos.');
        return;
      }

      state.shippingZip = cep;
      const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      if (subtotal >= state.shippingFreeThreshold) {
        state.shippingCost = 0;
        shippingResultRow.style.display = 'block';
        shippingResultRow.innerHTML = `<i class="fa-solid fa-truck-fast"></i> CEP ${cep}: <strong>Frete Grátis</strong> (Correios Sedex - 3 a 5 dias úteis)`;
      } else {
        state.shippingCost = 35.00; // Frete padrão
        shippingResultRow.style.display = 'block';
        shippingResultRow.innerHTML = `<i class="fa-solid fa-truck-fast"></i> CEP ${cep}: PAC R$ 35,00 (4 a 6 dias úteis) | Sedex R$ 58,00`;
      }
      updateCartUI();
    });
  }

  // ==========================================================================
  // CHECKOUT MODAL (FINALIZAR PEDIDO NUVEMSHOP)
  // ==========================================================================
  if (checkoutOrderBtn) {
    checkoutOrderBtn.addEventListener('click', () => {
      if (state.cart.length === 0) return;
      openCheckoutModal();
    });
  }

  function openCheckoutModal() {
    if (!checkoutModalBackdrop) return;
    const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal >= state.shippingFreeThreshold ? 0 : state.shippingCost;
    const finalTotal = subtotal + shipping;

    const summaryList = document.getElementById('checkoutItemsSummary');
    if (summaryList) {
      summaryList.innerHTML = state.cart.map(item => `
        <div style="display: flex; justify-content: space-between; font-size: 0.84rem; padding: 6px 0; border-bottom: 1px dashed #e2e8f0;">
          <span>${item.quantity}x ${item.name}</span>
          <strong>${formatBRL(item.price * item.quantity)}</strong>
        </div>
      `).join('');
    }

    const checkoutTotalVal = document.getElementById('checkoutTotalVal');
    if (checkoutTotalVal) {
      checkoutTotalVal.textContent = formatBRL(finalTotal);
    }

    checkoutModalBackdrop.classList.add('active');
    closeCartDrawer();
  }

  function closeCheckoutModal() {
    if (checkoutModalBackdrop) {
      checkoutModalBackdrop.classList.remove('active');
    }
  }

  // Botão de envio via WhatsApp do Pedido
  const confirmWhatsappOrderBtn = document.getElementById('confirmWhatsappOrderBtn');
  if (confirmWhatsappOrderBtn) {
    confirmWhatsappOrderBtn.addEventListener('click', () => {
      const itemsText = state.cart.map(i => `• ${i.quantity}x ${i.name} (${formatBRL(i.price * i.quantity)})`).join('%0A');
      const subtotal = state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const total = subtotal + (subtotal >= state.shippingFreeThreshold ? 0 : state.shippingCost);
      
      const msg = `*PEDIDO GRANDE AZUL - E-COMMERCE NUVEMSHOP*%0A%0A` +
                  `Olá! Gostaria de finalizar meu pedido pelo canal consultivo da Grande Azul:%0A%0A` +
                  `${itemsText}%0A%0A` +
                  `*Total:* ${formatBRL(total)}%0A` +
                  `*Forma de Pagamento:* A combinar (Pix 5% OFF / Cartão em 10x)%0A%0A` +
                  `Aguardo as instruções para envio!`;
      
      window.open(`https://wa.me/5511999998888?text=${msg}`, '_blank');
      state.cart = [];
      saveCart();
      updateCartUI();
      closeCheckoutModal();
      showToast('Pedido encaminhado com sucesso ao nosso especialista!');
    });
  }

  // ==========================================================================
  // WIZARD CONSULTIVO DO MERGULHADOR (ダイバーの相談室)
  // ==========================================================================
  function setupWizard() {
    const optionBtns = document.querySelectorAll('.wizard-option-btn');
    const resultBox = document.getElementById('wizardResultBox');
    const resultContent = document.getElementById('wizardResultContent');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.getAttribute('data-group');
        const val = btn.getAttribute('data-value');

        // Deselecionar irmãos do mesmo grupo
        document.querySelectorAll(`.wizard-option-btn[data-group="${group}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.wizardSelection[group] = val;

        // Se todos os 3 passos foram preenchidos, gera recomendação
        if (state.wizardSelection.level && state.wizardSelection.water && state.wizardSelection.priority) {
          generateRecommendation(resultBox, resultContent);
        }
      });
    });
  }

  function generateRecommendation(container, textContainer) {
    const { level, water, priority } = state.wizardSelection;
    let recProducts = [];
    let tip = "";

    if (level === 'snorkeling') {
      recProducts = [4, 6, 12]; // Kit Máscara/Snorkel, Rashguard UV, Spray Antiembaçante
      tip = "Para snorkeling e turismo costeiro, leveza e conforto respiratório são fundamentais. Recomendamos o Kit Máscara Ultra-Clear + Camisa Térmica UV50+ e Spray Antiembaçante.";
    } else if (level === 'advanced') {
      recProducts = [1, 2, 3, 11]; // Cilindro S80, Spare Air, BCD, Lanterna 1000Lm
      tip = "Para mergulho autônomo avançado e profundo, redundância e segurança são inegociáveis. O Cilindro S80 aliado ao Mini Cilindro Spare Air e Lanterna LED 1000Lm garantem operação de ponta.";
    } else {
      // Recreativo Open Water
      if (priority === 'thermal' || water === 'cold') {
        recProducts = [5, 7, 9, 8]; // Roupa 3mm, Nadadeiras, Botas, Luvas
        tip = "Em águas temperadas ou frias, o isolamento térmico 3mm com bota vulcanizada e nadadeiras de mola é o conjunto ideal para manter temperatura corporal e propulsão estável.";
      } else {
        recProducts = [3, 4, 7, 10]; // Colete BCD, Kit Máscara, Nadadeiras, Câmera
        tip = "O setup essencial do mergulhador recreativo: Colete BCD anatômico com lastro integrado, nadadeiras reguláveis e câmera subaquática 4K para registrar sua expedição.";
      }
    }

    const items = recProducts.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
    const packTotal = items.reduce((acc, i) => acc + i.price, 0);

    textContainer.innerHTML = `
      <div style="margin-bottom: 12px;">
        <span class="hanko-stamp">Recomendação Consultiva</span>
        <p style="font-size: 0.88rem; color: #f1f5f9; margin-top: 8px;">${tip}</p>
      </div>
      <div style="background: rgba(10, 25, 47, 0.6); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 14px;">
        <div style="font-weight: 700; color: #38bdf8; margin-bottom: 6px;">Pacote Personalizado Selecionado:</div>
        <ul style="list-style: none; font-size: 0.82rem;">
          ${items.map(it => `<li>✓ ${it.name} - <strong>${formatBRL(it.price)}</strong></li>`).join('')}
        </ul>
        <div style="margin-top: 10px; font-weight: 800; font-size: 0.95rem; color: white;">
          Valor Total do Kit: ${formatBRL(packTotal)} (em até 10x sem juros)
        </div>
      </div>
      <button id="addWizardPackBtn" class="btn-primary-ocean" style="width: 100%; justify-content: center; padding: 10px;">
        <i class="fa-solid fa-cart-plus"></i> Adicionar Pacote Completo ao Carrinho
      </button>
    `;

    container.style.display = 'block';

    const addPackBtn = document.getElementById('addWizardPackBtn');
    if (addPackBtn) {
      addPackBtn.onclick = () => {
        items.forEach(it => addToCart(it.id, 1));
        showToast('Pacote consultivo completo adicionado ao seu carrinho!');
      };
    }
  }

  // ==========================================================================
  // EVENT LISTENERS E CONTROLES GERAIS
  // ==========================================================================
  function bindEvents() {
    // Busca instantânea
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderProducts();
      });
    }

    // Ordenação
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderProducts();
      });
    }

    // Carrinho Drawer
    if (cartTriggerBtn) cartTriggerBtn.addEventListener('click', openCartDrawer);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
    if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCartDrawer);

    // Modal Produto
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductModal);
    if (productModalBackdrop) {
      productModalBackdrop.addEventListener('click', (e) => {
        if (e.target === productModalBackdrop) closeProductModal();
      });
    }

    // Abas do Modal
    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchModalTab(btn.getAttribute('data-tab'));
      });
    });

    // Checkout Modal
    if (checkoutModalCloseBtn) checkoutModalCloseBtn.addEventListener('click', closeCheckoutModal);

    // Toggle Visão TAP
    if (tapViewToggle) {
      tapViewToggle.addEventListener('click', () => {
        state.showTapMetrics = !state.showTapMetrics;
        tapViewToggle.classList.toggle('active', state.showTapMetrics);
        document.body.classList.toggle('show-tap-metrics', state.showTapMetrics);
        
        showToast(state.showTapMetrics 
          ? '<i class="fa-solid fa-chart-pie" style="color: #38bdf8;"></i> Visão TAP Ativada: Custos e Margens Brutas visíveis nos produtos!'
          : '<i class="fa-solid fa-store"></i> Modo Loja Nuvemshop Padrão Restaurado.'
        );
      });
    }

    // Cupom de Desconto no Carrinho
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponInput = document.getElementById('couponInput');
    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        if (code === 'GRANDEAZUL10') {
          state.appliedCoupon = 'GRANDEAZUL10';
          showToast('Cupom GRANDEAZUL10 aplicado: 10% de desconto!');
        } else if (code === 'BEMVINDO') {
          state.appliedCoupon = 'BEMVINDO';
          showToast('Cupom BEMVINDO aplicado: R$ 50,00 de desconto!');
        } else {
          alert('Cupom inválido. Tente usar GRANDEAZUL10 para 10% OFF.');
          return;
        }
        updateCartUI();
      });
    }

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeProductModal();
        closeCartDrawer();
        closeCheckoutModal();
      }
    });
  }

  // Inicializar Sistema
  init();
});
