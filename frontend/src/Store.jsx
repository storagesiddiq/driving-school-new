import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import adminReducer from './slices/adminSlice'
import ownerReducer from './slices/ownerSlice'
import instructorSlice from './slices/instructorSlice'

export default configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: { warnAfter: 128 },
        serializableCheck: { warnAfter: 128 },
    }),

    reducer: {
        auth: authReducer,
        admin:adminReducer,
        owner: ownerReducer,
        instructor: instructorSlice
    }
})