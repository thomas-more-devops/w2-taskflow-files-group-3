<template>
  <div class="profile-container">
    <div class="profile-card">
      <h2>User Profile</h2>
      <form @submit.prevent="updateProfile">
        <div class="input-container">
          <label class="readonly-label">User Id: {{ user.id }}</label>
        </div>
        <div class="input-container" v-for="(field, key) in formFields" :key="key">
          <template v-if="key !== 'dob' && key !== 'type'">
            <input 
              v-if="field.type !== 'select'"
              :type="field.type" 
              v-model="user[key]" 
              :disabled="!isEditing" 
              :placeholder="field.placeholder" 
              :required="field.required" 
            />
            <select 
              v-if="field.type === 'select'"
              v-model="user[key]" 
              :disabled="!isEditing" 
              :required="field.required"
            >
              <option disabled value="">{{ field.placeholder }}</option>
              <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
            </select>
          </template>
          <template v-else>
            <div v-if="key === 'dob'" class="input-container">
              <label class="readonly-label">Date of Birth: {{ formatDate(user.dob) }}</label>
            </div>
            <div v-if="key === 'type'" class="input-container">
              <label class="readonly-label">Type: {{ user.type }}</label>
            </div>
          </template>
        </div>
        <button type="button" v-if="!isEditing" @click="toggleEdit" class="edit-button">Edit</button>
        <button type="submit" v-if="isEditing" class="save-button">Save</button>
        <button type="button" v-if="isEditing" @click="cancelEdit" class="cancel-button">Cancel</button>
        <button type="button" @click="confirmDelete" class="delete-button">Delete Account</button>
      </form>
      <div v-if="message" :class="{'error': isError, 'success': !isError}">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        id: null,
        userName: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dob: '',
        type: '',
        password: ''
      },
      originalUser: {},
      message: '',
      isError: false,
      isEditing: false,
      formFields: {
        userName: { type: 'text', placeholder: 'Username', required: true },
        email: { type: 'email', placeholder: 'Email', required: true },
        password: { type: 'password', placeholder: 'Password', required: false },
        firstName: { type: 'text', placeholder: 'First Name', required: true },
        lastName: { type: 'text', placeholder: 'Last Name', required: true },
        phoneNumber: { type: 'text', placeholder: 'Phone Number', required: true },
        dob: { type: 'date', placeholder: 'Date of Birth', required: true },
        type: { type: 'select', placeholder: 'Select Type', required: true, options: ['host', 'guest'] }
      }
    };
  },
  created() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const response = await axios.get(`http://localhost:5209/User/${user.userId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + btoa('test:test')
            }
          });
          this.user = response.data;
          this.user.id = user.userId; // Ensure user.id is set correctly
          this.user.dob = this.formatDate(this.user.dob); // Format the date
          this.originalUser = { ...this.user }; // Store the original data
        } else {
          this.message = 'No user is signed in.';
        }
      } catch (error) {
        this.message = 'Error fetching user information.';
        this.isError = true;
      }
    },
    async updateProfile() {
      try {
        const updatedUser = { ...this.user, dob: this.formatDateToSend(this.user.dob) };
        const response = await axios.put(`http://localhost:5209/User/${this.user.id}`, updatedUser, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('test:test')
          }
        });

        if (response.status === 200) {
          localStorage.setItem('user', JSON.stringify(this.user));
          this.message = 'Profile updated successfully!';
          this.isError = false;
          this.isEditing = false;
        } else {
          this.message = 'Failed to update profile: ' + (response.data.message || 'Unknown error');
          this.isError = true;
        }
      } catch (error) {
        this.message = 'Error updating profile.';
        this.isError = true;
      }
    },
    async deleteAccount() {
      try {
        const response = await axios.delete(`http://localhost:5209/User/${this.user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('test:test')
          }
        });

        if (response.status === 200) {
          localStorage.removeItem('user');
          this.message = 'Account deleted successfully!';
          this.isError = false;
          window.location.href = '/'; // Redirect to homepage
        } else {
          this.message = 'Failed to delete account: ' + (response.data.message || 'Unknown error');
          this.isError = true;
        }
      } catch (error) {
        this.message = 'Error deleting account.';
        this.isError = true;
      }
    },
    confirmDelete() {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        this.deleteAccount();
      }
    },
    toggleEdit() {
      this.isEditing = true;
    },
    cancelEdit() {
      this.user = { ...this.originalUser };
      this.isEditing = false;
    },
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    formatDateToSend(date) {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #e0eafc, #cfdef3);
}

.profile-card {
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

.input-container {
  margin-bottom: 20px;
}

.input-container input, .input-container select, .readonly-label {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  display: block;
  text-align: left;
}

.readonly-label {
  background-color: #f9f9f9;
  color: #333;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.edit-button, .save-button, .cancel-button, .delete-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #a8c0ff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-bottom: 10px;
}

.delete-button {
  background: #ff6b6b;
}

.edit-button:hover, .save-button:hover, .cancel-button:hover, .delete-button:hover {
  background: #91a7ff;
}

.delete-button:hover {
  background: #ff4c4c;
}

.error {
  color: red;
}

.success {
  color: green;
}
</style>
