import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";




const instructorSlice = createSlice({
    name: 'instructor',
    initialState: {
        instructors: [],
        instructor:[],
        status: 'idle',
        error: null,
        isDeleted: false,
        isCreated: false,
        isUpdated:false
    },
    reducers: {
        clearError(state, action) {
            return {
                ...state,
                error: null
            }
        },
        clearUpdated(state, action) {
            return {
                ...state,
                isUpdated: false
            }
        },
        clearDeleted(state, action) {
            return {
                ...state,
                isDeleted: false
            }
        },
        clearCreated(state, action) {
            return {
                ...state,
                isCreated: false
            }
        }
    },
    extraReducers: (builder) => {
        builder
            
    
    }
})

export default instructorSlice.reducer;
export const Status = (state) => state.instructor.status;
export const Error = (state) => state.instructor.error;
export const Instructors = (state) => state.instructor.instructors;
export const Instructor = (state) => state.instructor.instructor;

export const IsDeleted = (state) => state.instructor.isDeleted;
export const IsCreated = (state) => state.instructor.isCreated;
export const IsUpdated = (state) => state.instructor.isUpdated;



export const {clearUpdated, clearPatched, clearDeleted, clearStatus, clearError, clearCreated } = instructorSlice.actions