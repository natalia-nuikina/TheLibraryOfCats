<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Cat } from '../store';
import image from '/Users/natal/Desktop/Апрель/frontend/src/pictures/кот.jpg';
const getPic = (cat: Cat): string => (cat.meta.img_src_set ? cat.meta.img_src_set['2x'] : image);

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Object as PropType<Cat>,
    required: true,
  }
});
defineEmits(['close']);
</script>

<template>
  <div v-if="isOpen" class="modal">
    <div class="modalСontent">
      <div class="modalHeader">
        <h2>Вся доступная информация про котика</h2>
        <button @click="$emit('close')">X</button>
      </div>
      <div class="modalBody">
        <img :src=getPic(data) :alt="data.breed">
        <div class="description">
          <p v-if="data.breed">Порода: {{ data.breed }}</p>
          <p v-if="data.origin">Происхождение: {{ data.origin }}</p>
          <p v-if="data.url">Больше информации: <a :href="data.url" target="_blank">{{ data.url }}</a></p>
          <p v-if="data.meta.body_type">Тип тела: {{ data.meta.body_type }}</p>
          <p v-if="data.meta.coat_type_and_length">Тип и длинна шерсти: {{ data.meta.coat_type_and_length }}</p>
          <p v-if="data.meta.coat_pattern">Окрас: {{ data.meta.coat_pattern }}</p>
          <p v-if="data.meta.type">Тип котика: {{ data.meta.type }}</p>
          <p v-if="data.meta['other names']">Другие названия: {{ data.meta['other names'] }}</p>
          <p v-if="data.meta.fife">fife: {{ data.meta.fife }}</p>
          <p v-if="data.meta.tica">tica: {{ data.meta.tica }}</p>
          <p v-if="data.meta.wcf">wcf: {{ data.meta.wcf }}</p>
          <p v-if="data.meta.weight">weight: {{ data.meta.weight }}</p>
          <p v-if="data.meta.coat">coat: {{ data.meta.coat }}</p>
          <p v-if="data.meta.color">color: {{ data.meta.color }}</p>
          <p v-if="data.meta['litter size']">Размер: {{ data.meta['litter size'] }}</p>
          <p v-if="data.meta.lifespan">lifespan: {{ data.meta.lifespan }}</p>
          <p v-if="data.meta['fur type']">fur type: {{ data.meta['fur type'] }}</p>
          <p v-if="data.meta.bobtail">bobtail: {{ data.meta.bobtail }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
