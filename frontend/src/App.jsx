import { useEffect } from "react";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import './App.css';
import Footer from "./Components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, Navigate } from "react-router-dom";
import ResetPassword from "./Components/ResetPassword";
import { loadUser, loginAuthUser, loginIsAuthenticated } from "./slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import AdminDashboard from "./Components/superAdmin/AdminDashboard";
import AdminHome from "./Components/superAdmin/AdminHome";
import ProtectedRoute from "./routes/ProtectedRoute";
import BottomMenu from "./BottomMenu/BottomMenu";
import DrivingSchools from "./Components/superAdmin/DrivingSchools";
import SingleDrivingSchool from "./Components/superAdmin/SingleDrivingSchool";
import DefaultImage from "./Components/superAdmin/DefaultImage";
import OwnerHome from "./Components/Owner/OwnerHome";
import OwnerDashboard from "./Components/Owner/OwnerDashboard";
import Profile from "./Components/Profile";
import Instructors from "./Components/Owner/Instructors";
import SingleInstructor from "./Components/Owner/SingleInstructor"
import Courses from "./Components/Owner/Courses";
import SingleCourse from "./Components/Owner/SingleCourse";

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    const isAuthenticated = useSelector(loginIsAuthenticated);
    const user = useSelector(loginAuthUser);
    const isAdmin = user?.role === "admin";
    const isOwner = user?.role === "owner";

    return (
        <>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated ?
                         (
                            isAdmin && <Navigate to="/admin/dashboard" /> ||
                            isOwner && <Navigate to="/owner/dashboard" /> 
                        ) 
                         : <Home />}
                />

                {/* Reset Password */}
                <Route path="/password/reset/:token" element={<ResetPassword />} />

                {/* Admin Routes */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute isAdmin={true}>
                            <AdminHome />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="schools" element={<DrivingSchools />} />
                    <Route path="school/:id" element={<SingleDrivingSchool />} />
                    <Route path="default-images" element={<DefaultImage />} />

                </Route>


                {/* Owner Routes */}
                <Route
                    path="/owner/*"
                    element={
                        <ProtectedRoute isOwner={true}>
                            <OwnerHome />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<OwnerDashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="instructors" element={<Instructors />} />
                    <Route path="instructor/:id" element={<SingleInstructor />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="course/:id" element={<SingleCourse />} />

                </Route>
            </Routes>
            <BottomMenu />
            
            {/* Only show footer when the user is not an admin */}
            {!isAdmin && !isOwner && <Footer />}
        </>
    );
}
