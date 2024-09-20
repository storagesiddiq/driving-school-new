import React from 'react'
import BottomMenuItems from './BottomMenuItems'
import { GoHomeFill } from "react-icons/go";
import './BottomMenu.css'
import { GoHome } from "react-icons/go";
import { useSelector } from 'react-redux';
import { FaRegUserCircle } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { loginAuthUser, loginIsAuthenticated } from '../slices/authSlice';
import { RiSchoolLine, RiSchoolFill  } from "react-icons/ri";
import { CiImageOn } from "react-icons/ci";
import { FaImage } from "react-icons/fa6";
import { RiGraduationCapFill } from "react-icons/ri";
import { LuGraduationCap } from "react-icons/lu";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { MdOutlineDirectionsCar } from "react-icons/md";
import { FaCar } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline, IoChatbubbleEllipses  } from "react-icons/io5";
import { PiChalkboardTeacherLight , PiChalkboardTeacherFill } from "react-icons/pi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { TbReportAnalytics } from "react-icons/tb";

const BottomMenu = () => {
    const LoginIsAuthenticated = useSelector(loginIsAuthenticated);
    const user = useSelector(loginAuthUser);

    return (
        <>
            {LoginIsAuthenticated &&

                <div className='lg:hidden'>
                    <div className='bottomMenu '>
                        <ul id='menu' className='p-0 px-2 m-0'>
                          {  (user?.role === "user") &&
                            <>
                                <BottomMenuItems link={'/'} icon={GoHome} iconActive={GoHomeFill} title="HOME" />
                                <BottomMenuItems link={'/profile-settings'} icon={FaRegUserCircle} iconActive={FaUserCircle} title="PROFILE" />
                            </> }

                           { (user?.role === "admin") &&
                            <div className='w-full flex justify-between' style={{ overflow: 'auto', scrollbarWidth: 'none' }}>
                                <BottomMenuItems isAdmin={true} link={'/admin/dashboard'} icon={MdOutlineDashboard} iconActive={MdDashboard} title="DASHBOARD" />
                                <BottomMenuItems isAdmin={true} link={'/admin/schools'} icon={RiSchoolLine} iconActive={RiSchoolFill} title="SCHOOLS" />
                                <BottomMenuItems isAdmin={true} link={'/admin/default-images'} icon={CiImageOn} iconActive={FaImage} title="IMAGES" />
                            </div>}

                            { (user?.role === "owner") &&
                            <div className='w-full flex justify-between' style={{ overflow: 'auto', scrollbarWidth: 'none' }}>
                                <BottomMenuItems isAdmin={true} link={'/owner/dashboard'} icon={RiSchoolLine} iconActive={RiSchoolFill} title="SCHOOL" />
                                <BottomMenuItems isAdmin={true} link={'/owner/registered-users'} icon={FaRegUserCircle} iconActive={FaUserCircle} title="REGISTERED" />
                                <BottomMenuItems isAdmin={true} link={'/owner/instructors'} icon={FaRegUserCircle} iconActive={FaUserCircle} title="INSTRUCTORS" />
                                <BottomMenuItems isAdmin={true} link={'/owner/courses'} icon={LuGraduationCap} iconActive={RiGraduationCapFill} title="COURSES" />
                                <BottomMenuItems isAdmin={true} link={'/owner/services'} icon={MdOutlineMiscellaneousServices} iconActive={MdOutlineMiscellaneousServices} title="SERVICES" />
                                <BottomMenuItems isAdmin={true} link={'/owner/vehicles'} icon={MdOutlineDirectionsCar} iconActive={FaCar} title="VEHICLES" />
                                <BottomMenuItems isAdmin={true} link={'/owner/profile'} icon={FaRegUserCircle} iconActive={FaUserCircle} title="PROFILE" />

                            </div>}

                            { (user?.role === "instructor") &&
                            <div className='w-full flex justify-between' style={{ overflow: 'auto', scrollbarWidth: 'none' }}>
                                <BottomMenuItems isAdmin={true} link={'/instructor/home'} icon={GoHome} iconActive={GoHomeFill} title="HOME" />
                                <BottomMenuItems isAdmin={true} link={'/chat-page'} icon={IoChatbubbleEllipsesOutline} iconActive={IoChatbubbleEllipses} title="REPORT" />
                                <BottomMenuItems isAdmin={true} link={'/instructor/sessions'} icon={PiChalkboardTeacherLight} iconActive={PiChalkboardTeacherFill } title="SESSION" />
                                <BottomMenuItems isAdmin={true} link={'/instructor/attendance'} icon={FaRegCalendarAlt} iconActive={FaRegCalendarAlt} title="ATTENDANCE" />
                                <BottomMenuItems isAdmin={true} link={'/instructor/report'} icon={TbReportAnalytics} iconActive={TbReportAnalytics} title="REPORT" />
                        
                                <BottomMenuItems isAdmin={true} link={'/instructor/profile'} icon={FaRegUserCircle} iconActive={FaUserCircle} title="PROFILE" />


                            </div>}
                        </ul>
                    </div>
                </div>
            }
        </>
    )
}

export default BottomMenu