<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCatsStore } from '../store';
import { chunk } from 'lodash';
import type { Cat } from '../store';
import image from '/Users/natal/Desktop/Апрель/frontend/src/pictures/кот.jpg';
import Modal from './Modal.vue';

const catsStore = useCatsStore();
const perPage: Ref<number> = ref(5);
const currentPage: Ref<number> = ref(1);
const modalCat: Ref<Cat> = ref({} as Cat);
const isModalOpen = ref(false);
const nums: number[] = [5, 10, 20, 50, 100];
const currOrigin: Ref<string>  = ref('');
const currBodyType: Ref<string>  = ref('');
const currCoatTypeAndLength: Ref<string>  = ref('');
const currCoatPattern: Ref<string>  = ref('');
const currText: Ref<string>  = ref('');
  const viewOptions = {
  cards: { name: 'Отобразить в виде списка', classList: 'catsCards', classItem: 'catCard' },
  list: { name: 'Отобразить в виде карточек', classList: 'catsList', classItem: 'catLi' },
};
const currentView = ref(viewOptions.cards);

onMounted((): void => {
  catsStore.getCats();
});

const openModal = (cat: Cat): void => {
  isModalOpen.value = true;
  modalCat.value = cat;
}
const closeModal = (): void => {
  isModalOpen.value = false;
}

const handleView = (): void => {
  if (currentView.value.name === viewOptions.list.name) {
    currentView.value = viewOptions.cards;
  } else {
    currentView.value = viewOptions.list;
  };
};

const getCurrentPage = (): Cat[] => {
  const pages = chunk(catsStore.filteredCats, perPage.value);
  return pages[currentPage.value - 1];
};
const getNumOfLastPage = (): number => Math.ceil(catsStore.filteredCats.length / perPage.value);
const getPreviousPage = (num?: number): void => {
  if (num) {
    currentPage.value = num;
  } else {
    currentPage.value = (currentPage.value > 1) ? currentPage.value - 1 : currentPage.value;
  };
};
const getNextPage = (num?: number): void => {
  if (num) {
    currentPage.value = num;
  } else {
    currentPage.value = (currentPage.value < getNumOfLastPage()) ? currentPage.value + 1 : currentPage.value;
  };
};

const getPic = (cat: Cat): string => (cat.meta.img_src_set ? cat.meta.img_src_set['2x'] : image);
</script>

<template>
  <div class="wrapper">
    <div class="header">
      <h1>Породы котиков</h1>
      <div class="options">
        <button @click="handleView">{{ currentView.name }}</button>
        <div class="selectNumbers">Отображать по 
          <select v-model="perPage">
          <option v-for="num in nums" :value="num">
            {{ num }}
          </option>
          </select> 
        котиков на странице</div>
      </div>
    </div>

    <main class="body">
      <div class="filters">
        <div class="filter">
          <div>Введите любое слово для поиска совпадений среди котиков:</div>
          <input v-model="currText" @keyup="catsStore.updateCats('currText', currText)">
        </div>

        <div class="filter">
          <div>Выберете происхождение котиков:</div>
          <select v-model="currOrigin" @change="catsStore.updateCats('origin', currOrigin)">
            <option value=''>Не выбрано</option>
            <option v-for="origin in catsStore.origins" :value="origin">
              {{ origin }}
            </option>
          </select>
        </div>

        <div class="filter">
          <div>Выберете тип тела котиков:</div>
          <select v-model="currBodyType" @change="catsStore.updateCats('body_type', currBodyType)">
            <option value=''>Не выбрано</option>
            <option v-for="origin in catsStore.bodyType" :value="origin">
              {{ origin }}
            </option>
          </select>
        </div>

        <div class="filter">
          <div>Выберете тип и длинну шерсти котиков:</div>
          <select v-model="currCoatTypeAndLength" @change="catsStore.updateCats('coat_type_and_length', currCoatTypeAndLength)">
            <option value=''>Не выбрано</option>
            <option v-for="origin in catsStore.coatTypeAndLength" :value="origin">
              {{ origin }}
            </option>
          </select>
        </div>

        <div class="filter">
          <div>Выберете окрас котиков:</div>
          <select v-model="currCoatPattern" @change="catsStore.updateCats('coat_pattern', currCoatPattern)">
            <option value=''>Не выбрано</option>
            <option v-for="origin in catsStore.coatPattern" :value="origin">
              {{ origin }}
            </option>
          </select>
        </div>
      </div>

      <div class="cats" v-if="catsStore.err.length === 0">
        <div :class=currentView.classList>
          <div v-for="cat in getCurrentPage()" :key="cat.id" :class=currentView.classItem @click="openModal(cat)">
            <img :src=getPic(cat) :alt="cat.breed">
            <div class="discription">
              <h3>{{ cat.breed }}</h3>
              <div>Происхождение: {{ cat.origin }}</div>
              <div>Тип тела: {{ cat.meta.body_type }}</div>
              <div>Окрас: {{ cat.meta.coat_pattern }}</div>
            </div>
          </div>
        </div>
        <div class="pagination" v-if="catsStore.filteredCats.length > 0">
          <button @click="getPreviousPage(1)" :hidden="currentPage === 1"><<</button>
          <button @click="getPreviousPage()" :hidden="currentPage === 1"><</button>
          <div class="textPagination">{{ currentPage }} страница из {{ getNumOfLastPage() }}</div>
          <button @click="getNextPage()" :hidden="currentPage === getNumOfLastPage()">></button>
          <button @click="getNextPage(getNumOfLastPage())" :hidden="currentPage === getNumOfLastPage()">>></button>
        </div>
        <div class="catsNotFound" v-else>Котики не найдены =(</div>
      </div>
      <div v-else>{{ catsStore.err }}</div>
    </main>
  </div>
  <Modal v-if="isModalOpen" :isOpen="isModalOpen" :data="modalCat" @close="closeModal"/>
</template>
