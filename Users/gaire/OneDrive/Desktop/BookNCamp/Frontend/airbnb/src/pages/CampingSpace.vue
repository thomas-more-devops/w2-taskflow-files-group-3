<template>
  <div class="camping-container">
    <h2>My Camping Spots</h2>
    <!-- Camping Spots List -->
    <ul class="camping-list">
      <li v-for="campingSpace in campingSpots" :key="campingSpace.campingSpaceId" class="camping-item">
        <div class="camping-details">
          <h3>{{ campingSpace.name }}</h3>
          <p class="price">${{ campingSpace.pricePerNight }} per night</p>
          <ul class="amenities-list">
            <li v-for="amenity in getAmenitiesForCampingSpace(campingSpace.campingSpaceId)" :key="amenity.amenitiesId" class="amenity-item">
              {{ getAmenityDescription(amenity.amenitiesId) }}
            </li>
          </ul>
          <label class="availability-label">
            Available:
            <input type="checkbox" v-model="campingSpace.isAvailable" @change="updateAvailability(campingSpace)" />
          </label>
        </div>
        <div class="reservation-details">
          <h4>Reservations:</h4>
          <ul>
            <li v-for="reservation in campingSpace.reservations" :key="reservation.bookingId">
              Booking ID: {{ reservation.bookingId }}, Date: {{ formatDate(reservation.arrivalDate) }} to {{ formatDate(reservation.departureDate) }}, Guests: {{ reservation.noOfGuests }}
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CampingSpace',
  data() {
    return {
      campingSpots: [],
      campingspaceAmenities: [],
      amenities: [],
      ownerId: null
    };
  },
  async created() {
    await this.fetchUserData();
    await this.fetchAllAmenities();
    await this.fetchCampingSpaceAmenities();
    await this.fetchCampingSpacesByOwner();
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    async fetchUserData() {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const localUser = JSON.parse(storedUser);
          await axios.get(`http://localhost:5209/User/${localUser.userId}`, {
            headers: { Authorization: 'Basic ' + btoa('test:test') }
          });
          this.ownerId = localUser.userId;
        } else {
          console.error('No user is signed in.');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    },
    async fetchCampingSpacesByOwner() {
      if (!this.ownerId) {
        console.error('Owner ID is not set');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5209/CampingSpace/owner/${this.ownerId}`, {
          headers: { Authorization: 'Basic ' + btoa('test:test') }
        });
        this.campingSpots = response.data.map(space => ({
          ...space,
          reservations: []  // Initialize with empty reservations
        }));
        this.fetchReservationsForSpaces();
      } catch (error) {
        console.error('Error fetching camping spots by owner:', error);
      }
    },
    async fetchReservationsForSpaces() {
      const promises = this.campingSpots.map(async space => {
        try {
          const response = await axios.get(`http://localhost:5209/Booking/GetBookingsByCampingSpace/${space.campingSpaceId}`, {
            headers: { Authorization: 'Basic ' + btoa('test:test') }
          });
          space.reservations = response.data;
        } catch (error) {
          console.error(`Error fetching reservations for space ${space.campingSpaceId}:`, error);
          space.reservations = [];
        }
      });
      await Promise.all(promises);
    },
    async fetchAllAmenities() {
      try {
        const response = await axios.get('http://localhost:5209/Amenities', {
          headers: { Authorization: 'Basic ' + btoa('test:test') }
        });
        this.amenities = response.data;
      } catch (error) {
        console.error('Error fetching amenities:', error);
      }
    },
    async fetchCampingSpaceAmenities() {
      try {
        const response = await axios.get('http://localhost:5209/CampingSpaceAmenities', {
          headers: { Authorization: 'Basic ' + btoa('test:test') }
        });
        this.campingspaceAmenities = response.data;
      } catch (error) {
        console.error('Error fetching camping space amenities:', error);
      }
    },
    async updateAvailability(campingSpace) {
      try {
        await axios.put(
          `http://localhost:5209/CampingSpace/updateAvailability/${campingSpace.campingSpaceId}`,
          { isAvailable: campingSpace.isAvailable },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Basic ' + btoa('test:test')
            }
          }
        );
        alert('Availability updated successfully');
      } catch (error) {
        console.error('Error updating availability:', error);
        alert('Failed to update availability');
      }
    },
    getAmenitiesForCampingSpace(campingSpaceId) {
      return this.campingspaceAmenities.filter(a => a.campingSpaceId === campingSpaceId);
    },
    getAmenityDescription(amenitiesId) {
      const amenity = this.amenities.find(a => a.amenitiesId === amenitiesId);
      return amenity ? `${amenity.typeOfAmenities}: ${amenity.description}` : 'Unknown amenity';
    }
  }
};
</script>

<style scoped>
.camping-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #4CAF50;
  text-align: center;
  margin-bottom: 20px;
}

.camping-list {
  list-style-type: none;
  padding: 0;
}

.camping-item {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.camping-details h3 {
  margin: 0 0 10px;
  color: #333;
}

.price {
  font-size: 1.2em;
  margin: 5px 0;
  color: #FF5722;
}

.amenities-list {
  list-style-type: none;
  padding: 0;
  margin: 10px 0;
}

.amenity-item {
  background-color: #e0f7fa;
  border-radius: 3px;
  padding: 5px;
  margin: 5px 0;
  color: #00796B;
}

.availability-label {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

input[type="checkbox"] {
  margin-left: 10px;
}

.reservation-details h4 {
  margin-top: 10px;
  color: #4CAF50;
}

.reservation-details ul {
  list-style-type: none;
  padding: 0;
}

.reservation-details li {
  background-color: #e1f5fe;
  margin: 5px 0;
  padding: 5px;
  border-radius: 3px;
  font-size: 0.9em;
}
</style>
