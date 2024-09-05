const CatchAsyncError = require('../middlewares/catchAsyncError')
const errorHandler = require('../utils/errorHandler')
const User = require('../models/UserModel');
const { generateRandomPassword } = require('../utils/generateRandomPassword');
const DrivingSchool = require('../models/drivingSchoolModel');
const sendEmail = require('../utils/email')
const Vehicle = require('../models/vehicleModel');
const Service = require('../models/serviceModel');
const Review = require('../models/reviewModel');
const {registerLearner} = require('../models/courseModel');
const {Session} = require('../models/courseModel');
const {Course} = require('../models/courseModel');
const {
    getActiveLearners,
    getTotalLearners,
    getTotalInstructors,
    getTotalSchools
} = require('../utils/superAdminAnalytics'); 
const path = require('path')
const fs = require('fs');

// create drivingSchool/admin = api/admin/driving-school
exports.createDrivingSchool = CatchAsyncError(async (req, res, next) => {
    const { name, email, phoneNumber, drivingSchoolName } = req.body;

    // Generate a random password
    const password = generateRandomPassword();

    try {
        const owner = await User.create({
            name,
            email,
            password,
            phoneNumber,
            role: 'owner',  // Set the role as 'owner'
        });

        const drivingSchool = await DrivingSchool.create({
            owner: owner._id,
            drivingSchoolName,
        });

        console.log(password);

        if (drivingSchool) {
            const message = `
            Dear ${name},

            Congratulations! Your driving school "${drivingSchoolName}" has been successfully created.

            You can now log in with the following credentials:

            Email: ${email}
            Password: ${password}

            Please keep this information secure. You can change your password after logging in for the first time.

            Best regards,
            The Driving School Team
        `;

            await sendEmail({
                email: email,
                subject: `Your ${drivingSchoolName} Driving School Created Successfully!`,
                message,
            });
        }

        res.status(201).json({
            success: true,
            message: 'Owner and driving school created successfully. An email with login details has been sent.',
            owner,
            drivingSchool,
        });
    }
    catch (err) {
        return next(err);
    }
});

// getAll drivingSchool/admin = api/admin/driving-school
exports.getAllDrivingSchools = CatchAsyncError(async (req, res, next) => {
    const drivingSchools = await DrivingSchool.find()
        .populate('owner', 'avatar name email phoneNumber');

    // Add instructors and courses count to each driving school
    const drivingSchoolsWithCounts = drivingSchools.map(school => {
        return {
            ...school._doc, 
            instructorCount: school.instructors.length, 
            courseCount: school.courses.length 
        };
    });

    res.status(200).json({
        success: true,
        count: drivingSchools.length,
        drivingSchools: drivingSchoolsWithCounts 
    });
});


// get single drivingSchool/admin = api/admin/driving-school/:id
exports.getDrivingSchoolById = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findById(req.params.id)
        .populate('owner', 'avatar name email phoneNumber')
        .populate('instructors', 'avatar name email phoneNumber')
        .populate({
            path: 'courses',
            populate: [
                {
                    path: 'vechicles',
                    select: 'name availability' // Adjust this according to your Vehicle schema
                },
                {
                    path: 'services',
                    select: 'serviceName serviceType vehicleType price' // Adjust this according to your Service schema
                },
                {
                    path: 'instructor',
                    select: 'avatar name email phoneNumber'
                },
                {
                    path: 'reviews',
                    select: 'rating' // Adjust this according to your Review schema
                },
                {
                    path: 'learners',
                    populate: {
                        path: 'learner',
                        select: 'avatar name email phoneNumber'
                    }
                },
                {
                    path: 'sessions',
                    populate: [
                        {
                            path: 'learner',
                            select: 'avatar name email phoneNumber'
                        },
                        {
                            path: 'instructor',
                            select: 'avatar name email phoneNumber'
                        }
                    ]
                }
            ]
        });

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found', 404));
    }

    res.status(200).json({
        success: true,
        drivingSchool
    });
});

//delete  drivingSchool/admin = api/admin/driving-school/:id
exports.deleteDrivingSchool = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findById(req.params.id)
        .populate({
            path: 'courses',
            populate: [
                'vechicles',
                'services',
                'reviews',
                {
                    path: 'learners',
                    populate: 'learner'
                },
                {
                    path: 'sessions',
                    populate: ['learner', 'instructor']
                }
            ]
        })
        .populate('instructors')
        .populate('owner');

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found', 404));
    }

    // Delete associated courses
    for (const course of drivingSchool.courses) {
        await Vehicle.deleteMany({ _id: { $in: course.vechicles } });
        await Service.deleteMany({ _id: { $in: course.services } });
        await Review.deleteMany({ _id: { $in: course.reviews } });
        await registerLearner.deleteMany({ _id: { $in: course.learners.map(learner => learner._id) } });
        await Session.deleteMany({ _id: { $in: course.sessions.map(session => session._id) } });
        await Course.findByIdAndDelete(course._id);
    }

    // Delete associated instructors
    await User.deleteMany({ _id: { $in: drivingSchool.instructors } });

    // Delete associated owner
    await User.findByIdAndDelete(drivingSchool.owner);

    // Delete the driving school user and driving school
    await drivingSchool.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Driving School and associated data deleted successfully'
    });
});

