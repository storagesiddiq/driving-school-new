import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { analyticsData, Error, getAnalytics, Status } from '../../slices/adminSlice';
import { LuSchool } from "react-icons/lu";
import { FaUserGraduate, FaUserTie } from "react-icons/fa";
import { MdPersonOutline } from "react-icons/md";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const AnalyticsData = useSelector(analyticsData);
  const status = useSelector(Status);
  const error = useSelector(Error);


  useEffect(() => {
    dispatch(getAnalytics());
  }, [dispatch]);

  // Array to store the data for each card
  const dashboardData = [
    {
      id: 1,
      title: "Total Schools",
      value: AnalyticsData.totalSchools,
      icon: <LuSchool size={40} className="text-purple-500" />,
      color: "purple-500",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-500"
    },
    {
      id: 2,
      title: "Total Learners",
      value: AnalyticsData.totalLearners,
      icon: <FaUserGraduate size={40} className="text-blue-500" />,
      color: "blue-500",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-500"
    },
    {
      id: 3,
      title: "Active Learners",
      value: AnalyticsData.activeLearners,
      icon: <MdPersonOutline size={40} className="text-green-500" />,
      color: "green-500",
      bgColor: "bg-green-100",
      borderColor: "border-green-500"
    },
    {
      id: 4,
      title: "Total Instructors",
      value: AnalyticsData.totalInstructors,
      icon: <FaUserTie size={40} className="text-orange-500" />,
      color: "orange-500",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-500"
    },
  ];

  // Skeleton Loader Component
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 animate-pulse">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200"></div>
          <div className="flex flex-col gap-1 justify-start ml-6">
            <div className="h-6 bg-gray-200 rounded w-36"></div>
            <div className="h-10 bg-gray-200 rounded w-24 mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="p-8 bg-gray-100 min-h-50">
        <h2 className="text-3xl font-bold text-gray-700 text-center mb-10">Admin Dashboard</h2>

        {status === "loading" ? (
          // Show Skeletons while loading
          renderSkeleton()
        ) :
          status === "failed" ? error :
            (status === "succeeded" && AnalyticsData) && (
              // Map through the dashboardData array to generate each card
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {dashboardData.map((data) => (
                  <div key={data.id} className="flex items-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full ${data.bgColor} border-2 ${data.borderColor}`}>
                      {data.icon}
                    </div>
                    <div className="flex flex-col gap-1 justify-start ml-6">
                      <h3 className="text-xl font-semibold text-gray-700">{data.title}</h3>
                      <p className={`mt-2 text-4xl font-bold text-${data.color}`}>{data.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
      </div>
    </div>
  );
};

export default AdminDashboard;
