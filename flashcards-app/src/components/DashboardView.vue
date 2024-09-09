<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Powiadomienia -->
    <div v-if="notifications.length" class="mb-6">
      <div v-for="(notification, index) in notifications" :key="index" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-2 rounded-lg">
        {{ notification }}
      </div>
    </div>

    <!-- Układ wykresu i statystyk -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Wykres -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">Flashcards by Category</h2>
        <div class="flex justify-center items-center">
          <canvas id="categoryChart" class="max-w-xs max-h-48"></canvas>
        </div>
      </div>

      <!-- Statystyki z ikonami -->
      <div class="grid grid-cols-1 gap-6">
        <!-- Total Flashcards -->
        <div class="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <div>
            <h2 class="text-2xl font-semibold text-gray-700 mb-2">Total Flashcards</h2>
            <p class="text-3xl font-bold text-blue-500">{{ totalFlashcards }}</p>
          </div>
        </div>

        <!-- Categories -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-semibold text-gray-700 mb-2">Categories</h2>
          <ul class="space-y-2">
            <li v-for="(count, category) in categories" :key="category" class="flex justify-between">
              <span class="text-gray-600">{{ category }}</span>
              <span class="font-bold text-gray-800">{{ count }}</span>
            </li>
          </ul>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-semibold text-gray-700 mb-2">Recent Activity</h2>
          <p class="text-gray-600">Last Added Flashcard: <span class="font-bold text-gray-800">{{ recentActivity.lastAdded }}</span></p>
          <p class="text-gray-600">Last Reviewed Flashcard: <span class="font-bold text-gray-800">{{ recentActivity.lastReviewed }}</span></p>
        </div>
      </div>
    </div>

    <!-- Tabela z danymi -->
    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 class="text-2xl font-semibold text-gray-700 mb-2">Recent Flashcards</h2>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(flashcard, index) in recentFlashcards" :key="index">
          <td class="px-6 py-4 whitespace-nowrap">{{ flashcard.question }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ flashcard.answer }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ flashcard.category }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Przycisk akcji -->
    <div class="mt-6">
      <button @click="addFlashcard" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">Add Flashcard</button>
    </div>
  </div>
</template>

<script>
import { getFlashcards, getCategories } from '@/services/api';

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
      notifications: [], // Dodaj tę linię
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

        // Zaktualizuj recentActivity
        if (this.recentFlashcards.length > 0) {
          this.recentActivity.lastAdded = `Fiszka o temacie "${this.recentFlashcards[0].category}" dodana ${this.getDateDifference(this.recentFlashcards[0].dateAdded)} dni temu`;
          this.recentActivity.lastReviewed = `Fiszka o temacie "${this.recentFlashcards[0].category}" przeglądana ${this.getDateDifference(this.recentFlashcards[0].dateReviewed)} dni temu`;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
