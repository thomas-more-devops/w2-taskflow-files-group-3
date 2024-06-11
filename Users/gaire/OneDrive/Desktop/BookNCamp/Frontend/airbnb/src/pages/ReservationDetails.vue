<template>
  <div class="reservation-details">
    <h2>Your Reservations</h2>
    <div v-if="reservations.length === 0" class="no-reservations">
      No reservations found.
    </div>
    <div v-else>
      <ul class="reservation-list">
        <li v-for="reservation in reservations" :key="reservation.bookingId" class="reservation-item">
          <strong>Camping Space:</strong> {{ reservation.campingSpaceName }}<br>
          <strong>Booking ID:</strong> {{ reservation.bookingId }}<br>
          <strong>Arrival Date:</strong> {{ formatDate(reservation.arrivalDate) }}<br>
          <strong>Departure Date:</strong> {{ formatDate(reservation.departureDate) }}<br>
          <strong>Number of Guests:</strong> {{ reservation.noOfGuests }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReservationDetails',
  data() {
    return {
      reservations: [],
      user: null,
      bookingDetails: {
        userId: null
      }
    };
  },
  async created() {
    await this.fetchUserData();
    if (this.bookingDetails.userId) {
      await this.fetchReservations();
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    async fetchUserData() {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const localUser = JSON.parse(storedUser);
          const response = await axios.get(`http://localhost:5209/User/${localUser.userId}`, {
            headers: { 'Authorization': 'Basic ' + btoa('test:test') }
          });
          this.user = response.data;
          this.bookingDetails.userId = this.user.userId;
        } else {
          console.error('No user is signed in.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    },
    async fetchReservations() {
      if (!this.bookingDetails.userId) {
        console.error('User ID is not set');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5209/Booking/GetBookingsByUser/${this.bookingDetails.userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('test:test')
          }
        });
        this.reservations = response.data;
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    }
  }
};
</script>

<style scoped>
.reservation-details {
  font-family: 'Arial', sans-serif;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

h2 {
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.no-reservations {
  text-align: center;
  font-size: 18px;
  color: #888;
}

.reservation-list {
  list-style: none;
  padding: 0;
}

.reservation-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
  font-size: 16px;
  color: #555;
}

.reservation-item strong {
  color: #333;
}
</style>
