import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";


//GET All Vehicle
export const getAllVehicles = createAsyncThunk('vehicle/getAllVehicles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/vehicles');
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//GET Single vehicle
export const getSingleVehicle = createAsyncThunk('vehicle/getSingleVehicle',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/vehicle/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//Create vehicle
export const addVehicle = createAsyncThunk('vehicle/addVehicle', async (formData, { rejectWithValue }) => {
    try {
        const response = await API.post('/create-vehicle', formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


//Delete vehicle
export const deleteVehicle = createAsyncThunk('vehicle/deleteVehicle',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/vehicle/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });

//Update vehicle
export const updateVehicle = createAsyncThunk('vehicle/updateVehicle',
    async ({id,data}, { rejectWithValue }) => {
        try {
            const response = await API.put(`/vehicle/${id}`,data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });

const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState: {
        vehicles: [],
        vehicle: [],
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
            //GetAll vehicles
            .addCase(getAllVehicles.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getAllVehicles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.vehicles = action.payload.vehicles
            })
            .addCase(getAllVehicles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Authentication failed';
            })

            //GetSingle vehicle
            .addCase(getSingleVehicle.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getSingleVehicle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.vehicle = action.payload
            })
            .addCase(getSingleVehicle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Authentication failed';
            })

            //Create vehicle
            .addCase(addVehicle.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addVehicle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isCreated = true
            })
            .addCase(addVehicle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Authentication failed';
            })

            //update Service
            .addCase(updateVehicle.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateVehicle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isUpdated = true
            })
            .addCase(updateVehicle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Authentication failed';
            })

            //Delete Service
            .addCase(deleteVehicle.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteVehicle.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isDeleted = true
            })
            .addCase(deleteVehicle.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message.message || 'Authentication failed';
            })

    }
})

export default vehicleSlice.reducer;
export const Status = (state) => state.vehicle.status;
export const Error = (state) => state.vehicle.error;

export const IsDeleted = (state) => state.vehicle.isDeleted;
export const IsCreated = (state) => state.vehicle.isCreated;
export const IsUpdated = (state) => state.vehicle.isUpdated;

export const allVehicles = (state) => state.vehicle.vehicles;
export const singleVehicle = (state) => state.vehicle.vehicle;


export const allCourses = (state) => state.vehicle.courses;
export const singleCourse = (state) => state.vehicle.course;

export const { clearUpdated,  clearDeleted, clearStatus, clearError, clearCreated } = vehicleSlice.actions