import { configureStore } from "@reduxjs/toolkit";

import chatSlice from "./slices/chat.slice";


const store = configureStore({
    reducer: {
        chat: chatSlice,
    },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export default store