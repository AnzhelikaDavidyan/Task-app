import {MenuItem} from "./menu.enum";

const baseURL = `http://localhost:3000/`;
export const URLS = new Map<MenuItem, string>([
  [MenuItem.BOOKS, `${baseURL}${MenuItem.BOOKS}`,],
  [MenuItem.AUTHORS, `${baseURL}${MenuItem.AUTHORS}`,],
  [MenuItem.GENRES, `${baseURL}${MenuItem.GENRES}`,]
]);

