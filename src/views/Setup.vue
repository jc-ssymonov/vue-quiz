<script setup>
import {ref} from "vue";

const categoryList = ref([]);
const difficultList = ref([]);
const category = ref('');
const difficult = ref([]);
const number = ref('');
const loading = ref(true);
const error = ref([]);
const categoriesUri = import.meta.env.VITE_QUIZ_CATEGORIES_URL;
const questionsCountUri = import.meta.env.VITE_QUIZ_CATEGORY_QUESTIONS_COUNT_URL;

function getCategories() {
  loading.value = true;
  fetch(categoriesUri, {
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
      .then(response => {
        if (!response.ok) {
          const error = new Error(response.statusText);
          error.json = response.json();
          throw error;
        }

        return response.json();
      })
      .then(data => {
        categoryList.value = data['trivia_categories'];
        if (difficult.value.length) {
          console.log(difficult.value)
          getDifficult()
        }
      })
      .catch(err => {
        error.value = err;
        if (error.json) {
          return error.json.then(json => {
            error.value.message = json.message;
          });
        }
      })
      .then(() => {
        loading.value = false;
      });
}

function getDifficult(event) {
  this.category = event.target.value;
  difficult['questions'] = [
    '', 'easy', 'medium', 'hard'
  ];
  fetch(questionsCountUri.replace('{CATEGORY_ID}', this.category), {
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
      .then(response => {
        if (!response.ok) {
          const error = new Error(response.statusText);
          error.json = response.json();
          throw error;
        }

        return response.json();
      })
      .then(data => {
        difficultList.value = data['category_question_count'];
      })
      .catch(err => {
        error.value = err;
        if (error.json) {
          return error.json.then(json => {
            error.value.message = json.message;
          });
        }
      })
      .then(() => {
        loading.value = false;
      });
}

function onSubmit(event) {
  event.preventDefault()

  function filterDifficult(array) {
    const difficultNameValue = array[0][0];
    if (difficultNameValue.includes('easy')) {
      return 'easy'
    } else if (difficultNameValue.includes('medium')) {
      return 'medium'
    } else if (difficultNameValue.includes('hard')) {
      return 'hard'
    } else {
      return ''
    }
  }

  const difficultName = Object.entries(difficultList.value).filter((item) => {
    if (item.includes(this.difficult)) return true;
  });

  const params = {
    category: this.category,
    difficult: filterDifficult(difficultName),
    number: this.number,
  }

  // this.$router.push({path: '/quiz'})
}

getCategories()

</script>

<template>
  <div class="max-w-md" v-if="!loading && categoryList && categoryList.length">
    <h1>Setup Your Quiz</h1>
    <form @submit.prevent="onSubmit($event)">
      <select @change="getDifficult($event)"
              v-model="category"
              class="mt-4 inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
        <option :value="''" disabled selected hidden>Select a category</option>
        <option v-for="category in categoryList" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      <select v-model="difficult"
              :disabled="!category.length"
              class="mt-4 inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
        <option :value="''" disabled selected hidden>Select a difficult</option>
        <option :value="difficultList['total_question_count']">
          Any
        </option>
        <option :value="difficultList['total_easy_question_count']">
          Easy
        </option>
        <option :value="difficultList['total_medium_question_count']">
          Medium
        </option>
        <option :value="difficultList['total_hard_question_count']">
          Hard
        </option>
      </select>
      <input type="number"
             min="1"
             :max="difficult"
             v-model="number"
             :disabled="difficult.length"
             placeholder="Select number of questions"
             class="mt-4 inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
      <button
          type="submit"
          class="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Submit
      </button>
    </form>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<style scoped>

</style>
