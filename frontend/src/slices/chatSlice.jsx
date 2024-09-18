import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";

// Access Chat
export const accessChat = createAsyncThunk(
    'chat/accessChat',
    async ({ userId }, { rejectWithValue }) => {
        try {
            const response = await API.post(`/chat/${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Chat not created / found');
        }
    }
);

// Fetch Chat
export const fetchChat = createAsyncThunk(
    'chat/fetchChat',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get(`/chat`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Chat not fetching');
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        status: 'idle',
        error: null,
        chat: null,
        chats: [],
    },
    reducers: {
        clearError(state) {
            state.error = null;
        },
        clearStatus(state) {
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            // Access Chat
            .addCase(accessChat.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(accessChat.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.chat = action.payload.chat;
            })
            .addCase(accessChat.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Fetch Chat
            .addCase(fetchChat.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchChat.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.chats = action.payload.chats;
            })
            .addCase(fetchChat.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const selectStatus = (state) => state.chat.status;
export const selectError = (state) => state.chat.error;
export const selectChat = (state) => state.chat.chat;
export const selectChats = (state) => state.chat.chats;

export const { clearStatus, clearError } = chatSlice.actions;

export default chatSlice.reducer;

