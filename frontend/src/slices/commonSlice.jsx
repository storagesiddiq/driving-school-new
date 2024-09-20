import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";


//getAll courses
export const getAllCourses = createAsyncThunk('common/getAllCourses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/courses');
            return response.data; 
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//getSingle course
export const getSingleCourse = createAsyncThunk('common/getSingleCourse',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/course/${id}`);
            return response.data; 
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//getAll insturctors
export const getAllInstructors= createAsyncThunk('common/getAllInstructors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/instructors');
            return response.data; 
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//getSingle insturctor
export const getSingleInstructor = createAsyncThunk('common/getSingleInstructor',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/instructor/${id}`);
            return response.data; 
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//getAll schools
export const getAllSchools = createAsyncThunk('common/getAllSchools',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/driving-schools');
            return response.data; 
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//getSingle school
export const getSingleSchool = createAsyncThunk('common/getSingleSchool',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/driving-school/${id}`);
            return response.data; 
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const CommonSlice = createSlice({
    name: 'common',
    initialState: {
        courses:[],
        course:[],
        schools:[],
        school:[],
        instructors:[],
        instructor:[],
        status: 'idle',
        error: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllCourses.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(getAllCourses.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.error = null;
            state.courses = action.payload.courses
        })
        .addCase(getAllCourses.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'server Error';
        })

        .addCase(getSingleCourse.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(getSingleCourse.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.error = null;
            state.course = action.payload.course
        })
        .addCase(getSingleCourse.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'server Error';
        })

 /* ************* */
            .addCase(getAllInstructors.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(getAllInstructors.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.error = null;
            state.instructors = action.payload.instructors
        })
        .addCase(getAllInstructors.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'server Error';
        })

        .addCase(getSingleInstructor.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(getSingleInstructor.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.error = null;
            state.instructor = action.payload.instructor
        })
        .addCase(getSingleInstructor.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'server Error';
        })
/* ************** */
            .addCase(getAllSchools.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(getAllSchools.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.error = null;
            state.schools = action.payload.drivingSchools
        })
        .addCase(getAllSchools.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'server Error';
        })

        .addCase(getSingleSchool.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(getSingleSchool.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.error = null;
            state.school = action.payload
        })
        .addCase(getSingleSchool.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'server Error';
        })
    
    }
})

export default CommonSlice.reducer;
export const Status = (state) => state.common.status;
export const Error = (state) => state.common.error;

export const allCourses = (state) => state.common.courses;
export const allInstructors = (state) => state.common.instructors;
export const allSchools = (state) => state.common.schools;
export const singleCourse = (state) => state.common.course;
export const singleInstructor = (state) => state.common.instructor;
export const singleSchool = (state) => state.common.school;

