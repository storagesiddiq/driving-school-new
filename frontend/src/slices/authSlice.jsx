import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../API";

// Login user
export const loginUser = createAsyncThunk('auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        console.log(email, password)
        try {
            const response = await API.post('/login', {
                email, password
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Authentication Failed');
        }
    }
);

//Register user
export const registerUser = createAsyncThunk('auth/registerUser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await API.post('/register', formData);
            return response.data;
        } catch (error) {
            console.error('Error registering user:', error.response?.data?.message || error.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message || 'Authentication Failed');
        }
    }
);
//Google Register user
export const googleSignIn = createAsyncThunk('auth/googleSignIn',
    async (_, { rejectWithValue }) => {
      try {
        const response = await API.get(`/auth/google`);
        
        // If authentication is successful, return the response data
        if (response && response.data.success) {
          return response.data;
        } else {
          throw new Error('Invalid response from the server.');
        }
      } catch (error) {
        // If error, return rejectWithValue
        return rejectWithValue(
          error.response && error.response.data
            ? error.response.data
            : 'An error occurred during Google sign-in.'
        );
      }
    }
  );

//Load user
export const loadUser = createAsyncThunk('auth/loadUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/myprofile');
            return response.data; // Assuming response.data is an object with user details
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//logout user
export const logoutUser = createAsyncThunk('auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/logout');
            // Clear all cookies related to your application
            const cookies = document.cookie.split('; ');
            for (let cookie of cookies) {
                const [name] = cookie.split('=');
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }

            return response.data; // Assuming response.data is an object with user details
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//Edit profile by user
export const editUser = createAsyncThunk('auth/editUser',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await API.put('/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data; // Assuming response.data is an object with user details
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);


//forgot password request 
export const forgotPassword = createAsyncThunk('auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            console.log({ email })
            const response = await API.post('/password/forgot', { email });
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//reset password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ password, confirmPassword, token }, { rejectWithValue }) => {
        try {

            const response = await API.post(`/password/reset/${token}`, { password, confirmPassword });

            return response.data;
        } catch (error) {
            console.error('Error resetting password:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
        }
    }
);

//AllUsers:
export const allUsers = createAsyncThunk('auth/allUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/getCommonUsers');
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//getSingleUser:
export const getSingleUser = createAsyncThunk('auth/getSingleUser',
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.get(`/user/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//update Avatar PATCH:
export const updateAvatar = createAsyncThunk('auth/updateAvatar',
    async (avatarData, { rejectWithValue }) => {
        try {
            const response = await API.patch('/update-avatar', avatarData, {
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

//AllUsers:
export const allUsersByInstructor = createAsyncThunk('auth/allUsersByInstructor',
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.get('/users-by-instructor');
            console.log(response.data)
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

//AllInstructors by Learner:
export const fetchMatchedUsers = createAsyncThunk('auth/fetchMatchedUsers',
    async ({keyword}, { rejectWithValue }) => {
        try {
            let link = '/matched-users';

            if (keyword !== null && keyword !== undefined && keyword !== '') {
                link += `?keyword=${keyword}`
            }
    
            const response = await API.get(link);
            console.log(response.data) 
            return response.data;
        } catch (error) {
            console.error('Error loading user:', error.response?.data?.message || 'Unknown error');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        status: 'idle',
        error: null,
        user: null,
        passwordReset: false,
        allUsers: [],
        matchedUsers: [],
        singleUser: null,
        allUsersByAdmin: [],
        maleUsersByAdmin: [],
        femaleUsersByAdmin: [],
        isDeleted: false
    },
    reducers: {
        clearDeleted(state, action) {
            return {
                ...state,
                isDeleted: false
            }
        },
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
        clearPasswordReseted(state, action) {
            return {
                ...state,
                passwordReset: false
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

          //allLEarnersBy instructor
          .addCase(fetchMatchedUsers.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(fetchMatchedUsers.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.error = null;
            state.matchedUsers = action.payload.users;
        })
        .addCase(fetchMatchedUsers.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload.message || 'Authentication failed';
        })

            //update avatar PATCH
            .addCase(updateAvatar.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.isAuthenticated = true;
                state.isUpdated = false
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.error = null;
                state.user = action.payload.user;
                state.isUpdated = true
            })
            .addCase(updateAvatar.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            //singleUser
            .addCase(getSingleUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getSingleUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.singleUser = action.payload.user;
            })
            .addCase(getSingleUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Authentication failed';
            })

            //allusers
            .addCase(allUsers.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(allUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.allUsers = action.payload.users;
            })
            .addCase(allUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Authentication failed';
            })


            //login
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.isAuthenticated = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.error = null;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Authentication failed';
                state.isAuthenticated = false;
            })

            //Google register
            .addCase(googleSignIn.pending, (state) => {
                state.loading = 'loading';
                state.error = null;
              })
              .addCase(googleSignIn.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                state.user = action.payload;
                state.isAuthenticated = true;
              })
              .addCase(googleSignIn.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload.message;
              })

            //register
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.isAuthenticated = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.error = null;
                state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Registration failed';
                state.isAuthenticated = false;
            })

            //load users
            .addCase(loadUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.isAuthenticated = false;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.error = null;
                state.user = action.payload.user;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = null;
                state.isAuthenticated = false;
            })


            //logout users
            .addCase(logoutUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = false;
                state.error = null;
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
                state.isAuthenticated = false;
            })

            //update profile 
            .addCase(editUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
                state.isAuthenticated = true;
                state.isUpdated = false
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.error = null;
                state.user = action.payload.user;
                state.isUpdated = true
            })
            .addCase(editUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
                state.isAuthenticated = false;
            })


            //forgot password request  
            .addCase(forgotPassword.pending, (state) => {
                state.status = 'loading';
                state.message = null;

            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })

            //reset password request  
            .addCase(resetPassword.pending, (state) => {
                state.status = 'loading';

            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.passwordReset = true
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            });


    }
});

export const loginIsAuthenticated = (state) => state.auth.isAuthenticated;
export const loginAuthStatus = (state) => state.auth.status;
export const loginAuthError = (state) => state.auth.error;
export const loginAuthUser = (state) => state.auth.user;

export const isUpdated = (state) => state.auth.isUpdated;
export const getAllUsers = (state) => state.auth.allUsers;
export const GetSingleUser = (state) => state.auth.singleUser;
export const getMatchedUsers = (state) => state.auth.matchedUsers;


//Admin
export const FemaleUsersByAdmin = (state) => state.auth.femaleUsersByAdmin;
export const MaleUsersByAdmin = (state) => state.auth.maleUsersByAdmin;
export const AllUsersByAdmin = (state) => state.auth.allUsersByAdmin;
export const IsDeleted = (state) => state.auth.isDeleted;


export default authSlice.reducer;

// forgot password 
export const Message = (state) => state.auth.message;

//Password Resetted
export const passwordResetted = (state) => state.auth.passwordReset;

//Exporting reducer
export const {clearDeleted, clearStatus, clearPasswordReseted, clearError, clearUpdated } = authSlice.actions