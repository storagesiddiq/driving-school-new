import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";


//GET All Services
export const getAllServices = createAsyncThunk('service/getAllServices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/services');
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//GET Single Service
export const getSingleService = createAsyncThunk('service/getSingleService',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/service/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//Create Service
export const addService = createAsyncThunk('service/addService', async (formData, { rejectWithValue }) => {
    try {
        const response = await API.post('/create-service', formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


//Delete Service
export const deleteService = createAsyncThunk('service/deleteService',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/service/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });



//Update Service
export const updateService = createAsyncThunk('service/updateService',
    async ({id, data}, { rejectWithValue }) => {
        try {
            const response = await API.put(`/service/${id}`,data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });

const serviceSlice = createSlice({
    name: 'service',
    initialState: {
        services: [],
        service: [],
        status: 'idle',
        error: null,
        isDeleted: false,
        isCreated: false,
        isUpdated: false
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
            //GetAll Services
            .addCase(getAllServices.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getAllServices.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.services = action.payload.services
            })
            .addCase(getAllServices.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Authentication failed';
            })

            //GetSingle Service
            .addCase(getSingleService.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getSingleService.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.service = action.payload
            })
            .addCase(getSingleService.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Authentication failed';
            })

            //Create Service
            .addCase(addService.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addService.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isCreated = true
            })
            .addCase(addService.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Authentication failed';
            })

            //update Service
            .addCase(updateService.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isUpdated = true
            })
            .addCase(updateService.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Authentication failed';
            })

            //Delete Service
            .addCase(deleteService.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isDeleted = true
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Authentication failed';
            })

    }
})

export default serviceSlice.reducer;
export const Status = (state) => state.service.status;
export const Error = (state) => state.service.error;

export const IsDeleted = (state) => state.service.isDeleted;
export const IsCreated = (state) => state.service.isCreated;
export const IsUpdated = (state) => state.service.isUpdated;

export const allServices = (state) => state.service.services;
export const singleService = (state) => state.service.service;


export const { clearUpdated,  clearDeleted, clearStatus, clearError, clearCreated } = serviceSlice.actions