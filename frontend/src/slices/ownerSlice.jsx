import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";

//GET MY Schools
export const getMySchool = createAsyncThunk('owner/getMySchool',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/get-my-school');
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//PATCH School Avatar
export const patchMySchoolAvatar = createAsyncThunk('owner/patchMySchoolAvatar',
    async (data, { rejectWithValue }) => {
        try {
            const response = await API.patch('/patch-my-school-avatar', data, {
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

//PATCH School Banner
export const patchMySchoolBanner = createAsyncThunk('owner/patchMySchoolBanner',
    async (data, { rejectWithValue }) => {
        try {
            const response = await API.patch('/patch-my-school-banner', data, {
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

//Update School 
export const updateMySchool = createAsyncThunk('owner/updateMySchool',
    async (data, { rejectWithValue }) => {
        try {
            const response = await API.put('/update-my-school', data,);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//GET All Instructors
export const getAllInstructors = createAsyncThunk('instructor/getAllInstructors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/admin/instructors');
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//GET Single Instructor
export const getSingleInstructor = createAsyncThunk('instructor/getSingleInstructor',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/admin/instructor/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//Create Instructor
export const addInstructor = createAsyncThunk('owner/addInstructor', async (formData, { rejectWithValue }) => {
    try {
        const response = await API.post('/create-instructor', formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//Take Attendance
export const takeInstructorAttendance = createAsyncThunk('instructor/takeInstructorAttendance',
    async ({ id, obj }, { rejectWithValue }) => {
        try {
            const response = await API.put(`/instructor/attendance/${id}`, obj);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//Delete Instructor
export const deleteInstructor = createAsyncThunk('owner/deleteInstructor',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/delete-instructor/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });

//GET All Courses
export const getAllCourses = createAsyncThunk('instructor/getAllCourses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/get-courses');
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//GET Single Course
export const getSingleCourse = createAsyncThunk('instructor/getSingleCourse',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/get-course/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//Create Course
export const addCourse = createAsyncThunk('owner/addCourse', async (formData,
     { rejectWithValue }) => {
    try {
        console.log(formData);
        
        const response = await API.post('/create-course', formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


//Delete Course
export const deleteCourse = createAsyncThunk('owner/deleteCourse',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.delete(`/course/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });

//Update Course
export const updateCourse = createAsyncThunk('owner/updateCourse',
    async ({id,data}, { rejectWithValue }) => {
        try {
            const response = await API.put(`/course/${id}`,data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });


//GET All Registered Users
export const getAllRegUsers = createAsyncThunk('owner/getAllRegUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/registerLearners');
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//GET Single Registered Users
export const getSingleRegUsers = createAsyncThunk('owner/getSingleRegUsers',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/registerLearner/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//Give Access to Registered Users 
export const accessRegUsers = createAsyncThunk('owner/accessRegUsers',
    async ({id, status}, { rejectWithValue }) => {
        try {
            const response = await API.put(`/registerLearner/${id}`,{status});
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    });


const ownerSlice = createSlice({
    name: 'owner',
    initialState: {
        courses:[],
        course:[],
        instructors: [],
        instructor: [],
        school: [],
        regUsers:[],
        regUser:[],
        status: 'idle',
        error: null,
        isDeleted: false,
        isCreated: false,
        isPatched: false,
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
           //GetAll RegUsers
           .addCase(getAllRegUsers.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(getAllRegUsers.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.error = null;
            state.regUsers = action.payload.registeredLearners
        })
        .addCase(getAllRegUsers.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload.message || 'server Error';
        })

        //GetSingle RegUsers
        .addCase(getSingleRegUsers.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(getSingleRegUsers.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.error = null;
            state.regUser = action.payload.registeredLearners
        })
        .addCase(getSingleRegUsers.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload || 'server Error';
        })

              //Give access to Reg Users
              .addCase(accessRegUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(accessRegUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isUpdated = true
            })
            .addCase(accessRegUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'server Error';
            })



          //update Course
          .addCase(updateCourse.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(updateCourse.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.error = null;
            state.isUpdated = true
        })
        .addCase(updateCourse.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload.message || 'server Error';
        })
         //GetSingle Course
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
            state.error = action.payload.message  || 'server Error';
        })
        //Create Course 
        .addCase(addCourse.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(addCourse.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.error = null;
            state.isCreated = true
        })
        .addCase(addCourse.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload.message || 'unkown Error';
        })

        //GetAll Course 
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
            state.error = action.payload.message  || 'server Error';
        })


             //Delete Course
             .addCase(deleteCourse.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isDeleted = true
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message  || 'server Error';
            })

            //Delete Instructor
            .addCase(deleteInstructor.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteInstructor.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isDeleted = true
            })
            .addCase(deleteInstructor.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'server Error';
            })

            //Take Attendance
            .addCase(takeInstructorAttendance.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(takeInstructorAttendance.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isUpdated = true
            })
            .addCase(takeInstructorAttendance.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message  || 'server Error';
            })

            //GetSingle Instructor
            .addCase(getSingleInstructor.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getSingleInstructor.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.instructor = action.payload
            })
            .addCase(getSingleInstructor.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message  || 'server Error';
            })
            //Create Instructors 
            .addCase(addInstructor.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addInstructor.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isCreated = true
            })
            .addCase(addInstructor.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'unkown Error';
            })

            //GetAll Instructors 
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
                state.error = action.payload.message  || 'server Error';
            })

            //update School
            .addCase(updateMySchool.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateMySchool.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isUpdated = true
            })
            .addCase(updateMySchool.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message  || 'server Error';
            })

            //patch School avatar
            .addCase(patchMySchoolAvatar.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(patchMySchoolAvatar.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isPatched = true
            })
            .addCase(patchMySchoolAvatar.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message  || 'server Error';
            })

            //patch School banner
            .addCase(patchMySchoolBanner.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(patchMySchoolBanner.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.isPatched = true
            })
            .addCase(patchMySchoolBanner.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message  || 'server Error';
            })
            //get Single Schools
            .addCase(getMySchool.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getMySchool.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.school = action.payload;
            })
            .addCase(getMySchool.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message  || 'server Error';
            })
    }
})

export default ownerSlice.reducer;
export const Status = (state) => state.owner.status;
export const Error = (state) => state.owner.error;
export const mySchool = (state) => state.owner.school;

export const IsDeleted = (state) => state.owner.isDeleted;
export const IsCreated = (state) => state.owner.isCreated;
export const IsPatched = (state) => state.owner.isPatched;
export const IsUpdated = (state) => state.owner.isUpdated;

export const allInstructors = (state) => state.owner.instructors;
export const singleInstructor = (state) => state.owner.instructor;
export const allRegUsers = (state) => state.owner.regUsers

export const allCourses = (state) => state.owner.courses;
export const singleCourse = (state) => state.owner.course;

export const { clearUpdated, clearPatched, clearDeleted, clearStatus, clearError, clearCreated } = ownerSlice.actions