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

// Event Listeners inside DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile drawer when tapping outside
  document.addEventListener('click', (e) => {
    const drawer = document.getElementById('mobile-menu-drawer');
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    if (drawer && drawer.classList.contains('open')) {
      if (!drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // Close mobile drawer on desktop resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      closeMobileMenu();
    }
  });
});
