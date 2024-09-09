<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Add New Flashcard</h1>
    <form @submit.prevent="submitForm" class="bg-white p-6 rounded-lg shadow-lg">
      <div class="mb-4">
        <label for="question" class="block text-gray-700 text-sm font-bold mb-2">Question</label>
        <input v-model="flashcard.question" type="text" id="question" class="form-input mt-1 block w-full" placeholder="Enter the question" required />
      </div>
      <div class="mb-4">
        <label for="answer" class="block text-gray-700 text-sm font-bold mb-2">Answer</label>
        <input v-model="flashcard.answer" type="text" id="answer" class="form-input mt-1 block w-full" placeholder="Enter the answer" required />
      </div>
      <div class="mb-4">
        <label for="category" class="block text-gray-700 text-sm font-bold mb-2">Category</label>
        <select v-model="flashcard.category" id="category" class="form-select mt-1 block w-full" required>
          <option value="" disabled>Select category</option>
          <option value="Grammar">Grammar</option>
          <option value="Vocabulary">Vocabulary</option>
          <option value="Phrases">Phrases</option>
        </select>
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">Add Flashcard</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AddFlashcard',
  data() {
    return {
      flashcard: {
        question: '',
        answer: '',
        category: '',
      },
    };
  },
  methods: {
    submitForm() {
      // Tu można dodać logikę do wysyłania danych do backendu
      console.log('Flashcard added:', this.flashcard);
      this.$router.push('/');
    },
  },
};
</script>
