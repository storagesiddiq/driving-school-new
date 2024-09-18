// src/App.jsx
import React from "react";

const drivingSchools = [
  {
    id: 1,
    name: "Speedy Drive School",
    courses: ["Beginner's Driving", "Advanced Driving", "Defensive Driving"],
    services: ["Car Rentals", "Test Preparation", "Driving Theory Classes"],
  },
  {
    id: 2,
    name: "Elite Driving Academy",
    courses: ["Teen Driving", "Adult Driving", "Night Driving"],
    services: ["License Test Help", "Online Classes", "Refresher Lessons"],
  },
  {
    id: 3,
    name: "Safe Wheels Driving School",
    courses: ["Automatic Transmission", "Manual Transmission", "Highway Driving"],
    services: ["One-on-One Instruction", "Car Inspection", "Vehicle Insurance Guidance"],
  },
];

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Welcome to Our Driving School 
      </h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {drivingSchools.map((school) => (
          <div
            key={school.id}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >

            <h2 className="text-xl font-semibold text-gray-800">{school.name}</h2>
            <h3 className="text-lg font-medium text-gray-600 mt-4">Courses Offered:</h3>
            <ul className="list-disc ml-4 mt-2">
              {school.courses.map((course, index) => (
                <li key={index} className="text-gray-700">
                  {course}
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-medium text-gray-600 mt-4">Services:</h3>
            <ul className="list-disc ml-4 mt-2">
              {school.services.map((service, index) => (
                <li key={index} className="text-gray-700">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default App;
