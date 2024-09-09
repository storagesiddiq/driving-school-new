import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";

//GET Analytics
export const getAnalytics = createAsyncThunk('admin/getAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/admin/super-admin-analytics');
            return response.data; 
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//GET Schools
export const getSchools = createAsyncThunk('admin/getSchools',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/admin/driving-schools');
            return response.data; 
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//GET single School
export const getSingleSchool = createAsyncThunk('admin/getSingleSchool',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/admin/driving-school/${id}`);
            return response.data; 
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//Create School
export const createSchool = createAsyncThunk('admin/createSchool',
    async (data, { rejectWithValue }) => {
        try {
            const response = await API.post(`/admin/driving-school`, data);
            return response.data; 
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
    school:[],
    schools:[],
    anaylicts:[],
    status: 'idle',
    error: null,
    isDeleted: false,
    isCreated:false
},
reducers: {
    clearError(state, action) {
        return {
            ...state,
            error: null
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
    },
    clearStatus(state, action) {
        return {
            ...state,
            status: 'idle'
        }
    }
},
extraReducers: (builder) => {
    builder
    //Create School
    .addCase(createSchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
    })
    .addCase(createSchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.isCreated = true
    })
    .addCase(createSchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Authentication failed';
    })

    .addCase(getAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
    })
    .addCase(getAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.anaylicts = action.payload.data;
    })
    .addCase(getAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Authentication failed';
    })

    //getSchools
    .addCase(getSchools.pending, (state) => {
        state.status = 'loading';
        state.error = null;
    })
    .addCase(getSchools.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.schools = action.payload.drivingSchools;
    })
    .addCase(getSchools.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Authentication failed';
    })

    
    //get Single Schools
    .addCase(getSingleSchool.pending, (state) => {
        state.status = 'loading';
        state.error = null;
    })
    .addCase(getSingleSchool.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.school = action.payload;
    })
    .addCase(getSingleSchool.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Authentication failed';
    })
}
})

export default adminSlice.reducer;
export const Status = (state) => state.admin.status;
export const Error = (state) => state.admin.error;
export const analyticsData = (state) => state.admin.anaylicts;
export const Schools = (state) => state.admin.schools;
export const isDeleted = (state) => state.admin.isDeleted;
export const IsCreated = (state) => state.admin.isCreated;
export const singleSchool = (state) => state.admin.school;


export const {clearDeleted, clearStatus,  clearError, clearCreated } = adminSlice.actions