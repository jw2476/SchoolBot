import {writable} from "svelte/store";
import base from "axios";

export const type = writable("")
export const axios = base.create({baseURL: BASE_URL})