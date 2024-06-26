import { createSlice } from '@reduxjs/toolkit';
import {
  loginUser,
  registerUser,
  clearError,
  changePassword,
  getSecretKey,
  updateSecretKey,
  toggle2FA,
  getMe,
  updateMe,
  LoginWith2FA,
  forgotPassword,
  verifyOtpForgotPassword,
  resetPassword,
} from '~/apiService/authService';
import { addOrUpdateFieldInLocalStorage, getLocalStorageItem } from '~/utils/localStorage';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    user: getLocalStorageItem('user') || null,
    error: null,
    isLogin: getLocalStorageItem('user') ? true : null,
    status: null,
    secretKey: '',
    message: '',
    isUpdate: false,
  },

  reducers: {
    reFreshStatus: (state) => {
      state.status = null;
      state.secretStatus = null;
    },
  },

  // update secret key

  extraReducers: (builder) => {
    builder

      //reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.secretKey = action.payload.data.secret;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })

      //verify Otp ForgotPassword
      .addCase(verifyOtpForgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpForgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.secretKey = action.payload.data.secret;
        state.message = action.payload.message;
      })
      .addCase(verifyOtpForgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })

      // forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.secretKey = action.payload.data.secret;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })

      // login with 2fa
      .addCase(LoginWith2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginWith2FA.fulfilled, (state, action) => {
        state.loading = false;
        state.secretKey = action.payload.data.secret;
        state.message = action.payload.message;
      })
      .addCase(LoginWith2FA.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })

      // toggle 2FA
      .addCase(toggle2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggle2FA.fulfilled, (state, action) => {
        state.loading = false;
        state.secretKey = action.payload.data.secret;
        state.message = action.payload.message;
      })
      .addCase(toggle2FA.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })

      // update secret key
      .addCase(updateSecretKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSecretKey.fulfilled, (state, action) => {
        state.loading = false;
        state.secretKey = action.payload.data.secret;
        state.message = action.payload.message;
      })
      .addCase(updateSecretKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // get secret key
      .addCase(getSecretKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSecretKey.fulfilled, (state, action) => {
        state.loading = false;
        state.secretKey = action.payload.data.secret;
        state.message = action.payload.message;
      })
      .addCase(getSecretKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // get me
      .addCase(getMe.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.isUpdate = false;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.code;
      })

      // update me
      .addCase(updateMe.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isUpdate = false;
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        addOrUpdateFieldInLocalStorage('user', null, action.payload.data);
        state.isUpdate = true;
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isUpdate = false;
      })

      // change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.code;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.status = action.payload.code;
        state.message = action.payload.message;
      })

      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
        state.isLogin = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.code === 200 ? action.payload.data.user : null;
        state.error = null;
        state.isLogin = action.payload.code === 200 ? true : false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload.message;
        state.isLogin = null;
      })

      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
        state.isLogin = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
        state.isLogin = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.error.message;
        state.isLogin = null;
      })
      .addCase(clearError.fulfilled, (state) => {
        state.error = null;
      });
  },
});

export const { reFreshStatus } = authSlice.actions;
export default authSlice.reducer;
