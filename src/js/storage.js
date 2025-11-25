// LocalStorage Manager
class StorageManager {
  constructor(storageKey = 'eldenLord_users') {
    this.storageKey = storageKey;
  }

  // Get all users
  getUsers() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  // Add new user
  addUser(userData) {
    try {
      const users = this.getUsers();
      const newUser = {
        id: this.generateId(),
        username: userData.username,
        email: userData.email,
        registeredAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem(this.storageKey, JSON.stringify(users));

      return newUser;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save user data');
    }
  }

  // Check if username exists
  usernameExists(username) {
    const users = this.getUsers();
    return users.some(
      user => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  // Check if email exists
  emailExists(email) {
    const users = this.getUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Get stats
  getStats() {
    const users = this.getUsers();
    const latestUser = users.length > 0 ? users[users.length - 1] : null;

    return {
      totalUsers: users.length,
      latestUser: latestUser ? latestUser.username : '-',
    };
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Clear all data (for testing)
  clearAll() {
    localStorage.removeItem(this.storageKey);
  }
}

// Export for use in other files
window.StorageManager = StorageManager;
