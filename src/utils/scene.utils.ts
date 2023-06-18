import {Scene} from "../types/app.ts";
import {nanoid} from "nanoid";

export const newScene = (): Scene => ({
    key: nanoid(),
    lastChange: undefined,
    name: `Unnamed ${new Date().toLocaleString()}`,
    elements: [],
    files: undefined
})