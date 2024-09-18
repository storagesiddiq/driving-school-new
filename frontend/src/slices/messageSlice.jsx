import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";

// Send Message 
export const sendMessage = createAsyncThunk('chat/sendMessage',
    async ({ chatId, content }, { rejectWithValue }) => {
        try {
            const response = await API.post(`/send-msg`, {
                chatId, content
            });
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Message not created / found');
        }
    }
);

// Get ALL Messages
export const allMessages = createAsyncThunk('chat/allMessages',
    async ({chatId}, { rejectWithValue }) => {
        try {
            const response = await API.get(`/all-msg/${chatId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Message not Fetching');
        }
    }
);

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        status: 'idle',
        allMesStatus:'idle',
        error: null,
        message: null,
        messages:null,
    },
    reducers: {
        clearError(state, action) {
            return {
                ...state,
                error: null
            }
        },
        clearStatus(state, action) {
            return {
                ...state,
                status: 'idle'
            }
        },
        clearMessage(state, action) {
            return {
                ...state,
                message:null
            }
        },
    },
    extraReducers: (builder) => {
        builder
            //access Message 
            .addCase(sendMessage.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.message = action.payload.message;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            //all Messages
            .addCase(allMessages.pending, (state) => {
                state.allMesStatus = 'loading';
                state.error = null;
            })
            .addCase(allMessages.fulfilled, (state, action) => {
                state.allMesStatus = 'succeeded';
                state.error = null;
                state.messages = action.payload
            })
            .addCase(allMessages.rejected, (state, action) => {
                state.allMesStatus = 'failed';
                state.error = action.payload;
            })
    }
})

export const Status = (state) => state.message.status;
export const AllMesStatus = (state) => state.message.allMesStatus;
export const Error = (state) => state.message.error;
export const Message = (state) => state.message.message;
export const Messages = (state) => state.message.messages;

export const {clearMessage, clearStatus, clearError } = messageSlice.actions
export default messageSlice.reducer;
