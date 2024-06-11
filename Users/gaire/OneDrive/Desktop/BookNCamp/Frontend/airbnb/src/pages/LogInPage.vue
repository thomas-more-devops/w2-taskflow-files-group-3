<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Login</h2>
      <form @submit.prevent="signin">
        <div class="input-container">
          <input type="text" v-model="userName" placeholder="Username" required />
        </div>
        <div class="input-container">
          <input type="password" v-model="password" placeholder="Password" required />
        </div>
        <button type="submit" class="login-button">LOGIN</button>
      </form>
      <div v-if="message" class="error">{{ message }}</div>
      <a @click="$emit('navigate', 'Registration')" class="signup-link">Sign Up</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userName: '',
      password: '',
      message: ''
    };
  },
  methods: {
    async signin() {
      try {
        const response = await axios.get('http://localhost:5209/User', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('test:test')
          }
        });

        if (response.status === 200) {
          const users = response.data;
          const user = users.find(user => user.userName === this.userName && user.password === this.password);

          if (user) {
            this.message = 'Signed in successfully!';
            localStorage.setItem('user', JSON.stringify(user));
            this.$emit('signed-in', user);

            // Clear the form
            this.userName = '';
            this.password = '';
          } else {
            this.message = 'Incorrect username or password';
          }
        } else {
          console.error('Failed to fetch users:', response.data);
          this.message = 'Failed to sign in: ' + (response.data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error:', error);
        this.message = 'Error signing in';
      }
    }
  }
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #e0eafc, #cfdef3);
}

.login-card {
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

.input-container input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-button {
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

.login-button:hover {
  background: #91a7ff;
}

.error {
  color: red;
  margin-top: 10px;
}

.signup-link {
  display: block;
  margin-top: 20px;
  color: #6a11cb;
  text-decoration: none;
  cursor: pointer;
}

.signup-link:hover {
  text-decoration: underline;
}
</style>