//get Analytics = api/admin/super-admin-analytics
// Super Admin Dashboard Controller
exports.superAdminDashboard = CatchAsyncError(async (req, res, next) => {
    try {
        // Call the analytics functions and store their results in variables with different names
        const [
            activeLearners,
            totalLearners,
            totalInstructors,
            totalSchools
        ] = await Promise.all([
            getActiveLearners(),
            getTotalLearners(),
            getTotalInstructors(),
            getTotalSchools()
        ]);

        // Return the data in the response
        res.status(200).json({
            success: true,
            data: {
                activeLearners,
                totalLearners,
                totalInstructors,
                totalSchools
            }
        });
        
    } catch (error) {
        return next(error);
    }
});

//put defaultAvatar from admin = api/defualt-avatar
exports.updateDefaultAvatar = CatchAsyncError(async (req, res) => {
    if (req.file) {
        const uploadDir = path.join(__dirname, '../uploads/defaultAvatar');
        const newFileName = 'Avatar' + path.extname(req.file.originalname);
        const newFilePath = path.join(uploadDir, newFileName);

        try {
            // Ensure the upload directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filesInDir = fs.readdirSync(uploadDir);
            const oldFilePath = filesInDir.length > 0 ? path.join(uploadDir, filesInDir[0]) : null;

            // Handle the case where no old file exists
            if (oldFilePath === null) {
                // Move the new file to the directory
                fs.renameSync(req.file.path, newFilePath);
            } else {
                // Get the old file extension
                const oldExtension = path.extname(filesInDir[0]);

                // Only proceed if the new extension differs from the old one
                if (path.extname(req.file.originalname) !== oldExtension) {
                    // Delete the old file
                    fs.unlinkSync(oldFilePath);

                    // Move the new file to the directory
                    fs.renameSync(req.file.path, newFilePath);

                    // Update banner images in the database
                    const oldBannerUrl = `${req.protocol}://${req.get('host')}/uploads/defaultAvatar/Avatar${oldExtension}`;
                    const newBannerUrl = `${req.protocol}://${req.get('host')}/uploads/defaultAvatar/Avatar${path.extname(req.file.originalname)}`;

                    await DrivingSchool.updateMany(
                        { avatar: oldBannerUrl },
                        { avatar: newBannerUrl }
                    );

                    await User.updateMany(
                        { avatar: oldBannerUrl },
                        { avatar: newBannerUrl }
                    );

                    res.status(200).json({
                        success: true,
                        message: 'Default Avatar updated successfully with extension change',
                        imageUrl: newBannerUrl
                    });
                } else {
                    // If extensions are the same, replace the file without renaming
                    fs.renameSync(req.file.path, newFilePath);

                    res.status(200).json({
                        success: true,
                        message: 'Default Avatar updated successfully without extension change',
                        imageUrl: `${req.protocol}://${req.get('host')}/uploads/defaultAvatar/Avatar${path.extname(req.file.originalname)}`
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating default Avatar',
                error: error.message
            });
        }
    } else {
        res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }
});

//put defaultBanner from admin = api/defualt-banner
exports.updateDefaultBanner = CatchAsyncError(async (req, res) => {
    if (req.file) {
        const uploadDir = path.join(__dirname, '../uploads/defaultBanner');
        const newFileName = 'Banner' + path.extname(req.file.originalname);
        const newFilePath = path.join(uploadDir, newFileName);

        try {
            // Ensure the upload directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filesInDir = fs.readdirSync(uploadDir);
            const oldFilePath = filesInDir.length > 0 ? path.join(uploadDir, filesInDir[0]) : null;

            // Handle the case where no old file exists
            if (oldFilePath === null) {
                // Move the new file to the directory
                fs.renameSync(req.file.path, newFilePath);
            } else {
                // Get the old file extension
                const oldExtension = path.extname(filesInDir[0]);

                // Only proceed if the new extension differs from the old one
                if (path.extname(req.file.originalname) !== oldExtension) {
                    // Delete the old file
                    fs.unlinkSync(oldFilePath);

                    // Move the new file to the directory
                    fs.renameSync(req.file.path, newFilePath);

                    // Update banner images in the database
                    const oldBannerUrl = `${req.protocol}://${req.get('host')}/uploads/defaultBanner/Banner${oldExtension}`;
                    const newBannerUrl = `${req.protocol}://${req.get('host')}/uploads/defaultBanner/Banner${path.extname(req.file.originalname)}`;

                    await DrivingSchool.updateMany(
                        { bannerImg: oldBannerUrl },
                        { bannerImg: newBannerUrl }
                    );

                    res.status(200).json({
                        success: true,
                        message: 'Default banner updated successfully with extension change',
                        imageUrl: newBannerUrl
                    });
                } else {
                    // If extensions are the same, replace the file without renaming
                    fs.renameSync(req.file.path, newFilePath);

                    res.status(200).json({
                        success: true,
                        message: 'Default banner updated successfully without extension change',
                        imageUrl: `${req.protocol}://${req.get('host')}/uploads/defaultBanner/Banner${path.extname(req.file.originalname)}`
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating default banner',
                error: error.message
            });
        }
    } else {
        res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }
});
