import {MenuItem} from "./menu.enum";

const baseURL = `http://localhost:3000/`;
export const URLS = new Map<MenuItem, string>([
    [MenuItem.BOOKS, `${baseURL}${MenuItem.BOOKS}`,],
    [MenuItem.AUTHORS, `${baseURL}${MenuItem.AUTHORS}`,],
    [MenuItem.GENRES, `${baseURL}${MenuItem.GENRES}`,]
]);

export const BOOKS_URL = URLS.get(MenuItem.BOOKS) as string;
export const AUTHORS_URL = URLS.get(MenuItem.AUTHORS) as string;
export const GENRES_URL = URLS.get(MenuItem.GENRES) as string;
