import { getAllProducts, getProductById } from './products.js';
import { getAllIngredients, getIngredientById } from './ingredients.js';
import { SkinSpaceAR,updateARDebug } from './ar.js';



class SkinSpaceApp {
  constructor() {
    this.currentView = 'home';
    this.selectedProduct = null;
    this.selectedIngredient = null;
    this.activeProduct = null;
    this.activeIngredient = null;
    this.activeFilter = 'all';
    this.arEngine = null;
    this.currentARItem = null;
    this.currentARType = null; // 'product' or 'ingredient'
    this.currentARMode = 'webcam'; // 'webcam' or 'sandbox3d'

    this.init();
  }

  init() {
    // 1. Initialize AR Engine

    this.arEngine = new SkinSpaceAR({
      container: document.getElementById('ar-scene-container'),
      onStatusChange: this.handleARStatusChange.bind(this),
      onMarkerFound: this.handleMarkerFound.bind(this),
      onMarkerLost: this.handleMarkerLost.bind(this)
    });

    // 2. Bind DOM elements
    this.bindNavigation();
    this.bindMarkerModal();
    this.bindARHUD();

    // 3. Render initial views
    this.renderProductsGrid();
    this.renderIngredientsGrid();

    // 4. Handle route and setup hash listener as single source of truth
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  /**
   * Router and view transitions driven by URL hash
   */
  navigateTo(viewName) {
    const cleanTarget = viewName.replace(/^#\/?/, '');
    const currentHash = window.location.hash.replace(/^#\/?/, '');
    if (currentHash === cleanTarget) {
      this.handleRoute();
    } else {
      window.location.hash = cleanTarget;
    }
  }

  handleRoute() {
    const rawHash = window.location.hash.replace(/^#\/?/, '') || 'home';
    const [viewName, rawParam] = rawHash.split('/');

    if (viewName === 'product-detail') {
      const targetId = rawParam ? rawParam.replace(/^product:/, '') : (this.selectedProduct?.id || null);
      const prod = (targetId ? getProductById(targetId) : null) || this.selectedProduct || getAllProducts()[0];
      if (prod) {
        this.selectedProduct = prod;
        this.activeProduct = prod;
        this.renderProductDetail(prod);
        this.switchView('product-detail');
        return;
      }
    }

    if (viewName === 'ingredient-detail') {
      const targetId = rawParam ? rawParam.replace(/^ingredient:/, '') : (this.selectedIngredient?.id || null);
      const ing = targetId ? getIngredientById(targetId) : null;
      this.selectedIngredient = ing;
      this.renderIngredientDetail(ing);
      this.switchView('ingredient-detail');
      return;
    }

    if (viewName === 'ar-scanner') {
      let type = 'product';
      let id = null;

      if (rawParam) {
        if (rawParam.includes(':')) {
          const parts = rawParam.split(':');
          type = parts[0];
          id = parts[1];
        } else if (rawParam === 'product' || rawParam === 'ingredient') {
          type = rawParam;
        } else {
          // If rawParam is an ingredient ID without prefix (e.g. hyaluronic-acid)
          if (getIngredientById(rawParam)) {
            type = 'ingredient';
            id = rawParam;
          } else {
            type = 'product';
            id = rawParam;
          }
        }
      } else {
        if (this.currentARType === 'ingredient' || (this.selectedIngredient && !this.selectedProduct)) {
          type = 'ingredient';
        }
      }

      let item = null;
      if (type === 'ingredient') {
        item = id ? getIngredientById(id) : null;
        if (!item) {
          // Gracefully fallback for invalid or unspecified ingredient ID without leaking product state
          item = this.activeIngredient || this.selectedIngredient || getAllIngredients()[0];
        }
        // Store in dedicated active-ingredient state without touching product state
        this.activeIngredient = item;
      } else {
        item = id ? getProductById(id) : null;
        if (!item) {
          // Gracefully fallback for invalid or unspecified product ID
          item = this.activeProduct || this.selectedProduct || getAllProducts()[0];
        }
        this.selectedProduct = item;
        this.activeProduct = item;
      }

      this.currentARType = type;
      this.launchARScanner(item, type);
      return;
    }

    // Default views: home, products, ingredients, about
    const validViews = ['home', 'products', 'ingredients', 'about'];
    const target = validViews.includes(viewName) ? viewName : 'home';
    this.switchView(target);
  }

  switchView(viewName) {
    // If leaving AR scanner, ensure AR camera stops and viewport is closed
    if (viewName !== 'ar-scanner') {
      this.closeARScanner();
    }

    this.currentView = viewName;

    // Toggle active section
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const activeSec = document.getElementById(`view-${viewName}`);
    if (activeSec) {
      activeSec.classList.add('active');
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href')?.replace(/^#\/?/, '') || '';
      if (href === viewName || (viewName === 'ingredient-detail' && href === 'ingredients') || (viewName === 'product-detail' && href === 'products')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile menu if open
    const mobileMenu = document.getElementById('nav-menu');
    if (mobileMenu) {
      mobileMenu.classList.remove('mobile-open');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /**
   * Navigation click handlers
   */
  bindNavigation() {
    // Mobile hamburger menu toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    if (mobileBtn && navMenu) {
      mobileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('mobile-open');
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close mobile menu when tapping anywhere outside
      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('mobile-open')) {
          if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
            navMenu.classList.remove('mobile-open');
            mobileBtn.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }

    // Brand logo
    document.querySelectorAll('.brand-mark').forEach(brand => {
      brand.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('home');
      });
    });

    // Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      if (!link.classList.contains('btn-open-marker-modal')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const href = link.getAttribute('href')?.replace(/^#\/?/, '') || 'home';
          this.navigateTo(href);
        });
      }
    });

    // Top CTA: Try AR
    const tryArNavBtn = document.getElementById('nav-try-ar-btn');
    if (tryArNavBtn) {
      tryArNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const activeProd = this.selectedProduct || getAllProducts()[0];
        this.navigateTo(`ar-scanner/product:${activeProd.id}`);
      });
    }

    // Hero CTAs
    const heroExploreBtn = document.getElementById('hero-explore-btn');
    if (heroExploreBtn) {
      heroExploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('products');
      });
    }

    const heroTryArBtn = document.getElementById('hero-try-ar-btn');
    if (heroTryArBtn) {
      heroTryArBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const activeProd = this.selectedProduct || getAllProducts()[0];
        this.navigateTo(`ar-scanner/product:${activeProd.id}`);
      });
    }

    // Product Category Filter Tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        filterTabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeFilter = e.currentTarget.dataset.filter || 'all';
        this.renderProductsGrid();
      });
    });

    // Footer links navigation
    document.querySelectorAll('.footer-links a').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#') && href !== '#') {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigateTo(href.replace(/^#\/?/, ''));
        });
      }
    });
  }

  /**
   * Marker Modal for Printing / Viewing Hiro Marker
   */
  bindMarkerModal() {
    const modalBackdrop = document.getElementById('marker-modal');
    const openBtns = document.querySelectorAll('.btn-open-marker-modal');
    const closeBtn = document.getElementById('close-marker-modal-btn');
    const printBtn = document.getElementById('print-marker-btn');

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (modalBackdrop) modalBackdrop.classList.add('active');
      });
    });

    if (closeBtn && modalBackdrop) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modalBackdrop.classList.remove('active');
      });
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          modalBackdrop.classList.remove('active');
        }
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.print();
      });
    }
  }

  /**
   * AR HUD Overlay event listeners
   */
  bindARHUD() {
    const backBtn = document.getElementById('ar-back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeARScanner();
        if (this.selectedProduct) {
          this.navigateTo(`product-detail/${this.selectedProduct.id}`);
        } else {
          this.navigateTo('products');
        }
      });
    }

    // Toggle 3D Orbit Sandbox vs AR Webcam
    const modeBtn = document.getElementById('ar-mode-toggle-btn');
    if (modeBtn) {
      modeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextMode = this.currentARMode === 'webcam' ? 'sandbox3d' : 'webcam';
        this.currentARMode = nextMode;
        modeBtn.innerHTML = nextMode === 'sandbox3d'
          ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Switch to AR Webcam`
          : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> 3D Sandbox Mode`;

          this.updateScannerGuide(this.currentARItem, 'initializing');

        if (this.currentARItem) {
          this.arEngine.start(this.currentARItem, nextMode, this.currentARType);
        }
      });
    }

    // Camera permission retry button
    const retryBtn = document.getElementById('ar-retry-camera-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const errorCard = document.getElementById('ar-permission-error');
        if (errorCard) errorCard.classList.remove('active');
        if (this.currentARItem) {
          this.arEngine.start(this.currentARItem, 'webcam', this.currentARType);
        }
      });
    }

    // Camera permission fallback to 3D sandbox
    const fallbackBtn = document.getElementById('ar-fallback-sandbox-btn');
    if (fallbackBtn) {
      fallbackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const errorCard = document.getElementById('ar-permission-error');
        if (errorCard) errorCard.classList.remove('active');
        this.currentARMode = 'sandbox3d';
        this.updateScannerGuide(this.currentARItem, 'scanning');
        const modeBtn = document.getElementById('ar-mode-toggle-btn');
        if (modeBtn) {
          modeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Switch to AR Webcam`;
        }
        if (this.currentARItem) {
          this.arEngine.start(this.currentARItem, 'sandbox3d', this.currentARType);
        }
      });
    }

    // Product Action/Info Button in AR HUD: opens educational drawer
    const productInfoBtn = document.getElementById('ar-product-info-btn');
    if (productInfoBtn) {
      productInfoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const bottomDrawer = document.getElementById('ar-bottom-drawer');
        if (bottomDrawer) {
          const isIngredient = this.currentARType === 'ingredient';
          const activeItem = this.currentARItem || (isIngredient ? this.activeIngredient : this.activeProduct) || (isIngredient ? getAllIngredients()[0] : getAllProducts()[0]);
          this.updateARInfoButton(activeItem, this.currentARType);
          this.populateARDrawer(activeItem);
          bottomDrawer.classList.remove('collapsed');
        }
      });
    }

    // Close button on Educational Drawer: closes drawer while product & info button remain visible
    const drawerCloseBtn = document.getElementById('ar-drawer-close-btn');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const bottomDrawer = document.getElementById('ar-bottom-drawer');
        if (bottomDrawer) {
          bottomDrawer.classList.add('collapsed');
        }
      });
    }

    // Interactive Educational Hotspot on Hyaluronic Acid AR molecule
    const hotspotBtn = document.getElementById('ar-molecule-hotspot');
    const hotspotCard = document.getElementById('ar-hotspot-card');
    if (hotspotBtn) {
      hotspotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (hotspotCard) {
          hotspotCard.classList.remove('hidden');
        }
      });
    }

    // Dismiss hotspot explanation card
    const hotspotCloseBtn = document.getElementById('ar-hotspot-close-btn');
    if (hotspotCloseBtn) {
      hotspotCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (hotspotCard) {
          hotspotCard.classList.add('hidden');
        }
      });
    }
  }

  /**
   * Render Product Explorer Grid
   */
  renderProductsGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const products = getAllProducts();
    const filtered = this.activeFilter === 'all'
      ? products
      : products.filter(p => p.category.toLowerCase() === this.activeFilter.toLowerCase());

    grid.innerHTML = filtered.map(product => `
      <article class="product-card" data-id="${product.id}">
        <div class="product-card-media">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='/assets/images/hero_skincare_science.jpg'" />
        </div>
        <div class="product-card-body">
          <div class="product-meta">
            <span class="product-category-tag">${product.category}</span>
            <span aria-hidden="true">·</span>
            <span>${product.skinTypes.slice(0, 2).join(', ')}</span>
          </div>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-benefits-preview">
            ${product.benefits.slice(0, 2).map(b => `<div class="benefit-bullet">${b}</div>`).join('')}
          </div>
        </div>
        <div class="product-card-footer">
          <button class="btn-secondary btn-view-detail" data-id="${product.id}">
            Learn More
          </button>
          <button class="btn-primary btn-explore-ar" data-id="${product.id}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
            Try AR
          </button>
        </div>
      </article>
    `).join('');

    // Attach event listeners for product cards
    grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-explore-ar')) return;
        e.preventDefault();
        const id = card.dataset.id;
        if (id) {
          this.navigateTo(`product-detail/${id}`);
        }
      });
    });

    grid.querySelectorAll('.btn-explore-ar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = e.currentTarget.dataset.id;
        this.navigateTo(`ar-scanner/product:${id}`);
      });
    });
  }

  /**
   * Render Product Detail View
   */
  renderProductDetail(product) {
    const detailContainer = document.getElementById('product-detail-content');
    if (!detailContainer) return;

    const markerName = product.marker?.name || `${product.name} Marker`;
    const markerImage = product.marker?.image || '/assets/markers/hiro-marker.png';
    const markerInstruction = product.marker?.instruction || `Scan this marker with your phone to explore ${product.name} in augmented reality.`;

    detailContainer.innerHTML = `
      <nav class="breadcrumb-nav">
        <a href="#products" class="breadcrumb-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Products
        </a>
      </nav>

      <div class="product-detail-layout">
        <!-- Visual Column -->
        <div class="product-detail-visual-col">
          <div class="product-detail-media-card">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='/assets/images/hero_skincare_science.jpg'" />
          </div>
        </div>

        <!-- Information Column -->
        <div class="product-detail-info">
          <!-- 1. Product Name & 2. Category -->
          <div class="product-detail-header-block">
            <h1 class="product-detail-title">${product.name}</h1>
            <div class="product-meta">
              <span class="product-category-tag">${product.category}</span>
              <span aria-hidden="true">·</span>
              <span>${markerName}</span>
            </div>
          </div>

          <!-- 3. Description -->
          <div class="detail-section">
            <p class="product-detail-desc">${product.description}</p>
          </div>

          <!-- 4. Benefits -->
          <div class="detail-section">
            <h2 class="detail-section-title">Benefits</h2>
            <ul class="detail-list">
              ${product.benefits.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>

          <!-- 5. Suitable for -->
          <div class="detail-section">
            <h2 class="detail-section-title">Suitable For</h2>
            <div class="product-meta detail-skin-types">
              ${product.skinTypes.map(st => `<span class="skin-type-tag">${st}</span>`).join('')}
            </div>
          </div>

          <!-- 6. Key ingredients -->
          <div class="detail-section">
            <h2 class="detail-section-title">Key Ingredients</h2>
            <p class="detail-section-hint">
              Tap any ingredient to inspect in the Ingredient Lab:
            </p>
            <div class="interactive-ingredients-chips">
              ${product.ingredients.map(ing => `
                <button class="ingredient-chip-btn" data-name="${ing}">
                  ${ing} ↗
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 7. AR Experience Educational Section -->
          <div class="detail-section product-ar-experience-section">
            <h2 class="detail-section-title">AR Experience · ${markerName}</h2>
            <div class="ar-experience-card">
              <div class="ar-experience-marker-wrapper">
                <div class="ar-experience-marker-frame">
                  <img 
                    src="${markerImage}" 
                    alt="${markerName}"
                    class="ar-experience-marker-img"
                  />
                </div>
                <span class="ar-marker-name-badge">${markerName}</span>
              </div>
              
              <div class="ar-experience-content">
                <p class="ar-experience-instruction">
                  ${markerInstruction}
                </p>
                <p class="ar-experience-subhint">
                  ${product.arHint}
                </p>
                <div class="ar-experience-actions">
                  <button class="btn-primary btn-launch-detail-ar" id="detail-launch-ar-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                      <polyline points="2 17 12 22 22 17"/>
                      <polyline points="2 12 12 17 22 12"/>
                    </svg>
                    Try AR
                  </button>
                  <a href="${markerImage}" download="${product.id}-ar-marker.png" class="btn-secondary btn-download-marker" title="Download ${markerName}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download Marker
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Detail view launch AR button
    const launchBtn = document.getElementById('detail-launch-ar-btn');
    if (launchBtn) {
      launchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo(`ar-scanner/product:${product.id}`);
      });
    }

    // Breadcrumb navigation link
    const breadcrumbLink = detailContainer.querySelector('.breadcrumb-back-link');
    if (breadcrumbLink) {
      breadcrumbLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('products');
      });
    }

    // Ingredient chips linking to Ingredient Lab
detailContainer.querySelectorAll('.ingredient-chip-btn').forEach(btn => {
  btn.addEventListener('click', event => {
    event.preventDefault();
    this.showIngredientPopup(btn.dataset.name);
  });
});

  }

  

showIngredientPopup(ingredientName) {
  const ingredient = getAllIngredients().find(
    item => item.name.toLowerCase() === ingredientName.trim().toLowerCase()
  );

  if (!ingredient) return;

  document.getElementById('ingredient-detail-popup')?.remove();

  const popup = document.createElement('div');
  popup.id = 'ingredient-detail-popup';
  popup.className = 'ingredient-popup-backdrop';

  const escapeHTML = value =>
    String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);

  const renderList = items =>
    Array.isArray(items) && items.length
      ? `<ul>${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`
      : '<p>Information not available.</p>';

  popup.innerHTML = `
    <section
      class="ingredient-popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ingredient-popup-title"
    >
      <header class="ingredient-popup-header">
        <div>
          <span class="ingredient-popup-category">
            ${escapeHTML(ingredient.category)}
          </span>
          <h2 id="ingredient-popup-title">${escapeHTML(ingredient.name)}</h2>
          <p>${escapeHTML(ingredient.shortDescription)}</p>
        </div>
        <button
          type="button"
          class="ingredient-popup-close"
          aria-label="Close ingredient details"
        >&times;</button>
      </header>

      <div class="ingredient-popup-body">
        <section>
          <h3>What is it?</h3>
          <p>${escapeHTML(ingredient.whatIsIt)}</p>
        </section>

        <section>
          <h3>Potential Benefits</h3>
          ${renderList(ingredient.benefits)}
        </section>

        <section>
          <h3>Skin Types</h3>
          <div class="ingredient-popup-tags">
            ${(ingredient.skinTypes || [])
              .map(type => `<span>${escapeHTML(type)}</span>`)
              .join('')}
          </div>
        </section>

        <section>
          <h3>Key Facts</h3>
          ${renderList(ingredient.keyFacts)}
        </section>

        <section>
          <h3>Common Products</h3>
          ${renderList(ingredient.commonProducts)}
        </section>

        <aside class="ingredient-popup-quick-fact">
          <strong>Quick Fact</strong>
          <p>${escapeHTML(ingredient.quickFact)}</p>
        </aside>
      </div>

      <footer class="ingredient-popup-footer">
        <button type="button" class="btn-primary ingredient-popup-done">
          Done
        </button>
      </footer>
    </section>
  `;

  document.body.appendChild(popup);

  const closePopup = () => {
    popup.remove();
    document.removeEventListener('keydown', handleEscape);
  };

  const handleEscape = event => {
    if (event.key === 'Escape') closePopup();
  };

  popup.querySelector('.ingredient-popup-close')
    .addEventListener('click', closePopup);

  popup.querySelector('.ingredient-popup-done')
    .addEventListener('click', closePopup);

  popup.addEventListener('click', event => {
    if (event.target === popup) closePopup();
  });

  document.addEventListener('keydown', handleEscape);
}



  /**
   * Render Ingredient Lab Grid
   */
  renderIngredientsGrid() {
    const grid = document.getElementById('ingredient-grid');
    if (!grid) return;

    const ingredients = getAllIngredients();
    grid.innerHTML = ingredients.map(ing => `
      <article class="ingredient-card" data-id="${ing.id}">
        <div class="ingredient-card-header">
          <div>
            <span class="ingredient-role">${ing.category || 'Skin Science'}</span>
            <h3 class="ingredient-name">${ing.name}</h3>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-accent); font-weight: 600; padding: 0.2rem 0.5rem; background: var(--color-accent-subtle); border-radius: var(--radius-sm);">
            ${ing.category || 'Active'}
          </span>
        </div>

        <p class="ingredient-desc">${ing.shortDescription}</p>

        ${Array.isArray(ing.keyFacts) && ing.keyFacts.length > 0 ? `
          <div class="quick-fact-box">
            <strong>Key Educational Fact</strong>
            ${ing.keyFacts[0]}
          </div>
        ` : (ing.quickFact ? `
          <div class="quick-fact-box">
            <strong>Key Educational Fact</strong>
            ${ing.quickFact}
          </div>
        ` : '')}

        <div class="ingredient-card-footer">
          <div class="product-meta">
            ${Array.isArray(ing.skinTypes) ? `<span>${ing.skinTypes.slice(0, 2).join(', ')}</span>` : ''}
          </div>
          <button class="btn-primary btn-explore-ingredient" data-id="${ing.id}" style="padding: 0.5rem 1rem; font-size: 0.8125rem;">
            Explore Ingredient →
          </button>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.btn-explore-ingredient').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = e.currentTarget.dataset.id;
        if (id) {
          this.navigateTo(`ingredient-detail/${id}`);
        }
      });
    });
  }

  /**
   * Render Ingredient Detail View
   */
  renderIngredientDetail(ingredient) {
    const detailContainer = document.getElementById('ingredient-detail-content');
    if (!detailContainer) return;

    if (!ingredient) {
      detailContainer.innerHTML = `
        <nav class="breadcrumb-nav">
          <a href="#ingredients" class="breadcrumb-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Ingredient Lab
          </a>
        </nav>
        <div style="text-align: center; padding: 4rem 1rem;">
          <h2 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Ingredient Not Found</h2>
          <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">
            The requested skincare active could not be located in the Ingredient Lab.
          </p>
          <a href="#ingredients" class="btn-primary" style="display: inline-block;">
            Return to Ingredient Lab
          </a>
        </div>
      `;

      const backLink = detailContainer.querySelector('.breadcrumb-back-link');
      if (backLink) {
        backLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigateTo('ingredients');
        });
      }
      return;
    }

    const markerObj = typeof ingredient.marker === 'object' && ingredient.marker !== null ? ingredient.marker : null;
    const markerName = markerObj?.name || (ingredient.marker === 'hiro' ? 'Hiro Marker' : `${ingredient.name} Marker`);
    const markerImage = markerObj?.image || '/assets/markers/hiro-marker.png';
    const markerInstruction = markerObj?.instruction || `Scan this marker with your phone to explore ${ingredient.name} in augmented reality.`;
    const markerDownloadName = `${ingredient.id}-ar-marker.png`;
    const markerSubhint = ingredient.arHint || `Aim your camera at the ${markerName} to anchor the 3D molecular humectant model in spatial AR.`;

    detailContainer.innerHTML = `
      <nav class="breadcrumb-nav">
        <a href="#ingredients" class="breadcrumb-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Ingredient Lab
        </a>
      </nav>

      <div class="product-detail-layout">
        <!-- Visual Column -->
        <div class="product-detail-visual-col">
          <div class="product-detail-media-card">
            <img src="/assets/images/hero_skincare_science.jpg" alt="${ingredient.name} Molecular Science" />
          </div>
        </div>

        <!-- Information Column -->
        <div class="product-detail-info">
          <!-- 1. Ingredient Name & Category -->
          <div class="product-detail-header-block">
            <h1 class="product-detail-title">${ingredient.name}</h1>
            <div class="product-meta">
              <span class="product-category-tag">${ingredient.category || 'Active Molecule'}</span>
              <span aria-hidden="true">·</span>
              <span>Molecular Science</span>
            </div>
          </div>

          <!-- 2. Short Description -->
          <div class="detail-section">
            <p class="product-detail-desc">${ingredient.shortDescription}</p>
          </div>

          <!-- 3. What is it? -->
          ${ingredient.whatIsIt ? `
            <div class="detail-section">
              <h2 class="detail-section-title">What Is It?</h2>
              <p class="product-detail-desc">${ingredient.whatIsIt}</p>
            </div>
          ` : ''}

          <!-- 4. Benefits -->
          ${Array.isArray(ingredient.benefits) && ingredient.benefits.length > 0 ? `
            <div class="detail-section">
              <h2 class="detail-section-title">Skin Benefits</h2>
              <ul class="detail-list">
                ${ingredient.benefits.map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- 5. Suitable Skin Types -->
          ${Array.isArray(ingredient.skinTypes) && ingredient.skinTypes.length > 0 ? `
            <div class="detail-section">
              <h2 class="detail-section-title">Suitable Skin Types</h2>
              <div class="product-meta detail-skin-types">
                ${ingredient.skinTypes.map(st => `<span class="skin-type-tag">${st}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 6. Key Scientific Facts -->
          ${Array.isArray(ingredient.keyFacts) && ingredient.keyFacts.length > 0 ? `
            <div class="detail-section">
              <h2 class="detail-section-title">Key Scientific Facts</h2>
              <ul class="detail-list">
                ${ingredient.keyFacts.map(fact => `<li>${fact}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- 7. Common Product Types -->
          ${Array.isArray(ingredient.commonProducts) && ingredient.commonProducts.length > 0 ? `
            <div class="detail-section">
              <h2 class="detail-section-title">Common Product Types</h2>
              <div class="product-meta detail-skin-types">
                ${ingredient.commonProducts.map(cp => `<span class="skin-type-tag" style="background: var(--color-surface); border: 1px solid var(--color-border);">${cp}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 8. AR Experience Educational Section -->
          <div class="detail-section product-ar-experience-section">
            <h2 class="detail-section-title">AR Molecular Experience · ${markerName}</h2>
            <div class="ar-experience-card">
              <div class="ar-experience-marker-wrapper">
                <div class="ar-experience-marker-frame">
                  <img 
                    src="${markerImage}" 
                    alt="${ingredient.name} AR Marker (${markerName})"
                    class="ar-experience-marker-img"
                  />
                </div>
                <span class="ar-marker-name-badge">${markerName}</span>
              </div>
              
              <div class="ar-experience-content">
                <p class="ar-experience-instruction">
                  ${markerInstruction}
                </p>
                <p class="ar-experience-subhint">
                  ${markerSubhint}
                </p>
                <div class="ar-experience-actions">
                  <button class="btn-primary btn-launch-detail-ar" id="ingredient-launch-ar-btn" title="Explore ${ingredient.name} in AR">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                      <polyline points="2 17 12 22 22 17"/>
                      <polyline points="2 12 12 17 22 12"/>
                    </svg>
                    Try AR
                  </button>
                  <a href="${markerImage}" download="${markerDownloadName}" class="btn-secondary btn-download-marker" title="Download ${markerName}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download Marker
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Breadcrumb navigation link
    const breadcrumbLink = detailContainer.querySelector('.breadcrumb-back-link');
    if (breadcrumbLink) {
      breadcrumbLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo('ingredients');
      });
    }

    // Wire the ingredient detail "Try AR" button to the existing AR route
    const arBtn = document.getElementById('ingredient-launch-ar-btn');
    if (arBtn) {
      arBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateTo(`ar-scanner/ingredient:${ingredient.id}`);
      });
    }
  }

  /**
   * Update and configure AR Info Button identity and attributes
   */
  updateARInfoButton(item, type = 'product') {
    const productInfoBtn = document.getElementById('ar-product-info-btn');
    if (!productInfoBtn || !item) return;

    const isIngredient = type === 'ingredient';
    const itemName = item.name || (isIngredient ? 'Active Ingredient' : 'Skincare Product');
    const labelText = isIngredient
      ? `View ${itemName} science & information`
      : `View ${itemName} information`;

    productInfoBtn.setAttribute('title', labelText);
    productInfoBtn.setAttribute('aria-label', labelText);
    productInfoBtn.setAttribute('data-product-id', item.id);
    productInfoBtn.setAttribute('data-product-name', itemName);
    productInfoBtn.setAttribute('data-item-id', item.id);
    productInfoBtn.setAttribute('data-item-type', type);
  }

  /**
   * Populate Educational AR Bottom Drawer
   */
  populateARDrawer(item) {
    const isIngredient = this.currentARType === 'ingredient';
    const targetItem = item || (isIngredient ? (this.activeIngredient || this.currentARItem || getAllIngredients()[0]) : (this.activeProduct || this.selectedProduct || this.currentARItem || getAllProducts()[0]));
    if (!targetItem) return;

    const titleEl = document.getElementById('ar-drawer-title');
    const categoryEl = document.getElementById('ar-drawer-category');
    const contentEl = document.getElementById('ar-drawer-content') || document.querySelector('.drawer-content');

    if (titleEl) titleEl.textContent = targetItem.name || '';
    if (categoryEl) categoryEl.textContent = targetItem.category || '';

    if (!contentEl) return;

    if (isIngredient) {
      // Ingredient AR Session: Display ONLY active ingredient science and NO product data
      contentEl.innerHTML = `
        <!-- 1. What is it? -->
        <div class="drawer-section">
          <span class="drawer-label">What is it?</span>
          <p class="drawer-desc" id="ar-drawer-desc">${targetItem.whatIsIt || targetItem.shortDescription || ''}</p>
        </div>

        <!-- 2. Benefits -->
        ${Array.isArray(targetItem.benefits) && targetItem.benefits.length > 0 ? `
          <div class="drawer-section">
            <span class="drawer-label">Benefits</span>
            <ul class="drawer-benefits" id="ar-drawer-benefits">
              ${targetItem.benefits.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- 3. Key Facts -->
        ${Array.isArray(targetItem.keyFacts) && targetItem.keyFacts.length > 0 ? `
          <div class="drawer-section">
            <span class="drawer-label">Key facts</span>
            <ul class="drawer-benefits">
              ${targetItem.keyFacts.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- 4. Suitable Skin Types & Common Product Types -->
        <div class="drawer-grid">
          <div>
            <span class="drawer-label">Suitable for</span>
            <p class="drawer-val" id="ar-drawer-skintypes">${Array.isArray(targetItem.skinTypes) ? targetItem.skinTypes.join(' · ') : (targetItem.skinTypes || '')}</p>
          </div>
          <div>
            <span class="drawer-label">Common product types</span>
            <p class="drawer-val" id="ar-drawer-ingredients">${Array.isArray(targetItem.commonProducts) ? targetItem.commonProducts.join(' · ') : (targetItem.commonProducts || '')}</p>
          </div>
        </div>
      `;
    } else {
      // Product AR Session: Maintain existing product info layout
      contentEl.innerHTML = `
        <div class="drawer-section">
          <span class="drawer-label">Description</span>
          <p class="drawer-desc" id="ar-drawer-desc">${targetItem.description || ''}</p>
        </div>

        <div class="drawer-section">
          <span class="drawer-label">Benefits</span>
          <ul class="drawer-benefits" id="ar-drawer-benefits">
            ${Array.isArray(targetItem.benefits) ? targetItem.benefits.map(b => `<li>${b}</li>`).join('') : ''}
          </ul>
        </div>

        <div class="drawer-grid">
          <div>
            <span class="drawer-label">Suitable for</span>
            <p class="drawer-val" id="ar-drawer-skintypes">${Array.isArray(targetItem.skinTypes) ? targetItem.skinTypes.join(' · ') : (targetItem.skinTypes || '')}</p>
          </div>
          <div>
            <span class="drawer-label">Key ingredients</span>
            <p class="drawer-val" id="ar-drawer-ingredients">${Array.isArray(targetItem.ingredients) ? targetItem.ingredients.join(' · ') : (targetItem.ingredients || '')}</p>
          </div>
        </div>
      `;
    }
  }

  
  /**
   * Update the guided scanner card for the active product or ingredient.
   */
updateScannerGuide(item = this.currentARItem, status = 'initializing') {
  const guide = document.getElementById('ar-scan-guide');
  const image = document.getElementById('ar-scan-guide-image');
  const title = document.getElementById('ar-scan-guide-title');
  const eyebrow = document.getElementById('ar-scan-guide-eyebrow');
  const message = document.getElementById('ar-scan-guide-message');

  if (!guide) return;

  const scannerView = document.getElementById('view-ar-scanner');
  const isScannerVisible =
    scannerView &&
    !scannerView.hidden &&
    getComputedStyle(scannerView).display !== 'none';

  if (!item || !isScannerVisible) {
    guide.hidden = true;
    guide.classList.remove('is-visible', 'is-detected');
    return;
  }

  const isIngredient = this.currentARType === 'ingredient';
  const itemName =
    item.name || (isIngredient ? 'Active Ingredient' : 'Skincare Product');
  const markerImage =
    item.marker?.image || '/assets/markers/hiro-marker.png';
  const isSandbox = this.currentARMode === 'sandbox3d';

  if (image) {
    image.src = markerImage;
    image.alt = `Marker used to explore ${itemName}`;
  }

  guide.hidden = false;
  guide.classList.add('is-visible');
  guide.classList.toggle('is-detected', status === 'detected');

  if (eyebrow) {
    eyebrow.textContent = isSandbox
      ? '3D SANDBOX'
      : isIngredient
        ? 'INGREDIENT LAB'
        : 'YOUR SELECTED PRODUCT';
  }

  if (title) {
    title.textContent = isSandbox
      ? `Exploring: ${itemName}`
      : status === 'detected'
        ? `${itemName} detected`
        : `Exploring: ${itemName}`;
  }

  const messages = isSandbox
    ? 'Rotate and explore the 3D model. Open the information button to learn more.'
    : {
        initializing:
          'Preparing your camera… Get your Hiro marker ready.',
        scanning:
          'Allow camera access, then point it at the Hiro marker shown here.',
        lost:
          'Marker not in view. Bring the full Hiro marker back into the camera frame.',
        detected:
          'Marker detected! Tap the ⓘ button to explore the educational details.',
        error:
          'Camera unavailable. Retry access or switch to 3D Sandbox mode.'
      };

  if (message) {
    message.textContent = isSandbox
      ? messages
      : messages[status] ||
        'Point your camera at the Hiro marker shown here.';
  }
}

  /**
   * Launch AR Scanner Viewport
   */
  launchARScanner(item, type = 'product') {
    this.currentARItem = item;
    this.currentARType = type;
    if (type === 'product') {
      this.activeProduct = item;
      this.selectedProduct = item;
    } else {
      this.activeIngredient = item;
    }

    this.currentView = 'ar-scanner';
    document.body.classList.add('ar-active');

    const scannerViewport = document.getElementById('ar-scanner-viewport');
    if (scannerViewport) {
      scannerViewport.classList.add('active');
    }

    // Configure AR info button and populate educational drawer
    this.updateARInfoButton(item, type);
this.populateARDrawer(item);
this.updateScannerGuide(item, 'initializing');

    // Reset status UI
    this.updateScannerGuide(this.currentARItem, status);

    // Reset hotspot state
    const initialHotspotBtn = document.getElementById('ar-molecule-hotspot');
    if (initialHotspotBtn) {
      initialHotspotBtn.classList.add('hidden');
    }
    const initialHotspotCard = document.getElementById('ar-hotspot-card');
    if (initialHotspotCard) {
      initialHotspotCard.classList.add('hidden');
    }

    // DEBUG: Verify which product is sent to the AR engine
   updateARDebug({
  status: "STARTING AR",
  product: item,
  markerId: item.marker?.id,
  modelStatus: "WAITING"
});

    // Start AR Engine
    this.arEngine.start(item, this.currentARMode, type);
  }


  closeARScanner() {
    const scannerViewport = document.getElementById('ar-scanner-viewport');
    if (scannerViewport) {
      scannerViewport.classList.remove('active');
    }
    const productInfoBtn = document.getElementById('ar-product-info-btn');
    if (productInfoBtn) {
      productInfoBtn.classList.add('hidden');
      productInfoBtn.removeAttribute('data-product-id');
      productInfoBtn.removeAttribute('data-product-name');
      productInfoBtn.removeAttribute('data-item-id');
      productInfoBtn.removeAttribute('data-item-type');
      productInfoBtn.setAttribute('title', 'View information');
      productInfoBtn.setAttribute('aria-label', 'View information');
    }
    const hotspotBtn = document.getElementById('ar-molecule-hotspot');
    if (hotspotBtn) {
      hotspotBtn.classList.add('hidden');
    }
    const hotspotCard = document.getElementById('ar-hotspot-card');
    if (hotspotCard) {
      hotspotCard.classList.add('hidden');
    }
    const bottomDrawer = document.getElementById('ar-bottom-drawer');
    if (bottomDrawer) {
      bottomDrawer.classList.add('collapsed');
    }
    const reticleContainer = document.getElementById('ar-reticle-container');
    if (reticleContainer) {
      reticleContainer.className = 'ar-reticle-container';
    }
    const errorCard = document.getElementById('ar-permission-error');
    if (errorCard) {
      errorCard.classList.remove('active');
    }

    // Stop AR engine and clear media/DOM/style artifacts
    this.arEngine.stop();

    // Reset AR session variables
    this.currentARItem = null;
    this.currentARType = null;

    // Reset document-level classes and inline styles
    document.body.classList.remove('ar-active', 'a-fullscreen', 'a-body', 'drawer-open');
    document.documentElement.classList.remove('a-fullscreen', 'a-html', 'ar-active');
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('height');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('height');
    document.body.style.removeProperty('position');

    // Force window resize event so all normal responsive layout calculations and scroll metrics restore immediately
    window.dispatchEvent(new Event('resize'));
  }

  /**
   * AR Engine Callback handlers
   */
  handleARStatusChange({ status, message }) {
    this.updateHUDStatus(status, message);
  }

  updateHUDStatus(status, message) {
    const badge = document.getElementById('ar-status-badge');
    const instructionPill = document.getElementById('ar-instruction-pill');
    const reticleContainer = document.getElementById('ar-reticle-container');
    const errorCard = document.getElementById('ar-permission-error');
    const bottomDrawer = document.getElementById('ar-bottom-drawer');
    const productInfoBtn = document.getElementById('ar-product-info-btn');

    if (!badge) return;

    // Minimal status dot and text
    const dot = badge.querySelector('.status-dot');
    const text = badge.querySelector('.status-text');

    if (dot) {
      dot.className = `status-dot ${status}`;
    }

    if (text) {
      const statusLabels = {
        initializing: 'INITIALIZING',
        scanning: 'READY',
        detected: 'TRACKED',
        lost: 'SCANNING',
        error: 'ERROR'
      };
      text.textContent = statusLabels[status] || status.toUpperCase();
    }

    // Short bottom scanning instruction
    if (instructionPill) {
      if (status === 'detected') {
        const itemName = this.currentARItem?.name || (this.currentARType === 'ingredient' ? 'Active Molecule' : (this.activeProduct?.name || 'Product'));
        instructionPill.textContent = `${itemName} tracked · Tap ⓘ for details`;
      } else if (status === 'lost') {
        instructionPill.textContent = 'Point camera at Hiro marker';
      } else if (status === 'error') {
        instructionPill.textContent = 'Camera unavailable';
      } else {
        instructionPill.textContent = 'Point camera at Hiro marker';
      }
    }

    // Reticle frame state: fades out when detected
    if (reticleContainer) {
      reticleContainer.className = `ar-reticle-container ${status}`;
    }

    // When marker is detected, prioritize: 1. product, 2. info button, 3. minimal status
    const isHyaluronic = this.currentARType === 'ingredient' && (this.currentARItem?.id === 'hyaluronic-acid' || this.activeIngredient?.id === 'hyaluronic-acid');
    const hotspotBtn = document.getElementById('ar-molecule-hotspot');
    const hotspotCard = document.getElementById('ar-hotspot-card');

    if (status === 'detected') {
      if (productInfoBtn) {
        const activeTarget = this.currentARItem || (this.currentARType === 'ingredient' ? this.activeIngredient : this.activeProduct);
        if (activeTarget) {
          this.updateARInfoButton(activeTarget, this.currentARType);
        }
        productInfoBtn.classList.remove('hidden');
      }
      if (hotspotBtn) {
        if (isHyaluronic) {
          hotspotBtn.classList.remove('hidden');
        } else {
          hotspotBtn.classList.add('hidden');
        }
      }
      if (bottomDrawer && this.currentARMode === 'sandbox3d') {
        if (this.currentARItem) {
          this.populateARDrawer(this.currentARItem);
        }
        bottomDrawer.classList.remove('collapsed');
      }
    } else {
      if (productInfoBtn) {
        productInfoBtn.classList.add('hidden');
      }
      if (hotspotBtn) {
        hotspotBtn.classList.add('hidden');
      }
      if (hotspotCard) {
        hotspotCard.classList.add('hidden');
      }
      if (bottomDrawer) {
        bottomDrawer.classList.add('collapsed');
      }
    }

    // Permission Error screen
    if (errorCard) {
      if (status === 'error') {
        errorCard.classList.add('active');
        const desc = errorCard.querySelector('.ar-permission-desc');
        if (desc && message) desc.textContent = message;
      } else {
        errorCard.classList.remove('active');
      }
    }
  }

  handleMarkerFound(item) {
    const isIngredient = this.currentARType === 'ingredient';
    const activeTarget = this.currentARItem || (isIngredient ? this.activeIngredient : this.activeProduct) || item;
    if (activeTarget) {
      if (isIngredient) {
        this.activeIngredient = activeTarget;
        this.currentARItem = activeTarget;
      } else {
        this.activeProduct = activeTarget;
        this.selectedProduct = activeTarget;
        this.currentARItem = activeTarget;
      }
      this.updateARInfoButton(this.currentARItem, this.currentARType);
      this.populateARDrawer(this.currentARItem);
    }
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(60);
      } catch (e) {
        // Ignore
      }
    }
  }

  handleMarkerLost(item) {
    // Preserve active session type and context - never reset target to product
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.skinSpaceApp = new SkinSpaceApp();
});
