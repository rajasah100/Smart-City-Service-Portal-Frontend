import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import complaintReducer from "./slices/complaintSlice";
import departmentReducer from "./slices/departmentSlice"
import userReducer from "./slices/userSlice"
import noticeReducer from "./slices/noticeSlice"
import emergencyServiceReducer from "./slices/emergencyServiceSlice"
import notificationReducer from "./slices/notificationSlice"
import departmentNotificationReducer from "./slices/departmentNotificationSlice"
import aiReducer from "./slices/aiSlice";
import eventReducer from "./slices/eventSlice"
import settingReducer from "./slices/settingSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        complaint: complaintReducer,
        department: departmentReducer,
        user: userReducer,
        notice: noticeReducer,
        emergencyService: emergencyServiceReducer,
        notification: notificationReducer,
        departmentNotification: departmentNotificationReducer,
        ai: aiReducer,
        event: eventReducer,
        setting: settingReducer,

    },
})

export default store;