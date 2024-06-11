<template>
  <div class="add-spot-container">
    <div class="add-spot-card">
      <h2>Add Spot</h2>
      <form @submit.prevent="addCampingSpace">
        <div class="input-container">
          <input type="text" v-model="name" placeholder="Name" required />
        </div>
        <div class="input-container">
          <input type="text" v-model="pricePerNight" placeholder="Price Per Night" inputmode="numeric" pattern="[0-9]*" required />
        </div>
        <div class="input-container">
          <input type="text" v-model="locationId" placeholder="Location ID" inputmode="numeric" pattern="[0-9]*" required />
        </div>
        <div class="input-container">
          <input type="text" v-model="address" placeholder="Address" required />
        </div>
        <div class="input-container">
          <input type="text" v-model="longitude" placeholder="Longitude (e.g., 145.1234567)" required />
        </div>
        <div class="input-container">
          <input type="text" v-model="latitude" placeholder="Latitude (e.g., -37.1234567)" required />
        </div>
        <div class="input-container">
          <input type="text" v-model="ownerId" placeholder="Owner ID" inputmode="numeric" pattern="[0-9]*" required />
        </div>
        <div>
          <label>Amenities:</label>
          <div v-for="amenity in amenitiesList" :key="amenity.amenitiesId">
            <label>
              <input type="checkbox" :value="amenity.amenitiesId" v-model="selectedAmenities" />
              {{ amenity.typeOfAmenities }}
            </label>
          </div>
        </div>
        <button type="submit" class="add-spot-button">Add Camping Space</button>
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
      name: '',
      pricePerNight: '',
      locationId: '',
      address: '',
      longitude: '',
      latitude: '',
      ownerId: '', // Add ownerId to the data object
      selectedAmenities: [],
      amenitiesList: [],
      message: '',
      isError: false
    };
  },
  methods: {
    async addCampingSpace() {
      try {
        const amenitiesArray = this.selectedAmenities;

        const campingSpaceData = {
          name: this.name,
          pricePerNight: this.pricePerNight,
          locationId: this.locationId,
          address: this.address,
          longitude: parseFloat(this.longitude),
          latitude: parseFloat(this.latitude),
          ownerId: this.ownerId, // Include ownerId in the campingSpaceData
          amenitiesIds: amenitiesArray,
          location: {
            locationId: this.locationId,
            country: 'Dummy country',
            city: 'Dummy city',
            postcode: 'Dummy postcode'
          },
          amenities: amenitiesArray.map(id => ({
            amenitiesId: id,
            typeOfAmenities: 'Dummy type',
            description: 'Dummy description'
          }))
        };

        const response = await axios.post('http://localhost:5209/CampingSpace', campingSpaceData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('test:test')
          }
        });

        if (response.status === 201 || response.status === 200) {
          this.message = 'Camping space added successfully';
          this.isError = false;
          this.clearForm();
        } else {
          this.message = 'Failed to add camping space: ' + (response.data.message || 'Unknown error');
          this.isError = true;
        }
      } catch (error) {
        if (error.response) {
          console.error('Server responded with error:', error.response.data);
          this.message = 'Error adding camping space: ' + (error.response.data.title || 'Unknown error');
          if (error.response.data.errors) {
            this.message += ': ' + JSON.stringify(error.response.data.errors);
          }
        } else {
          console.error('Error adding camping space:', error.message);
          this.message = 'Error adding camping space: ' + error.message;
        }
        this.isError = true;
      }
    },
    clearForm() {
      this.name = '';
      this.pricePerNight = '';
      this.locationId = '';
      this.address = '';
      this.longitude = '';
      this.latitude = '';
      this.ownerId = ''; // Clear ownerId field
      this.selectedAmenities = [];
    },
    async fetchAmenities() {
      try {
        const response = await axios.get('http://localhost:5209/Amenities', {
          headers: {
            'Authorization': 'Basic ' + btoa('test:test')
          }
        });
        this.amenitiesList = response.data;
      } catch (error) {
        console.error('Error fetching amenities:', error.message);
      }
    }
  },
  mounted() {
    this.fetchAmenities();
  }
};
</script>

<style>
.add-spot-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #e0eafc, #cfdef3);
}

.add-spot-card {
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

.add-spot-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #28a745;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-spot-button:hover {
  background: #218838;
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
</style>
