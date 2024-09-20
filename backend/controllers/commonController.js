const CatchAsyncError = require('../middlewares/catchAsyncError')
const errorHandler = require('../utils/errorHandler')
const DrivingSchool = require('../models/drivingSchoolModel');
const searchFeatures = require('../utils/searchFeature');
const Instructor = require('../models/instructorModel');
const {Course} = require('../models/courseModel')

// getAll drivingSchool/admin = api/driving-schools
exports.getAllDrivingSchools = CatchAsyncError(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Create an instance of searchFeatures with the initial query
    const query = DrivingSchool.find();
    const search = new searchFeatures(query, req.query);

    // Apply search features: search, time filter, sort, and pagination
    search.search().timeFilter().paginate(page, limit);

    // Execute the query
    const drivingSchools = await search.exec();

    // Populate the results
    const populatedDrivingSchools = await DrivingSchool.populate(drivingSchools, {
        path: 'owner',
        select: 'avatar name email phoneNumber'
    });

    // Add instructors and courses count to each driving school
    const drivingSchoolsWithCounts = populatedDrivingSchools.map(school => {
        return {
            ...school._doc,
        };
    });

    res.status(200).json({
        success: true,
        count: drivingSchoolsWithCounts.length,
        page,
        limit,
        drivingSchools: drivingSchoolsWithCounts
    });
});


// get single drivingSchool/admin = api/admin/driving-school/:id
exports.getDrivingSchoolById = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findById(req.params.id)
        .populate('owner', 'avatar name email phoneNumber');

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found', 404));
    }

    // Fetch related courses and instructors
    const course = await Course.find({ drivingSchool: drivingSchool._id });
    const Instructors = await Instructor.find({ drivingSchool: drivingSchool._id })
        .populate('instructor', 'avatar email name');

    res.status(200).json({
        success: true,
        drivingSchool,
        course,
        Instructors
    });
});

// getAll Instructor = api/instructors
exports.getAllInstructors = CatchAsyncError(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword ? {
        $or: [
            { 'instructor.name': { $regex: req.query.keyword, $options: 'i' } },
            { 'instructor.email': { $regex: req.query.keyword, $options: 'i' } }
        ]
    } : {};

    const instructors = await Instructor.aggregate([
        { 
            $lookup: {
                from: 'users', 
                localField: 'instructor', 
                foreignField: '_id', 
                as: 'instructor'
            }
        },
        { 
            $unwind: '$instructor'
        },
        { 
            $match: keyword
        },
        { 
            $lookup: {
                from: 'courses', 
                localField: 'courses', 
                foreignField: '_id', 
                as: 'courses'
            }
        },
        {
            $lookup: {
                from: 'drivingschools',
                localField: 'drivingSchool',
                foreignField: '_id',
                as: 'drivingSchool'
            }
        },
        {
            $unwind: {
                path: '$drivingSchool',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'drivingSchool.owner',
                foreignField: '_id',
                as: 'drivingSchool.owner'
            }
        },
        {
            $unwind: {
                path: '$drivingSchool.owner',
                preserveNullAndEmptyArrays: true
            }
        },
        { 
            $skip: skip
        },
        { 
            $limit: limit
        }
    ]);

    const total = await Instructor.countDocuments(keyword);

    res.status(200).json({
        success: true,
        count: instructors.length,
        page,
        limit,
        total,
        instructors
    });
});

//Get Instructor by Id api/instructors/:id
exports.getSingleInstructorById = CatchAsyncError(async (req, res, next) => {
    const instructor = await Instructor.findById(req.params.id)
        .populate([
            {
                path: 'courses',
                select: 'title description duration ratings',
            },
            {
                path: 'drivingSchool',
                select: 'drivingSchoolName about location avatar bannerImg',
                populate: {
                    path: 'owner',
                    select: 'avatar name email',
                }
            }
        ]);

    if (!instructor) {
        return next(new ErrorHandler('Instructor not found', 404));
    }

    res.status(200).json({
        success: true,
        instructor
    });
});

//GetAll courses - api/courses
exports.getAllCourses = CatchAsyncError(async (req, res, next) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Create an instance of searchFeatures with the initial query
    const query = Course.find();
    const search = new searchFeatures(query, req.query);

    // Apply search features: search, time filter, sort, and pagination
    search.courseSearch().timeFilter().sort().paginate(page, limit);

    // Execute the query and then apply populate
    const courses = await search.query.populate([
        {
            path: 'instructor',
            select: 'name avatar email',
        },
        {
            path: 'drivingSchool',
            select: 'drivingSchoolName about location avatar bannerImg',
            populate: {
                path: 'owner',
                select: 'avatar name email',
            }
        }
    ]);
    res.status(200).json({
        success: true,
        count: courses.length,
        page,
        limit,
        courses
    });
});

//Get Single course:
exports.getSingleCourse = CatchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    // Find the course by ID and populate nested fields
    let course = await Course.findById(id).populate([
        {
            path: 'instructor',
            select: 'name avatar email',
        },
        {
            path: 'drivingSchool',
            select: 'drivingSchoolName about location avatar bannerImg',
            populate: {
                path: 'owner',
                select: 'avatar name email',
            }
        },
        {
            path: 'reviews',
            select: 'user rating comment',
            populate: {
                path: 'user',
                select: 'avatar name email',
            }
        },
        {path:'learners',
            select: 'learner',
            populate: {
                path: 'learner',
                select: 'avatar name email',
            }
        }
    ]);

    // If no course is found, return an error
    if (!course) {
        return next(new errorHandler('Course not found', 404));
    }

    // Populate vehicles and services only if they exist
    if (course.vehicles && course.vehicles.length > 0) {
        course = await course.populate('vehicles', 'name registrationNumber type lastServiceDate nextServiceDate certificates');
    }

    if (course.services && course.services.length > 0) {
        course = await course.populate('services', 'serviceName serviceType vehicleType description price certificatesIssued');
    }

    res.status(200).json({
        success: true,
        course,
    });
});
