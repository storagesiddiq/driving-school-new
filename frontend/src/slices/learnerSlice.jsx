import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";


// apply Course
export const applyCourse = createAsyncThunk('learner/applyCourse',
    async ({courseId}, { rejectWithValue }) => {
        try {
            const response = await API.get(`/apply-course/${courseId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Message not Fetching');
        }
    }
);

// Give Rating Course
export const giveRatingCourse = createAsyncThunk('learner/giveRatingCourse',
    async ({courseId}, { rejectWithValue }) => {
        try {
            const response = await API.get(`/review/${courseId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Unknown Error');
        }
    }
);

// Get My courses
export const getMyCourses = createAsyncThunk('learner/getMyCourses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get(`/my-courses`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Unknown Error');
        }
    }
);

// Get My Session
export const getMySession = createAsyncThunk('learner/getMySession',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get(`/my-sessions`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Unknown Error');
        }
    }
);


const learnerSlice = createSlice({
    name: 'learner',
    initialState: {
        status: 'idle',
        error: null,
        courses:[],
        sessions:[],
        isCreated:false,
        isUpdate:false,
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
        clearUpdated(state, action) {
            return {
                ...state,
                isCreated: false
            }
        },
        clearCreated(state, action) {
            return {
                ...state,
                isUpdate: false
            }
        }
    },
    extraReducers: (builder) => {
        builder
         // getMy Sessions
         .addCase(getMySession.pending, (state) => {
            state.allMesStatus = 'loading';
            state.error = null;
        })
        .addCase(getMySession.fulfilled, (state, action) => {
            state.allMesStatus = 'succeeded';
            state.error = null;
            state.sessions =  action.payload.sessions
        })
        .addCase(getMySession.rejected, (state, action) => {
            state.allMesStatus = 'failed';
            state.error = action.payload;
        })

             // getMyCourses
             .addCase(getMyCourses.pending, (state) => {
                state.allMesStatus = 'loading';
                state.error = null;
            })
            .addCase(getMyCourses.fulfilled, (state, action) => {
                state.allMesStatus = 'succeeded';
                state.error = null;
                state.courses =  action.payload.courses
            })
            .addCase(getMyCourses.rejected, (state, action) => {
                state.allMesStatus = 'failed';
                state.error = action.payload;
            })

             // Give Rating Course
             .addCase(giveRatingCourse.pending, (state) => {
                state.allMesStatus = 'loading';
                state.error = null;
            })
            .addCase(giveRatingCourse.fulfilled, (state, action) => {
                state.allMesStatus = 'succeeded';
                state.error = null;
                state.isUpdate = true
            })
            .addCase(giveRatingCourse.rejected, (state, action) => {
                state.allMesStatus = 'failed';
                state.error = action.payload;
            })

            // apply Course
            .addCase(applyCourse.pending, (state) => {
                state.allMesStatus = 'loading';
                state.error = null;
            })
            .addCase(applyCourse.fulfilled, (state, action) => {
                state.allMesStatus = 'succeeded';
                state.error = null;
                state.isUpdate = true
            })
            .addCase(applyCourse.rejected, (state, action) => {
                state.allMesStatus = 'failed';
                state.error = action.payload;
            })
    }
})

export const Status = (state) => state.learner.status;
export const Error = (state) => state.learner.error;
export const IsUpdate = (state) => state.learner.isUpdate;
export const IsCreated = (state) => state.learner.isCreated;
export const allCourses = (state) => state.learner.courses;
export const allSessions = (state) => state.learner.sessions;

export const {clearUpdated,clearCreated, clearStatus, clearError } = learnerSlice.actions
export default learnerSlice.reducer;
