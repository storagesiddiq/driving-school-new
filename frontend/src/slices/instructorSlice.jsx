import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";


//get Instructor
export const getInstructorProfile = createAsyncThunk('instructor/getInstructorProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/my-instructor-profile');
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//get Registered Users
export const getRegisteredUsers = createAsyncThunk('instructor/getRegisteredUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/registered-users');
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//create Session
export const createSession = createAsyncThunk('instructor/createSession',
    async ({ courseId, data }, { rejectWithValue }) => {
        try {
            const response = await API.post(`/session/${courseId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//update Session
export const updateSession = createAsyncThunk('instructor/updateSession',
    async ({ sessionId, data }, { rejectWithValue }) => {
        try {
            const response = await API.put(`/session/${sessionId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//getAllSession Session
export const getAllSession = createAsyncThunk('instructor/getAllSession',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get(`/sessions`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//getSingleSession Session
export const getSingleSession = createAsyncThunk('instructor/getSingleSession',
    async (sessionId, { rejectWithValue }) => {
        try {
            const response = await API.get(`/session/${sessionId}`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//deleteSession Session
export const deleteSession = createAsyncThunk('instructor/deleteSession',
    async (sessionId, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/session/${sessionId}`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//getAllDates of a Session
export const getAllDates = createAsyncThunk('instructor/getAllDates',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/attendance/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//take Attendance of a Session
export const takeAttendance = createAsyncThunk('instructor/takeAttendance',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await API.patch(`/attendance/status/${id}`, { status });
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//Generate Report and send to Email
export const generateReport = createAsyncThunk('instructor/generateReport',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.post(`/report/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//getAll Report
export const getAllReports = createAsyncThunk('instructor/getAllReports',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get(`/reports`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//getSingle Report
export const getSingleReport = createAsyncThunk('instructor/getSingleReport',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/report/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);
const instructorSlice = createSlice({
    name: 'instructor',
    initialState: {
        profile: [],
        regUsers: [],
        session: [],
        sessions: [],
        attenDates: [],
        reports:[],
        report:[],
        reportStatus: 'idle',
        status: 'idle',
        attStatus: 'idle',
        error: null,
        reportError: null,
        isDeleted: false,
        isCreated: false,
        isUpdated: false,
        isPatched: false
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
        clearPatched(state, action) {
            return {
                ...state,
                isPatched: false
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
          //GetAllreport
            .addCase(getAllReports.pending, (state) => {
                state.reportStatus = 'loading';
                state.reportError = null;
            })
            .addCase(getAllReports.fulfilled, (state, action) => {
                state.reportStatus = 'succeeded';
                state.reportError = null;
                state.reports = action.payload.reports
            })
            .addCase(getAllReports.rejected, (state, action) => {
                state.reportStatus = 'failed';
                state.reportError = action.payload || 'server Error';
            })

          //getSingleReport
            .addCase(getSingleReport.pending, (state) => {
                state.reportStatus = 'loading';
                state.reportError = null;
            })
            .addCase(getSingleReport.fulfilled, (state, action) => {
                state.reportStatus = 'succeeded';
                state.reportError = null;
                state.report = action.payload.report
            })
            .addCase(getSingleReport.rejected, (state, action) => {
                state.reportStatus = 'failed';
                state.reportError = action.payload || 'server Error';
            })


            //Generate Report
            .addCase(generateReport.pending, (state) => {
                state.reportStatus = 'loading';
                state.reportError = null;
            })
            .addCase(generateReport.fulfilled, (state, action) => {
                state.reportStatus = 'succeeded';
                state.reportError = null;
                state.isCreated = true
            })
            .addCase(generateReport.rejected, (state, action) => {
                state.reportStatus = 'failed';
                state.reportError = action.payload || 'server Error';
            })

            //take Attendance
            .addCase(takeAttendance.pending, (state) => {
                state.attStatus = 'loading';
                state.error = null;
            })
            .addCase(takeAttendance.fulfilled, (state, action) => {
                state.attStatus = 'succeeded';
                state.error = null;
                state.isPatched = true
            })
            .addCase(takeAttendance.rejected, (state, action) => {
                state.attStatus = 'failed';
                state.error = action.payload || 'server Error';
            })

            //getAll Dates of a Session
            .addCase(getAllDates.pending, (state) => {
                state.attStatus = 'loading';
                state.error = null;
            })
            .addCase(getAllDates.fulfilled, (state, action) => {
                state.attStatus = 'succeeded';
                state.error = null;
                state.attenDates = action.payload.attendances
            })
            .addCase(getAllDates.rejected, (state, action) => {
                state.attStatus = 'failed';
                state.error = action.payload || 'server Error';
            })

            //Delete Session
            .addCase(deleteSession.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteSession.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isDeleted = true
            })
            .addCase(deleteSession.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'server Error';
            })

            //update Session
            .addCase(updateSession.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateSession.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isUpdated = true
            })
            .addCase(updateSession.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'server Error';
            })

            //create Session
            .addCase(createSession.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createSession.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isCreated = true
            })
            .addCase(createSession.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'server Error';
            })

            //getAll Sessions
            .addCase(getAllSession.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getAllSession.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.sessions = action.payload.sessions
            })
            .addCase(getAllSession.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'server Error';
            })

            //getSingle Session
            .addCase(getSingleSession.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getSingleSession.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.session = action.payload.session
            })
            .addCase(getSingleSession.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'server Error';
            })


            .addCase(getInstructorProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getInstructorProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.profile = action.payload.instructor
            })
            .addCase(getInstructorProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'server Error';
            })

            .addCase(getRegisteredUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getRegisteredUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.regUsers = action.payload.learners
            })
            .addCase(getRegisteredUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'server Error';
            })

    }
})

export default instructorSlice.reducer;
export const Status = (state) => state.instructor.status;
export const Error = (state) => state.instructor.error;
export const myProfile = (state) => state.instructor.profile;
export const registeredUsers = (state) => state.instructor.regUsers;
export const AttStatus = (state) => state.instructor.attStatus;

export const IsDeleted = (state) => state.instructor.isDeleted;
export const IsCreated = (state) => state.instructor.isCreated;
export const IsUpdated = (state) => state.instructor.isUpdated;
export const IsPatched = (state) => state.instructor.isPatched;

export const allSessions = (state) => state.instructor.sessions;
export const singleSession = (state) => state.instructor.session;
export const allAttenDates = (state) => state.instructor.attenDates

export const ReportStatus = (state) => state.instructor.reportStatus;
export const ReportError = (state) => state.instructor.reportError;
export const allReports = (state) => state.instructor.reports;
export const sinlgeReport = (state) => state.instructor.report;

export const { clearPatched, clearUpdated, clearDeleted, clearStatus, clearError, clearCreated } = instructorSlice.actions