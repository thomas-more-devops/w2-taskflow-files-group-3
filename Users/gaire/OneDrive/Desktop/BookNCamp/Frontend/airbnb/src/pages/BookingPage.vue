<template>
  <div>
    <h2>Booking Page</h2>

    <!-- Filter Section -->
    <div class="filter-section">
      <label>Location:</label>
      <select v-model="selectedLocation" @change="filterCampingSpaces">
        <option value="">All</option>
        <option v-for="location in locations" :key="location.locationId" :value="location.locationId">{{ location.city }}</option>
      </select>
      <label>Amenities:</label>
      <div class="amenities-container">
        <div v-for="amenity in amenities" :key="amenity.amenitiesId">
          <input type="checkbox" :value="amenity.amenitiesId" v-model="selectedAmenities" @change="filterCampingSpaces">
          {{ amenity.typeOfAmenities }}
        </div>
      </div>
    </div>

    <!-- Camping Spaces List -->
    <div class="camping-spaces-container">
      <div v-for="campingSpace in filteredCampingSpaces" :key="campingSpace.campingSpaceId" class="camping-space-box">
        <h3>{{ campingSpace.name }}</h3>
        <p>Price: ${{ campingSpace.pricePerNight }}</p>
        <swiper :slides-per-view="1" :space-between="10" class="camping-space-images">
          <swiper-slide v-for="image in campingSpace.images" :key="image.imageId">
            <img :src="image.imageUrl" alt="Camping Space Image" />
          </swiper-slide>
        </swiper>
        <div class="buttons-container">
          <button class="book-button" @click="checkAvailabilityAndOpenBookingModal(campingSpace)">Book</button>
          <button class="review-button" @click="toggleReviewModal(campingSpace)">Reviews</button>
        </div>
        <div class="amenities-list">
          <h4>Amenities</h4>
          <div v-for="amenity in getAmenitiesForCampingSpace(campingSpace.campingSpaceId)" :key="amenity.amenitiesId">
            {{ getAmenityDescription(amenity.amenitiesId) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <div v-if="showBookingModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeBookingModal">&times;</span>
        <h2>Book {{ selectedCampingSpace.name }}</h2>
        <form @submit.prevent="bookCampingSpace">
          <label for="arrivalDate">Arrival Date:</label>
          <input type="date" v-model="bookingDetails.arrivalDate" :min="today" required />
          <label for="departureDate">Departure Date:</label>
          <input type="date" v-model="bookingDetails.departureDate" :min="today" required />
          <label for="noOfGuests">Number of Guests:</label>
          <input type="number" v-model="bookingDetails.noOfGuests" required />
          <button type="submit" class="confirm-button">Confirm Booking</button>
        </form>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeReviewModal">&times;</span>
        <h2>Reviews for {{ selectedCampingSpace.name }}</h2>
        <div class="reviews-list">
          <div v-for="review in getReviewsForCampingSpace(selectedCampingSpace.campingSpaceId)" :key="review.reviewId" class="review-item">
            <p>{{ review.reviewText }} - Rating: {{ review.rating }} (User ID: {{ review.userId }})</p>
          </div>
        </div>
        <button class="write-review-button" @click="toggleReviewForm(selectedCampingSpace.campingSpaceId)">Write Review</button>
        <form v-if="selectedReviewSpace === selectedCampingSpace.campingSpaceId" @submit.prevent="submitReview(selectedCampingSpace.campingSpaceId)">
          <textarea v-model="newReviewText" placeholder="Write your review"></textarea>
          <select v-model="newReviewRating">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <button type="submit" class="submit-review-button">Submit Review</button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import axios from 'axios';

export default {
  name: 'BookingPage',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      locations: [],
      campingSpaces: [],
      campingspaceAmenities: [],
      amenities: [],
      reviews: [],
      selectedLocation: '',
      selectedAmenities: [],
      filteredCampingSpaces: [],
      showBookingModal: false,
      showReviewModal: false,
      selectedCampingSpace: null,
      bookingDetails: {
        arrivalDate: '',
        departureDate: '',
        noOfGuests: '',
        userId: null,
        campingSpaceId: null
      },
      newReviewText: '',
      newReviewRating: 1,
      selectedReviewSpace: null,
      user: null
    };
  },
  computed: {
    today() {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
      const year = today.getFullYear();
      return `${year}-${month}-${day}`;
    }
  },
  created() {
    this.fetchUserData();
    this.fetchCampingSpaces();
    this.fetchAllAmenities();
    this.fetchCampingSpaceAmenities();
    this.fetchReviews();
    this.fetchLocations();
  },
  methods: {
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
    async fetchData(endpoint) {
      try {
        const response = await axios.get(`http://localhost:5209/${endpoint}`, {
          headers: { 'Authorization': 'Basic ' + btoa('test:test') }
        });
        return response.data;
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
      }
    },
    async fetchCampingSpaces() {
      const campingSpaces = await this.fetchData('CampingSpace');
      const campingSpacesWithImages = await Promise.all(
        campingSpaces.map(async (campingSpace) => {
          const images = await this.fetchImagesForCampingSpace(campingSpace.campingSpaceId);
          return { ...campingSpace, images };
        })
      );
      this.campingSpaces = campingSpacesWithImages;
      this.filteredCampingSpaces = campingSpacesWithImages;
      this.filterCampingSpaces();
    },
    async fetchImagesForCampingSpace(campingSpaceId) {
      try {
        const response = await axios.get(`http://localhost:5209/Image/GetImagesByCampingSpace/${campingSpaceId}`, {
          headers: { 'Authorization': 'Basic ' + btoa('test:test') }
        });
        return response.data;
      } catch (error) {
        console.error(`Error fetching images for camping space ${campingSpaceId}:`, error);
        return [];
      }
    },
    async fetchCampingSpaceAmenities() {
      this.campingspaceAmenities = await this.fetchData('CampingSpaceAmenities');
    },
    async fetchAllAmenities() {
      this.amenities = await this.fetchData('Amenities');
    },
    async fetchReviews() {
      this.reviews = await this.fetchData('Reviews');
    },
    async fetchLocations() {
      const locations = await this.fetchData('Location');
      this.locations = locations;
    },
    filterCampingSpaces() {
      console.log('Filtering camping spaces with location:', this.selectedLocation, 'and amenities:', this.selectedAmenities);
      this.filteredCampingSpaces = this.campingSpaces.filter(campingSpace => {
        const matchesLocation = !this.selectedLocation || campingSpace.locationId === this.selectedLocation;
        const amenitiesIds = this.campingspaceAmenities
          .filter(a => a.campingSpaceId === campingSpace.campingSpaceId)
          .map(a => a.amenitiesId);
        const matchesAmenities = this.selectedAmenities.length === 0 || this.selectedAmenities.every(id => amenitiesIds.includes(id));
        return matchesLocation && matchesAmenities;
      });
      console.log('Filtered camping spaces:', this.filteredCampingSpaces);
    },
    getAmenitiesForCampingSpace(campingSpaceId) {
      return this.campingspaceAmenities.filter(a => a.campingSpaceId === campingSpaceId);
    },
    getAmenityDescription(amenitiesId) {
      const amenity = this.amenities.find(a => a.amenitiesId === amenitiesId);
      return amenity ? `${amenity.typeOfAmenities}: ${amenity.description}` : 'Unknown amenity';
    },
    getReviewsForCampingSpace(campingSpaceId) {
      return this.reviews.filter(r => r.campingSpaceId === campingSpaceId);
    },
    async checkAvailabilityAndOpenBookingModal(campingSpace) {
      try {
        const response = await axios.get(`http://localhost:5209/CampingSpace/availability/${campingSpace.campingSpaceId}`, {
          headers: { 'Authorization': 'Basic ' + btoa('test:test') }
        });

        if (response.data) {
          this.selectedCampingSpace = campingSpace;
          this.bookingDetails.campingSpaceId = campingSpace.campingSpaceId;
          this.showBookingModal = true;
        } else {
          alert('No more booking available for this camping space.');
        }
      } catch (error) {
        console.error('Error checking availability:', error.response ? error.response.data : error.message);
        alert('Error checking availability. Please try again later.');
      }
    },
    closeBookingModal() {
      this.showBookingModal = false;
      this.bookingDetails.arrivalDate = '';
      this.bookingDetails.departureDate = '';
      this.bookingDetails.noOfGuests = '';
    },
    async bookCampingSpace() {
      if (!this.user) {
        alert('User not logged in');
        return;
      }

      const arrivalDate = new Date(this.bookingDetails.arrivalDate).toISOString();
      const departureDate = new Date(this.bookingDetails.departureDate).toISOString();

      const bookingPayload = {
        bookingId: 0,
        userId: this.user.userId,
        bookingDate: new Date().toISOString(),
        arrivalDate: arrivalDate,
        departureDate: departureDate,
        noOfGuests: this.bookingDetails.noOfGuests,
        campingSpaceId: this.bookingDetails.campingSpaceId,
        campingSpaceName: this.selectedCampingSpace.name,
        user: this.user
      };

      try {
        const response = await axios.post('http://localhost:5209/Booking', bookingPayload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('test:test')
          }
        });
        if (response.status === 200) {
          alert('Booking successful!');
          this.closeBookingModal();
        } else {
          throw new Error(`Booking failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error booking camping space:', error.response ? error.response.data : error.message);
        if (error.response && error.response.data && error.response.data.errors) {
          console.error('Validation errors:', error.response.data.errors);
          alert('Booking failed due to validation errors. Check console for details.');
        } else {
          alert('Booking failed. Error: ' + (error.response && error.response.data ? error.response.data.message : error.message));
        }
      }
    },
    toggleReviewForm(campingSpaceId) {
      this.selectedReviewSpace = this.selectedReviewSpace === campingSpaceId ? null : campingSpaceId;
    },
    async submitReview(campingSpaceId) {
      if (!this.user) {
        alert('User not logged in');
        return;
      }

      const reviewPayload = {
        reviewId: 0,
        reviewText: this.newReviewText,
        rating: this.newReviewRating,
        userId: this.user.userId,
        campingSpaceId: campingSpaceId
      };

      try {
        const response = await axios.post('http://localhost:5209/Reviews', reviewPayload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('test:test')
          }
        });
        if (response.status === 200) {
          alert('Review submitted successfully!');
          this.newReviewText = '';
          this.newReviewRating = 1;
          await this.fetchReviews(); // Refresh the reviews list
          this.selectedReviewSpace = null; // Close the review form
        } else {
          throw new Error(`Review submission failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error submitting review:', error.response ? error.response.data : error.message);
        alert('Review submission failed. Error: ' + (error.response && error.response.data ? error.response.data.message : error.message));
      }
    },
    toggleReviewModal(campingSpace) {
      this.selectedCampingSpace = campingSpace;
      this.showReviewModal = true;
    },
    closeReviewModal() {
      this.showReviewModal = false;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}

h2 {
  color: olivedrab;
  margin-bottom: 20px;
}

.filter-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: calc(100% - 40px);
  margin: auto;
}

.filter-section label {
  margin-right: 10px;
  font-weight: bold;
}

.filter-section select,
.filter-section input {
  margin-right: 20px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.amenities-container {
  display: flex;
  flex-wrap: wrap;
}

.amenities-container > div {
  margin-right: 10px;
}

.camping-spaces-container {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  padding: 20px;
  background-color: #f5f5f5;
  justify-content: center; /* Added to center the elements */
}

.camping-space-box {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  width: calc(33% - 40px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin-bottom: 20px;
  flex: 0 0 auto;
}

.camping-space-box h3 {
  margin-top: 0;
}

.camping-space-box img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.amenities-list,
.reviews-list {
  margin-top: 10px;
}

.amenities-list div,
.reviews-list .review-item {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}

.buttons-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  padding-top: 60px;
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

button {
  background-color: #9acd32;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #7caf2a;
}

textarea,
select {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.book-button {
  background-color: #9acd32;
  color: white;
  border: none;
  padding: 15px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.book-button:hover {
  background-color: #7caf2a;
}

.review-button,
.confirm-button,
.write-review-button,
.submit-review-button {
  background-color: #9acd32;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.review-button:hover,
.confirm-button:hover,
.write-review-button:hover,
.submit-review-button:hover {
  background-color: #7caf2a;
}
</style>