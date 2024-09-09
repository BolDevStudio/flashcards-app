<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar Navigation -->
    <nav class="bg-gray-800 text-white w-64 p-6 flex flex-col justify-between">
      <div>
        <h1 class="text-2xl font-bold mb-6">Navigation</h1>
        <ul class="space-y-4">
          <li>
            <router-link to="/" class="block py-2 px-4 rounded-lg hover:bg-gray-700">Dashboard</router-link>
          </li>
          <li>
            <router-link to="/flashcards" class="block py-2 px-4 rounded-lg hover:bg-gray-700">Flashcards</router-link>
          </li>
          <li>
            <router-link to="/add-flashcard" class="block py-2 px-4 rounded-lg hover:bg-gray-700">Add Flashcard</router-link>
          </li>
        </ul>
      </div>
      <div>
        <button class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full">Logout</button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex-1 p-6">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppLayout",
};
</script>

<style scoped>
/* Styling for Sidebar */
</style>
