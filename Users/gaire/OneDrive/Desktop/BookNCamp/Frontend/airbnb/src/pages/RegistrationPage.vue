<template>
  <div class="registration-container">
    <div class="registration-card">
      <h2>Sign Up</h2>
      <form @submit.prevent="register">
        <div class="input-container">
          <input type="text" v-model="userName" placeholder="Username" required />
        </div>
        <div class="input-container">
          <input type="email" v-model="email" placeholder="Email" required />
        </div>
        <div class="input-container">
          <input type="password" v-model="password" placeholder="Password" required />
        </div>
        <div class="input-container">
          <input type="text" v-model="firstName" placeholder="First Name" required />
        </div>
        <div class="input-container">
          <input type="text" v-model="lastName" placeholder="Last Name" required />
        </div>
        <div class="input-container">
          <input type="text" v-model="phoneNumber" placeholder="Phone Number" required />
        </div>
        <div class="input-container">
          <input type="date" v-model="dob" placeholder="Date of Birth" required />
        </div>
        <div class="input-container">
          <select v-model="type" required>
            <option disabled value="">Select Type</option>
            <option value="host">Host</option>
            <option value="guest">Guest</option>
          </select>
        </div>
        <button type="submit" class="signup-button">Sign Up</button>
      </form>
      <div v-if="message" :class="{'error': isError, 'success': !isError}">{{ message }}</div>
      <a @click="$emit('navigate', 'Login')" class="login-link">Already have an account? Login</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userName: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dob: '',
      type: '',
      message: '',
      isError: false
    };
  },
  methods: {
    async register() {
      try {
        const userData = {
          userName: this.userName,
          email: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
          phoneNumber: this.phoneNumber,
          dob: this.dob,
          type: this.type
        };

        const response = await axios.post('http://localhost:5209/User', userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 201) {
          this.message = response.data.message;
          this.isError = false;
          this.clearForm();
          this.$emit('registered', userData);
        } else {
          this.message = 'Registration failed: ' + (response.data.message || 'Unknown error');
          this.isError = true;
        }
      } catch (error) {
        if (error.response) {
          this.message = 'Error registering: ' + (error.response.data.message || 'Unknown error');
        } else {
          this.message = 'Error registering: ' + error.message;
        }
        this.isError = true;
      }
    },
    clearForm() {
      this.userName = '';
      this.email = '';
      this.password = '';
      this.firstName = '';
      this.lastName = '';
      this.phoneNumber = '';
      this.dob = '';
      this.type = '';
    }
  }
};
</script>

<style>
.registration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #e0eafc, #cfdef3);
}

.registration-card {
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.input-container {
  margin-bottom: 20px;
}

.input-container input,
.input-container select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.signup-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #a8c0ff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.signup-button:hover {
  background: #91a7ff;
}

.message {
  margin-top: 10px;
}

.error {
  color: red;
}

.success {
  color: green;
}

.login-link {
  display: block;
  margin-top: 20px;
  color: #6a11cb;
  text-decoration: none;
  cursor: pointer;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
