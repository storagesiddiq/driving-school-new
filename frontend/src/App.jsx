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

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    const isAuthenticated = useSelector(loginIsAuthenticated);
    const user = useSelector(loginAuthUser);
    const isAdmin = user?.role === "admin";

    return (
        <>
            <Navbar />
            <Routes>
                {/* Route to the correct home page based on authentication and user role */}
                <Route
                    path="/"
                    element={isAuthenticated ? (isAdmin && <Navigate to="/admin/dashboard" />) : <Home />}
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

                </Route>

    
            </Routes>

            <BottomMenu />

            {/* Only show footer when the user is not an admin */}
            {!isAdmin && <Footer />}
        </>
    );
}
