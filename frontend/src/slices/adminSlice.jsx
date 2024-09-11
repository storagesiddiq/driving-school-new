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

//Delete School
export const deleteSchool = createAsyncThunk('admin/deleteSchool',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/admin/driving-school/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//GET default avatar
export const getDefaultAvatar = createAsyncThunk('admin/getDefaultAvatar',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get(`/admin/default-avatar`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//GET default Banner
export const getDefaultBanner = createAsyncThunk('admin/getDefaultBanner',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get(`/admin/default-banner`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//update  default avatar
export const updateDefaultAvatar = createAsyncThunk('admin/updateDefaultAvatar',
    async (img, { rejectWithValue }) => {
        try {
            const response = await API.put(`/admin/updateAvatar`, img, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//update  default banner
export const updateDefaultBanner = createAsyncThunk('admin/updateDefaultBanner',
    async (img, { rejectWithValue }) => {
        try {
            const response = await API.put(`/admin/updateBanner`, img, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
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
        school: [],
        schools: [],
        anaylicts: [],
        status: 'idle',
        error: null,
        isDeleted: false,
        isCreated: false,
        avatar: null,
        banner: null
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
            //getDefaultAvatar
            .addCase(getDefaultAvatar.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getDefaultAvatar.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.avatar = action.payload.url
            })
            .addCase(getDefaultAvatar.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Authentication failed';
            })

            //getDefaultBanner
            .addCase(getDefaultBanner.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getDefaultBanner.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.banner = action.payload.url
            })
            .addCase(getDefaultBanner.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Authentication failed';
            })

            //update Default Avatar
            .addCase(updateDefaultAvatar.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateDefaultAvatar.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.avatar = action.payload.imageUrl
            })
            .addCase(updateDefaultAvatar.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Authentication failed';
            })

            //update Default Banner
            .addCase(updateDefaultBanner.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateDefaultBanner.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.banner = action.payload.imageUrl
            })
            .addCase(updateDefaultBanner.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Authentication failed';
            })

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

            //Delete School
            .addCase(deleteSchool.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteSchool.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isDeleted = true
            })
            .addCase(deleteSchool.rejected, (state, action) => {
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
export const IsDeleted = (state) => state.admin.isDeleted;
export const IsCreated = (state) => state.admin.isCreated;
export const singleSchool = (state) => state.admin.school;

export const Avatar = (state) => state.admin.avatar;
export const Banner = (state) => state.admin.banner;


export const { clearDeleted, clearStatus, clearError, clearCreated } = adminSlice.actions