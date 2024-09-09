import axios from 'axios';

// Ustaw bazowy URL dla wszystkich żądań API
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Adres backendu
    timeout: 5000,
});

// Funkcja do pobierania wszystkich fiszek
export const getFlashcards = async () => {
    try {
        const response = await api.get('/flashcards');
        return response;
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        throw error;
    }
};

// Funkcja do pobierania wszystkich kategorii
export const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Funkcja do dodawania fiszki
export const addFlashcard = async (flashcard) => {
    try {
        const response = await api.post('/flashcards', flashcard);
        return response;
    } catch (error) {
        console.error('Error adding flashcard:', error);
        throw error;
    }
};

// Funkcja do dodawania kategorii
export const addCategory = async (category) => {
    try {
        const response = await api.post('/categories', category);
        return response;
    } catch (error) {
        console.error('Error adding category:', error);
        throw error;
    }
};

export default api;
