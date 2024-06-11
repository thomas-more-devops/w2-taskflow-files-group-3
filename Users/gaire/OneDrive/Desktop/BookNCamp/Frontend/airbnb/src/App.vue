<template>
  <div id="app">
    <!-- Navigation -->
    <nav>
      <ul>
        <li @click="setActivePage('Home')" :class="{ active: activePage === 'Home' }">Home</li>
        <li v-if="!signedInUserName" @click="setActivePage('Login')" :class="{ active: activePage === 'Login' }">Login</li>
        <li v-if="!signedInUserName" @click="setActivePage('Registration')" :class="{ active: activePage === 'Registration' }">Registration</li>
        <li v-if="signedInUserName && signedInUser.type === 'guest'" @click="setActivePage('Booking')" :class="{ active: activePage === 'Booking' }">Booking</li>
        <li v-if="signedInUserName && signedInUser.type === 'guest'" @click="setActivePage('ReservationDetails')" :class="{ active: activePage === 'ReservationDetails' }">View Reservation</li>
        <li v-if="signedInUserName && signedInUser.type === 'host'" @click="setActivePage('AddSpot')" :class="{ active: activePage === 'AddSpot' }">Add Spot</li>
        <li v-if="signedInUserName && signedInUser.type === 'host'" @click="setActivePage('CampingSpace')" :class="{ active: activePage === 'CampingSpace' }">My Camping Spot</li>
        <li v-if="signedInUserName" @click="setActivePage('Profile')" :class="{ active: activePage === 'Profile' }">My Profile</li>
        <li v-if="signedInUserName">
          <button class="user-userName"><span class="red-text">Signed in as:</span> {{ signedInUserName }}</button>
        </li>
        <li v-if="signedInUserName">
          <button @click="signOut" class="sign-out-button">Sign Out</button>
        </li>
      </ul>
    </nav>

    <!-- Actual page -->
    <div>
      <HomePage v-if="activePage === 'Home'" />
      <LogInPage v-if="activePage === 'Login'" @signed-in="handleSignedIn" @navigate="setActivePage" />
      <RegistrationPage v-if="activePage === 'Registration'" @registered="handleRegistered" @navigate="setActivePage" />
      <BookingPage v-if="activePage === 'Booking' && signedInUser && signedInUser.type === 'guest'" />
      <ReservationDetails v-if="activePage === 'ReservationDetails' && signedInUser && signedInUser.type === 'guest'" />
      <AddSpot v-if="activePage === 'AddSpot' && signedInUser && signedInUser.type === 'host'" />
      <CampingSpace v-if="activePage === 'CampingSpace' && signedInUser && signedInUser.type === 'host'" />
      <UserProfile v-if="activePage === 'Profile'" />
    </div>
  </div>
</template>

<script>
import HomePage from './pages/HomePage.vue';
import LogInPage from './pages/LogInPage.vue';
import RegistrationPage from './pages/RegistrationPage.vue';
import BookingPage from './pages/BookingPage.vue';
import ReservationDetails from './pages/ReservationDetails.vue';
import AddSpot from './pages/AddSpot.vue';
import CampingSpace from './pages/CampingSpace.vue';
import UserProfile from './pages/UserProfile.vue';

export default {
  name: 'App',
  components: {
    HomePage,
    LogInPage,
    RegistrationPage,
    BookingPage,
    ReservationDetails,
    AddSpot,
    CampingSpace,
    UserProfile
  },
  data() {
    return {
      activePage: 'Home',
      signedInUser: null,
      signedInUserName: ''
    };
  },
  methods: {
    setActivePage(page) {
      this.activePage = page;
    },
    signOut() {
      this.signedInUser = null;
      this.signedInUserName = '';
      localStorage.removeItem('user');
      this.setActivePage('Home');
    },
    handleSignedIn(user) {
      this.signedInUser = user;
      this.signedInUserName = user.userName;
      localStorage.setItem('user', JSON.stringify(user));
      this.setActivePage('Home');
    },
    handleRegistered(user) {
      this.signedInUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      this.setActivePage('Home');
    }
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.userName) {
      this.signedInUser = user;
      this.signedInUserName = user.userName;
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

nav ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

nav ul li {
  margin: 0 10px;
  cursor: pointer;
  font-size: 1.2em;
  display: inline;
}

nav ul li:hover, nav ul li.active {
  text-decoration: underline;
}

.sign-out-button{
  background-color: red;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2em;
  padding: 10px 20px;
  border-radius: 5px;
}
 .user-userName {
  background-color: lavenderblush;
  border: none;
  color: grey;
  cursor: pointer;
  font-size: 1.2em;
  padding: 10px 20px;
  border-radius: 5px;
}

.sign-out-button:hover, .user-userName:hover {
  background-color: powderblue;
}

.user-userName {
  display: flex;
  align-items: center;
}

.red-text {
  color: red;
  margin-right: 5px;
}
</style>
