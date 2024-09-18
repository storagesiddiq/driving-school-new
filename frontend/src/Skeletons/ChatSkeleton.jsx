import React from 'react'

const ChatSkeleton = () => {
    return (
        <div className='w-full px-3'>
            <div className='flex flex-col items-end justify-end'>
                <div class="h-7 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                <div class="w-40 h-7 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className='flex flex-col items-start justify-end'>
                <div class="h-7 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                <div class="w-40 h-7 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className='flex flex-col items-end justify-end'>
                <div class="h-7 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                <div class="w-40 h-7 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className='flex flex-col items-start justify-end'>
                <div class="h-7 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                <div class="w-40 h-7 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className='flex flex-col items-end justify-end'>
                <div class="h-7 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                <div class="w-40 h-7 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className='flex flex-col items-start justify-end'>
                <div class="h-7 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                <div class="w-40 h-7 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div className='flex flex-col items-end justify-end'>
                <div class="h-7 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                <div class="w-40 h-7 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
        </div>
    )
}

export default ChatSkeleton