import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import adminReducer from './slices/adminSlice'
import ownerReducer from './slices/ownerSlice'
import instructorSlice from './slices/instructorSlice'
import vehicleSlice from './slices/vehicleSlice'
import serviceSlice from './slices/serviceSlice'
import commonSlice from './slices/commonSlice'
import chatSlice from './slices/chatSlice'
import messageSlice from './slices/messageSlice'
import selectedChatSlice from './slices/selectedChatSlice'

export default configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: { warnAfter: 128 },
        serializableCheck: { warnAfter: 128 },
    }),

    reducer: {
        auth: authReducer,
        admin:adminReducer,
        owner: ownerReducer,
        instructor: instructorSlice,
        service: serviceSlice,
        vehicle: vehicleSlice,
        common: commonSlice,
        chat:chatSlice,
    message:messageSlice ,
    selectedChat:selectedChatSlice
   }
})