import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { accessRegUsers, allRegUsers, clearUpdated, Error, getAllRegUsers, IsUpdated, Status } from '../../slices/ownerSlice'

const OwnerRegisterUsers = () => {
  const dispatch = useDispatch()
  const AllRegUsers = useSelector(allRegUsers)
  const status = useSelector(Status)
  const error = useSelector(Error)
  const isUpdated = useSelector(IsUpdated)

  useEffect(() => {
    dispatch(getAllRegUsers())
    if(isUpdated){
      dispatch(clearUpdated())
    }
  }, [dispatch,isUpdated])

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((_, index) => (
        <div key={index} className="flex justify-between items-center p-4 bg-gray-200 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="w-48 h-4 bg-gray-300 rounded"></div>
          <div className="space-x-2">
            <div className="w-16 h-8 bg-gray-300 rounded"></div>
            <div className="w-16 h-8 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )

  // Placeholder functions for approve/reject actions
const handleApprove = (userId) => {
  dispatch(accessRegUsers({id:userId, status:"Approved"}))
}

const handleReject = (userId) => {
  dispatch(accessRegUsers({id:userId, status:"Rejected"}))
}

  return (
    <div>
      <h1 className='text-xl mt-2 font-semibold'>Registered Users</h1>

      {/* Loading Skeleton */}
      {status === 'loading' && <SkeletonLoader />}

      {/* Show Error if occurs */}
      {status === 'failed' && (
        <div className="text-red-600 text-sm">
          <p>Error: {error || 'An error occurred while fetching the data.'}</p>
        </div>
      )}

      {/* Render Users Table only if there are users */}
      {status === 'succeeded' && AllRegUsers?.length > 0 ? (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">User Details</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Course Details</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {AllRegUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {/* User Details */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        src={user.learner.avatar}
                        alt={user.learner.name}
                      />
                      <div>
                        <p className="font-medium text-gray-800">{user.learner.name}</p>
                        <p className="text-sm text-gray-500">{user.learner.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Course Details */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-800">{user.course.title}</p>
                      <p className="text-sm text-gray-600">{user.course.description.slice(0,20)}</p>
                      <p className="text-sm text-gray-500">Duration: {user.course.duration} month(s)</p>
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-6 py-4 text-center">
                   {user.status === "Pending" ? <div className="flex justify-center space-x-2">
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600"
                        onClick={() => handleApprove(user._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => handleReject(user._id)}
                      >
                        Reject
                      </button>
                    </div>
                  :
                    user.status === "Approved" ?
                    <span  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded ">
                      Approved
                      </span>
                      :
                      user.status === "Rejected" ?
                      <span  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded ">
                        Rejected
                        </span> : ''
                  }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Handle case where no registered users exist
        status === 'succeeded' && <p className="text-gray-600">No registered users found.</p>
      )}
    </div>
  )
}



export default OwnerRegisterUsers
