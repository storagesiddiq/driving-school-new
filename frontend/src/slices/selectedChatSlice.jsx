import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedChat: null,
  mobileSingleChat:false,
  isOpen:false,
  notification:[]
};

const selectedChatSlice = createSlice({
  name: 'selectedChat',
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setMobileSingleChat: (state, action) => {
      state.mobileSingleChat = action.payload;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    toggleIsOpen: (state, action) => {
      state.isOpen = !state.isOpen
    },
    clearSelectedChat(state, action) {
      return {
          ...state,
          selectedChat: null
      }
  }
  },
});

export const {setNotification, toggleIsOpen, setSelectedChat,clearSelectedChat, setMobileSingleChat} = selectedChatSlice.actions;

export default selectedChatSlice.reducer;
