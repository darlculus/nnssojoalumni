// ===== PORTAL INTERACTIONS =====

// Sidebar toggle (mobile)
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
}

// ===== MODAL SYSTEM =====
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('open');
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('open');
}

// Close on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// Close buttons
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal-overlay').classList.remove('open');
  });
});

// ===== PAY DUES BUTTON =====
const payDuesBtn = document.querySelector('.wallet-btn-dues');
if (payDuesBtn) {
  payDuesBtn.addEventListener('click', () => openModal('dues-modal'));
}

// ===== DONATE BUTTON =====
const donateBtn = document.querySelector('.wallet-btn-donate');
if (donateBtn) {
  donateBtn.addEventListener('click', () => openModal('donate-modal'));
}

// ===== ACCOUNT OPTION SELECTION =====
document.querySelectorAll('.account-option').forEach(option => {
  option.addEventListener('click', () => {
    option.closest('.account-options').querySelectorAll('.account-option')
      .forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');
    option.querySelector('input[type="radio"]').checked = true;
  });
});

// ===== DUES PAYMENT FORM =====
const duesForm = document.getElementById('dues-form');
if (duesForm) {
  duesForm.addEventListener('submit', e => {
    e.preventDefault();
    const year = duesForm.querySelector('#dues-year').value;
    const amount = duesForm.querySelector('#dues-amount').value;
    if (!year || !amount) return;

    // Paystack integration placeholder
    initiatePaystack({
      email: currentUser.email,
      amount: parseFloat(amount) * 100, // kobo
      metadata: { type: 'dues', year },
      callback: (ref) => {
        closeModal('dues-modal');
        showToast(`✅ Dues payment of ₦${Number(amount).toLocaleString()} successful!`, 'success');
        updateWalletDisplay();
      }
    });
  });
}

// ===== DONATION FORM =====
const donateForm = document.getElementById('donate-form');
if (donateForm) {
  donateForm.addEventListener('submit', e => {
    e.preventDefault();
    const selected = donateForm.querySelector('.account-option.selected');
    const amount = donateForm.querySelector('#donate-amount').value;
    if (!selected || !amount) return;

    const accountName = selected.querySelector('.account-option-info span').textContent;

    initiatePaystack({
      email: currentUser.email,
      amount: parseFloat(amount) * 100,
      metadata: { type: 'donation', account: accountName },
      callback: (ref) => {
        closeModal('donate-modal');
        showToast(`🙏 Donation of ₦${Number(amount).toLocaleString()} to ${accountName} received!`, 'success');
      }
    });
  });
}

// ===== PAYSTACK STUB (replace with real Paystack SDK) =====
function initiatePaystack({ email, amount, metadata, callback }) {
  // In production: use PaystackPop.setup({ key: 'pk_live_...', email, amount, ... })
  console.log('Paystack payment:', { email, amount, metadata });
  // Simulate success for demo
  setTimeout(() => callback('demo_ref_' + Date.now()), 800);
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 30px; right: 30px; z-index: 9999;
    background: ${type === 'success' ? '#28a745' : '#dc3545'};
    color: white; padding: 14px 24px; border-radius: 12px;
    font-size: 0.875rem; font-weight: 600; font-family: Inter, sans-serif;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    animation: slideInRight 0.3s ease;
    max-width: 360px;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ===== MOCK CURRENT USER =====
const currentUser = {
  name: 'Capt. Emeka Okafor',
  email: 'emeka.okafor@example.com',
  set: '1998',
  walletBalance: 45000
};

function updateWalletDisplay() {
  const balEl = document.querySelector('.wallet-balance');
  if (balEl) {
    balEl.innerHTML = `<span class="currency">₦</span>${currentUser.walletBalance.toLocaleString()}`;
  }
}

// ===== SIDEBAR ACTIVE STATE =====
const currentPath = window.location.pathname.split('/').pop();
document.querySelectorAll('.sidebar-nav-item').forEach(item => {
  if (item.getAttribute('href') === currentPath) item.classList.add('active');
});
