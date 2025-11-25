// Form Validation Class
class FormValidator {
  constructor(formId, storage) {
    this.form = document.getElementById(formId);
    this.storage = storage;
    this.fields = {
      username: this.form.querySelector('#username'),
      email: this.form.querySelector('#email'),
      password: this.form.querySelector('#password'),
    };

    this.init();
  }

  init() {
    // Real-time validation
    Object.keys(this.fields).forEach(fieldName => {
      const field = this.fields[fieldName];

      field.addEventListener('input', () => {
        this.validateField(fieldName);
      });

      field.addEventListener('blur', () => {
        this.validateField(fieldName);
      });
    });

    // Password toggle
    const toggleBtn = document.getElementById('togglePassword');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.togglePassword());
    }
  }

  validateField(fieldName) {
    const field = this.fields[fieldName];
    const value = field.value.trim();

    switch (fieldName) {
      case 'username':
        return this.validateUsername(value);
      case 'email':
        return this.validateEmail(value);
      case 'password':
        return this.validatePassword(value);
      default:
        return false;
    }
  }

  validateUsername(value) {
    const field = this.fields.username;
    const errorEl = document.getElementById('username-error');
    const successEl = document.getElementById('username-success');

    this.clearMessages(errorEl, successEl);
    this.clearFieldState(field);

    if (!value) {
      return false;
    }

    // Length check
    if (value.length < 3) {
      this.showError(field, errorEl, 'Username must be at least 3 characters');
      return false;
    }

    if (value.length > 20) {
      this.showError(field, errorEl, 'Username cannot exceed 20 characters');
      return false;
    }

    // Pattern check
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      this.showError(
        field,
        errorEl,
        'Only letters, numbers, and underscores allowed'
      );
      return false;
    }

    // Check if exists
    if (this.storage.usernameExists(value)) {
      this.showError(field, errorEl, 'This username is already taken');
      return false;
    }

    this.showSuccess(field, successEl, 'Username is available!');
    return true;
  }

  validateEmail(value) {
    const field = this.fields.email;
    const errorEl = document.getElementById('email-error');
    const successEl = document.getElementById('email-success');

    this.clearMessages(errorEl, successEl);
    this.clearFieldState(field);

    if (!value) {
      return false;
    }

    // Email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      this.showError(field, errorEl, 'Please enter a valid email address');
      return false;
    }

    // Check if exists
    if (this.storage.emailExists(value)) {
      this.showError(field, errorEl, 'This email is already registered');
      return false;
    }

    this.showSuccess(field, successEl, 'Email is valid!');
    return true;
  }

  validatePassword(value) {
    const field = this.fields.password;
    const errorEl = document.getElementById('password-error');
    const successEl = document.getElementById('password-success');

    this.clearMessages(errorEl, successEl);
    this.clearFieldState(field);

    if (!value) {
      this.updatePasswordStrength(0, '');
      return false;
    }

    // Minimum length
    if (value.length < 8) {
      this.showError(field, errorEl, 'Password must be at least 8 characters');
      this.updatePasswordStrength(1, 'Too short');
      return false;
    }

    // Calculate strength
    let strength = 0;
    const checks = {
      length: value.length >= 12,
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      numbers: /[0-9]/.test(value),
      special: /[^a-zA-Z0-9]/.test(value),
    };

    Object.values(checks).forEach(check => {
      if (check) strength++;
    });

    const strengthLevels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    this.updatePasswordStrength(strength, strengthLevels[strength] || '');

    if (strength >= 3) {
      this.showSuccess(field, successEl, 'Strong password!');
      return true;
    }

    return value.length >= 8;
  }

  updatePasswordStrength(level, text) {
    const bars = document.querySelectorAll('.strength-bar');
    const strengthText = document.getElementById('strengthText');

    const classes = [
      'active-weak',
      'active-fair',
      'active-good',
      'active-strong',
    ];

    bars.forEach((bar, index) => {
      bar.classList.remove(...classes);

      if (index < level) {
        if (level <= 1) bar.classList.add('active-weak');
        else if (level === 2) bar.classList.add('active-fair');
        else if (level === 3) bar.classList.add('active-good');
        else bar.classList.add('active-strong');
      }
    });

    if (strengthText) {
      strengthText.textContent = text;
      strengthText.style.color =
        level <= 1
          ? 'var(--color-error)'
          : level === 2
          ? 'var(--color-warning)'
          : 'var(--color-success)';
    }
  }

  togglePassword() {
    const field = this.fields.password;
    const toggleBtn = document.getElementById('togglePassword');

    if (field.type === 'password') {
      field.type = 'text';
      toggleBtn.textContent = '🙈';
    } else {
      field.type = 'password';
      toggleBtn.textContent = '👁️';
    }
  }

  validateAll() {
    const usernameValid = this.validateUsername(
      this.fields.username.value.trim()
    );
    const emailValid = this.validateEmail(this.fields.email.value.trim());
    const passwordValid = this.validatePassword(this.fields.password.value);

    return usernameValid && emailValid && passwordValid;
  }

  showError(field, errorEl, message) {
    field.classList.add('invalid');
    field.classList.remove('valid');
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }

  showSuccess(field, successEl, message) {
    field.classList.add('valid');
    field.classList.remove('invalid');
    successEl.textContent = message;
    successEl.classList.add('show');
  }

  clearMessages(errorEl, successEl) {
    errorEl.classList.remove('show');
    successEl.classList.remove('show');
  }

  clearFieldState(field) {
    field.classList.remove('valid', 'invalid');
  }

  reset() {
    this.form.reset();

    Object.values(this.fields).forEach(field => {
      this.clearFieldState(field);
    });

    document.querySelectorAll('.form-error, .form-success').forEach(el => {
      el.classList.remove('show');
    });

    this.updatePasswordStrength(0, '');
  }
}

window.FormValidator = FormValidator;
