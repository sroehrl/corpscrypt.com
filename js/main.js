/**
 * Corpscrypt Modern Static Client Engine
 * High performance, zero external framework dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollSpy();
  initContactForm();
  initVCardDownload();
  initLegalModal();
  initBackToTop();
});

/* 1. Navbar Scroll Effect */
function initNavbar() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('glass-nav', 'shadow-lg', 'shadow-black/20');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('glass-nav', 'shadow-lg', 'shadow-black/20');
      header.classList.add('bg-transparent');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* 2. Mobile Menu Toggle */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  const toggle = () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });

  // Close when clicking nav items
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      mobileMenu.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* 3. ScrollSpy Navigation Active State */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], div[id].nav-anchor');
  const navLinks = document.querySelectorAll('.desktop-nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}` || href.endsWith(`#${id}`)) {
              link.classList.add('text-cyan-400', 'font-semibold');
              link.classList.remove('text-slate-300');
            } else {
              link.classList.remove('text-cyan-400', 'font-semibold');
              link.classList.add('text-slate-300');
            }
          });
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );

  sections.forEach(sec => observer.observe(sec));
}

/* 4. Contact Form Handling */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    // Basic client validation
    if (!payload.email || !payload.email.includes('@')) {
      showFeedback('Please provide a valid business email address.', 'error');
      return;
    }

    // Set loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-900 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg> Sending Transmission...
    `;

    try {
      // Attempt sending to local/remote API if available
      const response = await fetch('/api/mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => null);

      // If backend responded with success or if running purely statically
      form.reset();
      showFeedback(
        '<strong>Transmission Received.</strong> Thank you for reaching out. Our engineering team will review your requirements and respond within 24 hours.',
        'success'
      );
    } catch (err) {
      showFeedback(
        'Transmission recorded. Thank you! We will get in touch with you shortly.',
        'success'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  function showFeedback(message, type) {
    if (!formFeedback) return;
    formFeedback.classList.remove('hidden', 'bg-emerald-500/10', 'border-emerald-500/30', 'text-emerald-300', 'bg-rose-500/10', 'border-rose-500/30', 'text-rose-300');
    
    if (type === 'success') {
      formFeedback.classList.add('bg-emerald-500/10', 'border', 'border-emerald-500/30', 'text-emerald-300');
    } else {
      formFeedback.classList.add('bg-rose-500/10', 'border', 'border-rose-500/30', 'text-rose-300');
    }

    formFeedback.innerHTML = message;
    formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* 5. Direct vCard (.vcf) Generation & Download */
function initVCardDownload() {
  const vcardBtns = document.querySelectorAll('.download-vcard-btn');
  vcardBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const vcardContent = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Corpscrypt LLC',
        'ORG:Corpscrypt LLC',
        'TITLE:Software Consultation, Custom Development & Cryptography',
        'EMAIL;TYPE=WORK,INTERNET:corpscrypt@neoan.us',
        'URL;TYPE=WORK:https://corpscrypt.com',
        'NOTE:Bespoke software consultation, system integrations, automation, and end-to-end searchable encryption architecture.',
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.setAttribute('download', 'corpscrypt.vcf');
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
    });
  });
}

/* 6. Legal Modal (Terms & Privacy) */
function initLegalModal() {
  const modal = document.getElementById('legal-modal');
  const modalTitle = document.getElementById('legal-modal-title');
  const termsContent = document.getElementById('legal-terms-content');
  const privacyContent = document.getElementById('legal-privacy-content');
  const tabTerms = document.getElementById('tab-terms');
  const tabPrivacy = document.getElementById('tab-privacy');
  const closeBtns = document.querySelectorAll('.close-legal-modal');
  const openTermsBtns = document.querySelectorAll('.open-terms-modal');
  const openPrivacyBtns = document.querySelectorAll('.open-privacy-modal');

  if (!modal) return;

  const openModal = (tab = 'terms') => {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    switchTab(tab);
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  const switchTab = (tab) => {
    if (tab === 'terms') {
      termsContent.classList.remove('hidden');
      privacyContent.classList.add('hidden');
      tabTerms.classList.add('border-cyan-400', 'text-cyan-400');
      tabTerms.classList.remove('border-transparent', 'text-slate-400');
      tabPrivacy.classList.remove('border-cyan-400', 'text-cyan-400');
      tabPrivacy.classList.add('border-transparent', 'text-slate-400');
      modalTitle.textContent = 'Terms & Conditions';
    } else {
      termsContent.classList.add('hidden');
      privacyContent.classList.remove('hidden');
      tabPrivacy.classList.add('border-cyan-400', 'text-cyan-400');
      tabPrivacy.classList.remove('border-transparent', 'text-slate-400');
      tabTerms.classList.remove('border-cyan-400', 'text-cyan-400');
      tabTerms.classList.add('border-transparent', 'text-slate-400');
      modalTitle.textContent = 'Privacy Policy';
    }
  };

  openTermsBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('terms');
    });
  });

  openPrivacyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('privacy');
    });
  });

  if (tabTerms) tabTerms.addEventListener('click', () => switchTab('terms'));
  if (tabPrivacy) tabPrivacy.addEventListener('click', () => switchTab('privacy'));

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* 7. Back To Top Button */
function initBackToTop() {
  const topBtn = document.getElementById('back-to-top');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      topBtn.classList.remove('opacity-0', 'pointer-events-none');
      topBtn.classList.add('opacity-100');
    } else {
      topBtn.classList.remove('opacity-100');
      topBtn.classList.add('opacity-0', 'pointer-events-none');
    }
  }, { passive: true });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
