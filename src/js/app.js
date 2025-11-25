// Main Application
class EldenLordApp {
  constructor() {
    this.storage = new StorageManager();
    this.validator = new FormValidator('registrationForm', this.storage);
    this.form = document.getElementById('registrationForm');
    this.submitBtn = document.getElementById('submitBtn');
    this.modal = document.getElementById('successModal');

    this.init();
  }

  init() {
    // Form submission
    this.form.addEventListener('submit', e => this.handleSubmit(e));

    // Modal controls
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => this.closeModal());
    });

    // View profile button
    document.getElementById('viewProfile')?.addEventListener('click', () => {
      this.closeModal();
      alert('Profile feature coming soon!');
    });

    // Update stats
    this.updateStats();

    // Welcome message
    console.log(
      '%c⚔️ Elden Lord Registration System',
      'font-size: 20px; font-weight: bold; color: #d4af37;'
    );
    console.log(
      '%cBuilt with vanilla JavaScript',
      'font-size: 12px; color: #999;'
    );
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Validate
    if (!this.validator.validateAll()) {
      this.shake(this.submitBtn);
      return;
    }

    // Show loading
    this.setLoading(true);

    try {
      // Simulate API delay
      await this.delay(1500);

      // Get form data
      const formData = {
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
      };

      // Save user
      const newUser = this.storage.addUser(formData);

      // Update stats
      this.updateStats();

      // Show success modal
      this.showModal();

      // Reset form
      this.validator.reset();
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    if (loading) {
      this.submitBtn.disabled = true;
      this.submitBtn.classList.add('loading');
    } else {
      this.submitBtn.disabled = false;
      this.submitBtn.classList.remove('loading');
    }
  }

  showModal() {
    this.modal.classList.add('show');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.classList.remove('show');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  updateStats() {
    const stats = this.storage.getStats();

    const totalUsersEl = document.getElementById('totalUsers');
    const latestUserEl = document.getElementById('latestUser');

    if (totalUsersEl) {
      this.animateNumber(totalUsersEl, stats.totalUsers);
    }

    if (latestUserEl) {
      latestUserEl.textContent = stats.latestUser;
    }
  }

  animateNumber(element, targetNumber) {
    const currentNumber = parseInt(element.textContent) || 0;
    const duration = 1000;
    const steps = 20;
    const increment = (targetNumber - currentNumber) / steps;
    let current = currentNumber;
    let step = 0;

    const timer = setInterval(() => {
      current += increment;
      step++;
      element.textContent = Math.round(current);

      if (step >= steps) {
        element.textContent = targetNumber;
        clearInterval(timer);
      }
    }, duration / steps);
  }

  shake(element) {
    element.style.animation = 'none';
    setTimeout(() => {
      element.style.animation = 'shake 0.5s';
    }, 10);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new EldenLordApp();
  });
} else {
  new EldenLordApp();
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
