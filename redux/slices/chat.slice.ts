import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Message {
    id: string,
    text: string | null,
    sender: string
}

interface initialStateProps {
    messages: Message[],
    hoveredMessage: string | null,
    copied: string | null,
    isEditing: { id: string | null, text: string | null },

    prompt: string | null,
    language: string | null,

    serverMessage: string | null
    loading: boolean

    scrollup:boolean,
    languageBar:boolean,
    profile:boolean,
}

const initialState: initialStateProps = {
    messages: [],
    hoveredMessage: null,
    copied: null,
    isEditing: { id: null, text: null },

    prompt: "",
    language: null,

    serverMessage: null,
    loading: false,

    scrollup:false,

    languageBar: false,
    profile:false,
}

export const copyMessage = createAsyncThunk("chat/copyMessage/", async ({ id, text }: { id: string, text: string }) => {
    try {
        await navigator.clipboard.writeText(text)
        return id
    } catch (error) {
        console.log("Failed to copy message", (error as Error).message)
    }
})

export const sendMessage = createAsyncThunk('sendMessage', async (data) => {
    try {
        const axiosPromise = await axios.post(`http://localhost:3000//api/prompt/`, data)
        return axiosPromise?.data
    } catch (error) {
        console.log("Error in sending message", (error as Error).message)
    }
})

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setPrompt: (state, action) => {
            state.prompt = action.payload
        },

        setHoveredMessage: (state, action) => {
            const id = action.payload
            state.hoveredMessage = id
        },

        setLanguage: (state, action) => {
            state.language = action.payload
        },

        setIsEditing: (state, action) => {
            state.isEditing = action.payload
        },

        setLoading: (state, action) => {
            state.loading = action.payload
        },

        setServerMessage: (state, action) => {
            state.serverMessage = action.payload
        },

        addMessage: (state, action: PayloadAction<Message>) => {
            const { id, text, sender } = action.payload
            if (!id || !text || (sender !== 'user' && sender !== 'server')) {

            } else {
                state.messages.push({ id, text, sender })
            }
        },

        toggleScrollUp: (state)=>{
            state.scrollup = !state.scrollup
        },
        toggleProfile: (state)=>{
            state.profile = !state.profile
        },
    
        toggleLanguageBar: (state)=>{
            state.languageBar = !state.languageBar
        },
    

    },
    extraReducers: (builder) => {
        builder
            .addCase(copyMessage.fulfilled, (state, action) => {
                const id = action.payload
                state.copied = id as string
            })

            .addCase(sendMessage.pending, (state)=>{
                state.prompt = ""
                state.loading=true
            })

            .addCase(sendMessage.fulfilled, (state, action) => {
                const { response } = action.payload

                state.loading = false
                state.serverMessage = response
            })

            .addCase(sendMessage.rejected, (state,action)=>{
                state.loading = false
            })
    }

})

export const { setPrompt, addMessage, setServerMessage, setIsEditing, setLanguage, setHoveredMessage, setLoading, toggleScrollUp, toggleLanguageBar, toggleProfile } = chatSlice.actions
export default chatSlice.reducer