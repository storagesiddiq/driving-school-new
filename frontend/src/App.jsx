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
import Services from "./Components/Owner/Services";
import Vehicle from "./Components/Owner/Vehicle";
import RegisterUsers from "./Components/Instructors/RegisterUsers";
import CommonSingleCourse from "./Components/CommonSingleCourse";
import Sessions from "./Components/Instructors/Sessions";
import Report from "./Components/Instructors/Report";
import ChatPage from "./Components/Chat/ChatPage";
import LHome from "./Components/Learner/LHome";
import CoursesPage from "./Components/Learner/CoursePage";
import CommonSingleInstructor from "./Components/CommonSingleInstructor";
import SchoolsPage from "./Components/Learner/SchoolsPage";
import SingleSchoolPage from "./Components/Learner/SingleSchoolPage";
import InstructorsPage from "./Components/Learner/InstructorsPage";
import OwnerRegisterUsers from "./Components/Owner/OwnerRegisterUsers";
import InstHome from './Components/Instructors/InstHome'

export default function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    const isAuthenticated = useSelector(loginIsAuthenticated);
    const user = useSelector(loginAuthUser);
    const isAdmin = user?.role === "admin";
    const isOwner = user?.role === "owner";
    const isInst = user?.role === "instructor";
    const isLearner = user?.role === "learner";

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={isAuthenticated ?
                    (
                        isAdmin && <Navigate to="/admin/dashboard" /> ||
                        isOwner && <Navigate to="/owner/dashboard" /> ||
                        isInst && <Navigate to="/instructor/home" /> ||
                        isLearner && <Navigate to="/home" /> 
                    )
                    : <Home />}
                />

                {/* Reset Password */}
                <Route path="/password/reset/:token" element={<ResetPassword />} />
                <Route path="/course/:id" element={<CommonSingleCourse />} />
                <Route path="/instrcutor/:id" element={<CommonSingleInstructor />} />
                <Route path="/chat-page" element={<ChatPage />} />

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
                <Route path="/owner/*" element={
                    <ProtectedRoute isOwner={true}>
                        <OwnerHome />
                    </ProtectedRoute>
                }
                >
                    <Route path="dashboard" element={<OwnerDashboard />} />
                    <Route path="registered-users" element={<OwnerRegisterUsers />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="instructors" element={<Instructors />} />
                    <Route path="instructor/:id" element={<SingleInstructor />} />
                    <Route path="courses" element={<Courses />} />
                    <Route path="course/:id" element={<SingleCourse />} />
                    <Route path="services" element={<Services />} />
                    <Route path="vehicles" element={<Vehicle />} />
                </Route>

                {/* Instructor Routes */}
                <Route path="/instructor/home" element={<ProtectedRoute isInst={true}><InstHome /></ProtectedRoute>} />
                <Route path="/instructor/profile" element={<ProtectedRoute isInst={true}><Profile /></ProtectedRoute>} />
                <Route path="/instructor/sessions" element={<ProtectedRoute isInst={true}><RegisterUsers /></ProtectedRoute>} />
                <Route path="/instructor/attendance" element={<ProtectedRoute isInst={true}><Sessions /></ProtectedRoute>} />
                <Route path="/instructor/report" element={<ProtectedRoute isInst={true}><Report /></ProtectedRoute>} />



                {/* Learner Routes */}
                <Route path="/home" element={<ProtectedRoute isLearner={true}><LHome /></ProtectedRoute>} />
                <Route path="/courses" element={<ProtectedRoute isLearner={true}><CoursesPage /></ProtectedRoute>} />
                <Route path="/schools" element={<ProtectedRoute isLearner={true}><SchoolsPage /></ProtectedRoute>} />
                <Route path="/school/:id" element={<ProtectedRoute isLearner={true}><SingleSchoolPage /></ProtectedRoute>} />
                <Route path="/instructors" element={<ProtectedRoute isLearner={true}><InstructorsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute isLearner={true}><Profile /></ProtectedRoute>} />

                

                <Route path="*" element={isAuthenticated ?
                    (
                        isAdmin && <Navigate to="/admin/dashboard" /> ||
                        isOwner && <Navigate to="/owner/dashboard" /> ||
                        isInst && <Navigate to="/instructor/home" />  ||
                        isLearner && <Navigate to="/home" /> 
                    )
                    : <Home />} />

            </Routes>
            <BottomMenu />

            {/* Only show footer when the user is not an admin */}
            {!isAdmin && !isOwner && !isInst && <Footer />}
        </>
    );
}
