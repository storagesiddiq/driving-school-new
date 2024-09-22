const CatchAsyncError = require('../middlewares/catchAsyncError')
const errorHandler = require('../utils/errorHandler')
const User = require('../models/UserModel');
const { generateRandomPassword } = require('../utils/generateRandomPassword');
const DrivingSchool = require('../models/drivingSchoolModel');
const sendEmail = require('../utils/email')
const Vehicle = require('../models/vehicleModel');
const Service = require('../models/serviceModel');
const Review = require('../models/reviewModel');
const { registerLearner } = require('../models/courseModel');
const { Session } = require('../models/courseModel');
const { Course } = require('../models/courseModel');
const {
    getActiveLearners,
    getTotalLearners,
    getTotalInstructors,
    getTotalSchools
} = require('../utils/superAdminAnalytics');
const path = require('path')
const fs = require('fs');
const instructorModel = require('../models/instructorModel');

// create drivingSchool/admin = api/admin/driving-school
exports.createDrivingSchool = CatchAsyncError(async (req, res, next) => {
    const { name, email, phoneNumber, drivingSchoolName, location } = req.body;

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
            location
        });

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
    // Fetch all driving schools and populate the 'owner' field with specific fields
    const drivingSchools = await DrivingSchool.find()
        .populate('owner', 'avatar name email phoneNumber');

    // Add instructors and courses count to each driving school
    const drivingSchoolsWithCounts = drivingSchools.map(school => {
        return {
            ...school._doc,
            instructorCount: school.instructors ? school.instructors.length : 0,
            courseCount: school.courses ? school.courses.length : 0
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
        .populate('owner', 'avatar name email phoneNumber');

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found', 404));
    }

    const courses = await Course.find({ drivingSchool: drivingSchool._id })
        .populate('vehicles', 'name registrationNumber type lastServiceDate nextServiceDate usedInCourses certificates')
        .populate('services', 'serviceName serviceType vehicleType price certificatesIssued description')
        .populate('instructor', 'name email')
        .populate('learners', 'learnerName learnerEmail')
        .populate('reviews', 'rating comment reviewerName');

    const instructors = await instructorModel.find({ drivingSchool: drivingSchool._id })
        .populate('instructor', 'avatar name email');

    const learners = await registerLearner.find({ drivingSchool: drivingSchool._id, status: "Approved" })
        .populate('learner', 'avatar name email'); // Populate the `learner` field

    res.status(200).json({
        success: true,
        drivingSchool,
        courses,
        instructors,
        learners
    });
});


//delete  drivingSchool/admin = api/admin/driving-school/:id
exports.deleteDrivingSchool = CatchAsyncError(async (req, res, next) => {
    const drivingSchool = await DrivingSchool.findById(req.params.id)
        .populate('owner'); // Make sure only paths in your schema are populated.

    if (!drivingSchool) {
        return next(new errorHandler('Driving School not found', 404));
    }

    // Delete associated courses
    await Course.deleteMany({ drivingSchool: drivingSchool._id });
    await Session.deleteMany({ drivingSchool: drivingSchool._id });
    await registerLearner.deleteMany({ drivingSchool: drivingSchool._id });

    // Delete instructors and their associated users
    const instructors = await instructorModel.find({ drivingSchool: drivingSchool._id });
    const userIds = instructors.map((instructor) => instructor.user); // Assuming `instructor.user` refers to User ID
    await instructorModel.deleteMany({ drivingSchool: drivingSchool._id });
    await User.deleteMany({ _id: { $in: userIds } });

    // Delete associated owner
    await User.findByIdAndDelete(drivingSchool.owner); // Ensure you are deleting the owner's user document

    // Delete the driving school
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

//get defaultAvatar from admin - api/defualt-avatar
exports.getDefaultAvatar = CatchAsyncError(async (req, res) => {
    const avatarDirectory = path.join(__dirname, '../uploads/defaultAvatar');
  
    // Read the directory to find the image file
    fs.readdir(avatarDirectory, (err, files) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error reading the directory',
        });
      }
  
      // Find the first file in the directory (assuming there's only one default avatar image)
      const avatarFile = files.find(file => file);
  
      if (!avatarFile) {
        return res.status(404).json({
          success: false,
          message: 'No default avatar found',
        });
      }
  
      // Build the full URL of the file
      const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/defaultAvatar/${avatarFile}`;
  
      res.status(200).json({
        success: true,
        url: avatarUrl,
      });
    });
  });
  
//put defaultBanner from admin = api/defualt-banner
exports.getDefaultBanner = CatchAsyncError(async (req, res) => {
    const avatarDirectory = path.join(__dirname, '../uploads/defaultBanner');
  
    // Read the directory to find the image file
    fs.readdir(avatarDirectory, (err, files) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error reading the directory',
        });
      }
  
      // Find the first file in the directory (assuming there's only one default avatar image)
      const avatarFile = files.find(file => file);
  
      if (!avatarFile) {
        return res.status(404).json({
          success: false,
          message: 'No default avatar found',
        });
      }
  
      // Build the full URL of the file
      const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/defaultBanner/${avatarFile}`;
  
      res.status(200).json({
        success: true,
        url: avatarUrl,
      });
    });
  });