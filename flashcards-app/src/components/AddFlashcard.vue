<template>
  <!-- Pozostała część szablonu -->
  <div class="mt-6">
    <button @click="openAddFlashcardModal" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">Add Flashcard</button>
  </div>

  <!-- Modal dla dodawania fiszek -->
  <div v-if="showAddFlashcardModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Add Flashcard</h2>
      <form @submit.prevent="submitAddFlashcard">
        <div class="mb-4">
          <label for="question" class="block text-gray-700">Question</label>
          <input v-model="newFlashcard.question" id="question" type="text" class="mt-1 block w-full border-gray-300 rounded-lg" required>
        </div>
        <div class="mb-4">
          <label for="answer" class="block text-gray-700">Answer</label>
          <input v-model="newFlashcard.answer" id="answer" type="text" class="mt-1 block w-full border-gray-300 rounded-lg" required>
        </div>
        <div class="mb-4">
          <label for="category" class="block text-gray-700">Category</label>
          <input v-model="newFlashcard.category" id="category" type="text" class="mt-1 block w-full border-gray-300 rounded-lg" required>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">Add</button>
          <button @click="closeAddFlashcardModal" type="button" class="ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {addFlashcard, getCategories, getFlashcards} from '@/services/api';

export default {
  name: 'DashboardView',
  data() {
    return {
      totalFlashcards: 0,
      categories: {},
      recentActivity: {
        lastAdded: '',
        lastReviewed: '',
      },
      recentFlashcards: [],
      notifications: [],
      showAddFlashcardModal: false,
      newFlashcard: {
        question: '',
        answer: '',
        category: '',
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const flashcardsResponse = await getFlashcards();
        const categoriesResponse = await getCategories();

        this.totalFlashcards = flashcardsResponse.data.length;
        this.recentFlashcards = flashcardsResponse.data.slice(0, 5); // Ostatnie 5 fiszek
        this.categories = categoriesResponse.data;

        if (this.recentFlashcards.length > 0) {
          this.recentActivity.lastAdded = `Fiszka o temacie "${this.recentFlashcards[0].category}" dodana ${this.getDateDifference(this.recentFlashcards[0].dateAdded)} dni temu`;
          this.recentActivity.lastReviewed = `Fiszka o temacie "${this.recentFlashcards[0].category}" przeglądana ${this.getDateDifference(this.recentFlashcards[0].dateReviewed)} dni temu`;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    openAddFlashcardModal() {
      this.showAddFlashcardModal = true;
    },
    closeAddFlashcardModal() {
      this.showAddFlashcardModal = false;
      this.newFlashcard = {
        question: '',
        answer: '',
        category: '',
      };
    },
    async submitAddFlashcard() {
      try {
        await addFlashcard(this.newFlashcard);
        this.notifications.push('Flashcard added successfully!');
        this.closeAddFlashcardModal();
        this.fetchData(); // Przeładuj dane
      } catch (error) {
        console.error('Error adding flashcard:', error);
        this.notifications.push('Failed to add flashcard.');
      }
    },
    getDateDifference(date) {
      const now = new Date();
      const diff = Math.floor((now - new Date(date)) / (1000 * 60 * 60 * 24));
      return diff;
    },
  },
};
</script>

<style scoped>
#categoryChart {
  max-width: 300px;
  max-height: 300px;
}
</style>
