import { defineStore } from 'pinia';
import { fetchData } from './api';
import { uniq, intersectionBy, includes } from 'lodash';

export interface Cat {
  id: number,
  breed: string,
  origin: string,
  url: string,
  img: string,
  [key: string]: string | {},
  meta: {
    type: string,
    body_type: string,
    coat_type_and_length: string,
    coat_pattern: string,
    img_src_set: { [key: string]: string },
    [key: string]: string | {},
  },
}

interface Filters {
  [key: string]: string;
};

const findCat = (obj: object, str: string): boolean[]  => Object.values(obj).map((item) => {
  if (typeof(item) === 'string' && item.toLowerCase().includes(str.toLowerCase())) {
      return true;
  } else if (typeof(item) === 'object') { 
    return (findCat(item, str.toLowerCase()).includes(true)) 
  }
  return false;
});

export const useCatsStore = defineStore('cats', {
  state: () => ({
    cats: [] as Cat[],
    filteredCats: [] as Cat[],
    filters: {} as Filters,
    origins: [] as string[],
    bodyType: [] as string[],
    coatTypeAndLength: [] as string[],
    coatPattern: [] as string[],
    err: '' as string,
  }),
  
  actions: {
    async getCats() {
      try {
        const cats = await fetchData();
        this.cats = cats;
        this.filteredCats = cats;
      } catch (error) {
        this.err = 'Ошибка при загрузке котиков';
      }
      this.origins = uniq(this.cats.map((cat) => cat.origin)).sort((a, b) => a.localeCompare(b));
      this.bodyType = uniq(this.cats.map((cat) => cat.meta.body_type)).sort((a, b) => a.localeCompare(b));
      this.coatTypeAndLength = uniq(this.cats.map((cat) => cat.meta.coat_type_and_length)).sort((a, b) => a.localeCompare(b));
      this.coatPattern = uniq(this.cats.map((cat) => cat.meta.coat_pattern)).sort((a, b) => a.localeCompare(b));
    },
    updateCats(marker: string, value: string) {
      this.filters[marker] = value;
      const filters = Object.entries(this.filters);
      const AllFilteredLists = [] as Cat[][];
      filters.forEach(([filter, values]) => {
        if (values.length > 0) {
          const oneFiltered = this.cats.reduce((acc: Cat[], cat) => {
            if (filter === 'currText') {
              return (findCat(cat, values).includes(true)) ? [...acc, cat] : acc;
            }
            if (includes(cat, values)) {
              return [...acc, cat];
            } else if (includes(cat.meta, values)) {
              return [...acc, cat];
            } else {
              return acc;
            }
            }, []);
          AllFilteredLists.push(oneFiltered)
        } else {
          AllFilteredLists.push(this.cats)
        }
      })
      this.filteredCats = intersectionBy(...AllFilteredLists, 'id')
    }
  },
});