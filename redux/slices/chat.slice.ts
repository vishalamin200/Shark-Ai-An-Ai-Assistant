import axiosInstance from "@/utils/axiosInstance";
import { generateId } from "@/utils/generateId";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface Message {
    _id?: string,
    text: string | null,
    sender: string
}


export interface currentChatProps{
    _id?:string,
    title:string,
    messages?: Message[] | null
}

export interface SidebarChatProp{
    _id:string,
    title:string,
    createdAt:Date,
}

interface initialStateProps {
    hoveredMessage: string | null,
    copied: string | null,
    isEditing: { id: string | null, text: string | null },

    prompt: string | null,
    language: string | null,

    serverMessage: string | null
    loading: boolean

    scrollup: boolean,
    languageBar: boolean,
    profile: boolean,

    currentChat: currentChatProps | null
    userId: string | null,
    editingChatTitle:boolean,

    hoveredSidebarChat: string | null | mongoose.Types.ObjectId

    options:boolean,
}

const initialState: initialStateProps = {
    hoveredMessage: null,
    copied: null,
    isEditing: { id: null, text: null },

    prompt: "",
    language: null,

    serverMessage: null,
    loading: false,

    scrollup: false,

    languageBar: false,
    profile: false,

    currentChat:{
        _id:generateId(),
        title:"New Chat",
        messages:[],
    },
    userId:null,

    editingChatTitle:false,
    hoveredSidebarChat: null,

    options:false
}

export const copyMessage = createAsyncThunk("chat/copyMessage/", async ({ id, text }: { id: string, text: string }) => {
    try {
        await navigator.clipboard.writeText(text)
        return id
    } catch (error) {
        console.log("Failed to copy message", (error as Error).message)
    }
})

export const sendMessage = createAsyncThunk('sendMessage', async (data:{prompt:string, language:string}) => {
    try {
        const axiosPromise = await axiosInstance.post(`/prompt`, data)
        return axiosPromise?.data
    } catch (error) {
        console.log("Error in sending message", (error as Error).message)
    }
})

export const createNewChat = createAsyncThunk('creatNewChat', async (data:{userId:string}, thunkApi) => {
    try {
        const axiosPromise = await axiosInstance.post(`/chat`, data)
        return axiosPromise?.data
    } catch (error) {
        console.log("Error in sending message", (error as Error).message)
        return thunkApi.rejectWithValue((error as Error).message)
    }
})

export const add_new_message = createAsyncThunk('add_new_message', async (data:{userId:string, chatId:string, sender:string, text:string}, thunkApi) => {
    try {
        const axiosPromise = await axiosInstance.post(`/message/add`, data)
        return axiosPromise?.data
    } catch (error) {
        console.log("Error in adding new message", (error as Error).message)
        return thunkApi.rejectWithValue((error as Error).message)
    }
})


export const set_title = createAsyncThunk('set_title', async (data:{chatId:string, text:string, }, thunkApi) => {
    try {
        const axiosPromise = await axiosInstance.post(`/prompt/get_title/`, data)
        return axiosPromise?.data
    } catch (error) {
        console.log("Error in generating title", (error as Error).message)
        return thunkApi.rejectWithValue((error as Error).message)
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
            const { _id, text, sender } = action.payload
            if (!_id || !text || (sender !== 'user' && sender !== 'server')) {

            } else {
                if(state.currentChat && state.currentChat.messages){
                    state.currentChat.messages.push({ _id, text, sender })
                }   
            }
        },

        toggleScrollUp: (state) => {
            state.scrollup = !state.scrollup
        },
        toggleProfile: (state) => {
            state.profile = !state.profile
        },

        toggleLanguageBar: (state) => {
            state.languageBar = !state.languageBar
        },

        toggleOptions: (state) => {
            state.options = !state.options
        },

        setCurrentChat: (state,action)=>{
            state.currentChat = action.payload
        },
        setUserId: (state,action)=>{
            state.userId = action.payload
        },

        setHoveredSidebarChat: (state,action)=>{
            state.hoveredSidebarChat = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(copyMessage.fulfilled, (state, action) => {
                const id = action.payload
                state.copied = id as string
            })

            .addCase(sendMessage.pending, (state) => {
                state.prompt = ""
                state.loading = true
            })

            .addCase(sendMessage.fulfilled, (state, action) => {
                const { response } = action.payload

                state.loading = false
                state.serverMessage = response
            })

            .addCase(sendMessage.rejected, (state) => {
                state.loading = false
            })

            .addCase(createNewChat.fulfilled, (state, action) => {
                const newchat = action?.payload?.data
                state.currentChat = newchat
            })

            .addCase(add_new_message.fulfilled, (state, action) => {
                if(action.payload.success){
                    console.log("new message added succesfully",action.payload.data)
                }
            })

            .addCase(set_title.fulfilled, (state, action) => {
                if(action.payload.success && state.currentChat){
                    state.currentChat.title = action?.payload?.title
                    console.log('current chat title is ', action?.payload?.title)
                }
            })
    }

})

export const { setPrompt, addMessage, setServerMessage, setIsEditing, setLanguage, setHoveredMessage, setLoading, toggleScrollUp, toggleLanguageBar, toggleProfile,setCurrentChat,setUserId, setHoveredSidebarChat, toggleOptions} = chatSlice.actions
export default chatSlice.reducer