<template>
  <div class="p-6 bg-gray-100 min-h-screen flex flex-col items-center justify-center">
    <h1 v-if="!selectedCard" class="text-3xl font-bold text-gray-800 mb-4 text-center">Flashcards by Category</h1>

    <!-- "Learn All" Button -->
    <button v-if="!selectedCard" @click="learnAll" class="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-600">
      Learn All
    </button>

    <!-- Flashcards Grid -->
    <div v-if="!selectedCard" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
      <div v-for="(cards, category) in categorizedFlashcards" :key="category" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">{{ category }}</h2>
        <div v-for="card in cards" :key="card.id" class="flashcard cursor-pointer mb-4" @click="selectCard(card)">
          <div class="p-4 bg-blue-100 rounded-lg shadow-md transition transform hover:scale-105">
            <p class="text-gray-800 font-medium text-center">{{ card.question }}</p>
          </div>
        </div>
        <!-- Learn Button for Category -->
        <button @click="learnByCategory(category)" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">
          Learn {{ category }}
        </button>
      </div>
    </div>

    <!-- Selected Flashcard View -->
    <div v-if="selectedCard" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="relative w-80 h-48 rounded-lg">
        <!-- Close Button -->
        <button @click="deselectCard" class="absolute -top-12 left-4 text-white bg-red-500 hover:bg-red-600 rounded-full px-2 z-10">
          ×
        </button>
        <!-- Previous Card Button -->
        <button @click="prevCard" v-if="hasPrevCard" class="absolute -bottom-16 left-4 text-white bg-gray-700 hover:bg-gray-800 rounded-full p-2 z-10">
          ←
        </button>
        <!-- Next Card Button -->
        <button @click="nextCard" v-if="hasNextCard" class="absolute -bottom-16 right-4 text-white bg-gray-700 hover:bg-gray-800 rounded-full p-2 z-10">
          →
        </button>

        <!-- Flashcard Flip Effect -->
        <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
          <div v-if="selectedCard" class="flashcard-preview">
            <div class="flashcard-inner" :class="{ 'is-flipped': isFlipped }">
              <div class="flashcard-front flex items-center justify-center flex-col p-4">
                <p class="text-gray-800 font-medium text-center">{{ selectedCard.question }}</p>
                <button @click="flipCard" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition transform hover:scale-105">Show Answer</button>
              </div>
              <div class="flashcard-back flex items-center justify-center p-4 rounded-lg">
                <p class="text-gray-600 text-center">{{ selectedCard.answer }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Progress Bar Below Flashcard -->
    <div v-if="selectedCard" class="fixed bottom-0 left-0 w-full p-4 flex items-center justify-center">
      <div class="relative w-full max-w-md h-4 rounded-full overflow-hidden">
        <div :style="{ width: progressWidth }" class="h-full bg-blue-500 absolute top-0 left-0 transition-all duration-500">
          <span class="absolute inset-0 flex items-center justify-center text-white font-semibold">{{ progressPercent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardsView',
  data() {
    return {
      selectedCard: null,
      isFlipped: false,
      currentIndex: null,
      allCards: [],
      categorizedFlashcards: {},
    };
  },
  computed: {
    hasPrevCard() {
      return this.currentIndex > 0;
    },
    hasNextCard() {
      return this.currentIndex < this.allCards.length - 1;
    },
    progressWidth() {
      const totalCards = this.allCards.length;
      const progress = ((this.currentIndex + 1) / totalCards) * 100;
      return `${progress}%`;
    },
    progressPercent() {
      return Math.round(((this.currentIndex + 1) / this.allCards.length) * 100);
    },
  },
  methods: {
    async fetchFlashcards() {
      try {
        // Przykładowe pobieranie danych z backendu
        const response = await fetch('http://localhost:3000/api/flashcards');
        const data = await response.json();

        // Zakładając, że dane są w formacie: { category: [card1, card2, ...] }
        this.categorizedFlashcards = data;
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    },
    selectCard(card) {
      this.selectedCard = card;
      this.isFlipped = false;
      this.currentIndex = this.allCards.findIndex(c => c.id === card.id);
    },
    deselectCard() {
      this.selectedCard = null;
      this.allCards = []; // Clear the list when closing card view
    },
    flipCard() {
      this.isFlipped = !this.isFlipped;
    },
    nextCard() {
      if (this.hasNextCard) {
        this.currentIndex++;
        this.selectedCard = this.allCards[this.currentIndex];
        this.isFlipped = false;
      }
    },
    prevCard() {
      if (this.hasPrevCard) {
        this.currentIndex--;
        this.selectedCard = this.allCards[this.currentIndex];
        this.isFlipped = false;
      }
    },
    learnAll() {
      this.allCards = this.shuffle(Object.values(this.categorizedFlashcards).flat());
      this.currentIndex = 0;
      this.selectedCard = this.allCards[this.currentIndex];
    },
    learnByCategory(category) {
      this.allCards = this.shuffle(this.categorizedFlashcards[category]);
      this.currentIndex = 0;
      this.selectedCard = this.allCards[this.currentIndex];
    },
    shuffle(array) {
      let currentIndex = array.length, randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }

      return array;
    },
    beforeEnter(el) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
    },
    enter(el, done) {
      el.offsetHeight; // trigger reflow
      el.style.transition = 'opacity 0.5s, transform 0.5s';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
      done();
    },
    leave(el, done) {
      el.style.transition = 'opacity 0.5s, transform 0.5s';
      el.style.opacity = 0;
      el.style.transform = 'translateY(20px)';
      done();
    },
  },
  async created() {
    await this.fetchFlashcards();
  },
};
</script>


<style scoped>
.flashcard {
  transition: transform 0.3s ease;
}

.flashcard:hover {
  transform: translateY(-5px);
}

.flashcard-preview {
  width: 100%;
  max-width: 320px;
  height: 200px;
  perspective: 1000px; /* Ustaw perspektywę dla efektu 3D */
}

.flashcard-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  width: 100%;
  height: 100%;
}

.flashcard-front, .flashcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* Ukrywa tylną stronę podczas obrotu */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Cień dla efektu głębi */
}

.flashcard-front {
  background: #fff; /* Tło przodu karty */
}

.flashcard-back {
  background: #f8f9fa; /* Tło tyłu karty */
  transform: rotateY(180deg); /* Obrót tyłu o 180 stopni */
}

.flashcard-inner.is-flipped {
  transform: rotateY(180deg); /* Obrót karty przy zmianie */
}

/* Przycisk zamknięcia */
button {
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

/* Przycisk zmiany */
button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
