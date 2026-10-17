/**
 * LUSTUREBERG - Luxury Furniture & Signature Tabletops
 * Client-Side Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initProductsDropdown();
  initQuoteModal();
  initProductModal();
  initFilters();
  initLazyImages();
});

// 1. Header scroll effect
function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-sm', 'bg-white/95', 'backdrop-blur-md');
      header.classList.remove('bg-cream-canvas/95');
    } else {
      header.classList.remove('shadow-sm', 'bg-white/95', 'backdrop-blur-md');
      header.classList.add('bg-cream-canvas/95');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// 2. Mobile menu drawer
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.remove('translate-x-full');
    backdrop?.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.add('translate-x-full');
    backdrop?.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openDrawer();
  });

  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  // Close when clicking nav links inside drawer
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// 3. Products Dropdown (Desktop Click + Hover & Mobile Accordion)
function initProductsDropdown() {
  // Desktop dropdown
  const desktopContainers = document.querySelectorAll('.products-dropdown-container');
  
  desktopContainers.forEach(container => {
    const toggle = container.querySelector('.products-dropdown-toggle');
    const menu = container.querySelector('.products-dropdown-menu');
    const arrow = container.querySelector('.dropdown-arrow');
    if (!toggle || !menu) return;

    let isOpen = false;

    const openMenu = () => {
      isOpen = true;
      menu.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-1');
      menu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      toggle.setAttribute('aria-expanded', 'true');
      if (arrow) arrow.classList.add('rotate-180');
    };

    const closeMenu = () => {
      isOpen = false;
      menu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-1');
      menu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      toggle.setAttribute('aria-expanded', 'false');
      if (arrow) arrow.classList.remove('rotate-180');
    };

    // Toggle on click
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) {
        closeMenu();
      } else {
        // Close other dropdowns first
        document.querySelectorAll('.products-dropdown-menu').forEach(m => {
          m.classList.add('opacity-0', 'pointer-events-none', '-translate-y-1');
          m.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        });
        openMenu();
      }
    });

    // Hover support with safety bridge
    container.addEventListener('mouseenter', openMenu);
    container.addEventListener('mouseleave', () => {
      closeMenu();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    });
  });

  // Mobile Drawer Accordion
  const mobileAccordions = document.querySelectorAll('.mobile-products-accordion');
  mobileAccordions.forEach(accordion => {
    const toggle = accordion.querySelector('.mobile-products-toggle');
    const submenu = accordion.querySelector('.mobile-products-submenu');
    const arrow = accordion.querySelector('.mobile-dropdown-arrow');
    if (!toggle || !submenu) return;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = submenu.classList.contains('hidden');
      if (isHidden) {
        submenu.classList.remove('hidden');
        if (arrow) arrow.classList.add('rotate-180');
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        submenu.classList.add('hidden');
        if (arrow) arrow.classList.remove('rotate-180');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// 4. Global Quote Request Modal
function initQuoteModal() {
  const modal = document.getElementById('quote-modal');
  const openButtons = document.querySelectorAll('[data-open-quote]');
  const closeButtons = document.querySelectorAll('[data-close-quote]');
  const form = document.getElementById('quote-form');
  const successState = document.getElementById('quote-success');

  if (!modal) return;

  const openModal = (productTitle = '') => {
    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      modal.querySelector('.modal-card')?.classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';

    const topicInput = document.getElementById('quote-topic');
    if (topicInput && productTitle) {
      topicInput.value = `Inquiry for: ${productTitle}`;
    }
  };

  const closeModal = () => {
    modal.classList.add('opacity-0');
    modal.querySelector('.modal-card')?.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      if (form && successState) {
        form.classList.remove('hidden');
        successState.classList.add('hidden');
      }
    }, 250);
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product') || '';
      closeProductModalQuickly();
      openModal(product);
    });
  });

  closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Request...';
      }

      setTimeout(() => {
        form.classList.add('hidden');
        if (successState) {
          successState.classList.remove('hidden');
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Request';
        }
      }, 600);
    });
  }
}

function closeProductModalQuickly() {
  const modal = document.getElementById('product-spec-modal');
  if (modal && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden', 'opacity-0');
  }
}

// 5. Product Clickable Image & Spec Lightbox Modal
function initProductModal() {
  const modal = document.getElementById('product-spec-modal');
  if (!modal) return;

  const triggerButtons = document.querySelectorAll('[data-view-product]');
  const closeButtons = modal.querySelectorAll('[data-close-product-modal]');

  const modalImg = document.getElementById('modal-product-img');
  const modalCategory = document.getElementById('modal-product-category');
  const modalTitle = document.getElementById('modal-product-title');
  const modalMaterial = document.getElementById('modal-product-material');
  const modalDimensions = document.getElementById('modal-product-dimensions');
  const modalFinish = document.getElementById('modal-product-finish');
  const modalDesc = document.getElementById('modal-product-desc');
  const modalInquireBtn = document.getElementById('modal-product-inquire-btn');

  const openProduct = (el) => {
    const title = el.getAttribute('data-title') || 'Signature Piece';
    const cat = el.getAttribute('data-category') || 'Furniture';
    const img = el.getAttribute('data-img') || '';
    const mat = el.getAttribute('data-material') || 'Natural Stone & Solid Hardwood';
    const dim = el.getAttribute('data-dimensions') || 'Custom dimensions available';
    const finish = el.getAttribute('data-finish') || 'Honed stone with brushed metal detailing';
    const desc = el.getAttribute('data-desc') || 'Designed and handcrafted to bring enduring character into exceptional architectural spaces.';

    if (modalImg) modalImg.src = img;
    if (modalCategory) modalCategory.textContent = cat;
    if (modalTitle) modalTitle.textContent = title;
    if (modalMaterial) modalMaterial.textContent = mat;
    if (modalDimensions) modalDimensions.textContent = dim;
    if (modalFinish) modalFinish.textContent = finish;
    if (modalDesc) modalDesc.textContent = desc;

    if (modalInquireBtn) {
      modalInquireBtn.setAttribute('data-product', title);
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      modal.querySelector('.modal-card')?.classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden';
  };

  const closeProduct = () => {
    modal.classList.add('opacity-0');
    modal.querySelector('.modal-card')?.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }, 250);
  };

  triggerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openProduct(btn);
    });
  });

  closeButtons.forEach(btn => btn.addEventListener('click', closeProduct));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeProduct();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProduct();
      const quoteModal = document.getElementById('quote-modal');
      if (quoteModal && !quoteModal.classList.contains('hidden')) {
        quoteModal.classList.add('hidden', 'opacity-0');
        document.body.style.overflow = '';
      }
    }
  });
}

// 6. Interactive filter tabs on products page (Category filtering)
function initFilters() {
  const filterButtons = document.querySelectorAll('[data-filter-target]');
  const items = document.querySelectorAll('[data-product-card]');
  const categorySections = document.querySelectorAll('[data-category-section]');

  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-filter-target');

      // Update button styling
      filterButtons.forEach(b => {
        b.classList.remove('text-stone-900', 'border-stone-900', 'bg-stone-100', 'font-semibold');
        b.classList.add('text-stone-500', 'border-transparent');
      });
      btn.classList.add('text-stone-900', 'border-stone-900', 'bg-stone-100', 'font-semibold');
      btn.classList.remove('text-stone-500', 'border-transparent');

      // If category sections exist, toggle section visibility
      if (categorySections.length > 0) {
        categorySections.forEach(sec => {
          const secCategory = sec.getAttribute('data-category-section');
          if (targetCategory === 'all' || secCategory === targetCategory) {
            sec.classList.remove('hidden');
          } else {
            sec.classList.add('hidden');
          }
        });
      }

      // Also filter individual product cards if applicable
      if (items.length > 0) {
        items.forEach(card => {
          const itemCategory = card.getAttribute('data-category-slug');
          if (targetCategory === 'all' || itemCategory === targetCategory) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      }
    });
  });
}

// 7. Image lazy loading
function initLazyImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    if (img.complete) {
      img.classList.add('lazy-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('lazy-loaded'));
    }
  });
}
