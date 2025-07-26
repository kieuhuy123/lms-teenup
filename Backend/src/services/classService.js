import classModel from "../models/classModel.js";
import studentModel from "../models/studentModel.js";
import classRegistrationModel from "../models/classRegistrationModel.js";
import { BadRequestError, NotFoundError } from "../core/error.response.js";

class ClassService {
  /**
   * Create a new class
   * @param {Object} classData
   * @returns {Promise<Object>}
   */
  static async createClass(classData) {
    const {
      name,
      subject,
      day_of_week,
      time_slot,
      teacher_name,
      max_students,
    } = classData;

    // Validate time slot format
    this.validateTimeSlot(time_slot);

    // Create new class
    const newClass = await classModel.create({
      name,
      subject,
      day_of_week: day_of_week.toLowerCase(),
      time_slot,
      teacher_name,
      max_students: max_students || 10,
    });

    return newClass;
  }

  /**
   * Get class by ID
   * @param {string} classId
   * @returns {Promise<Object>}
   */
  static async getClassById(classId) {
    if (!classId) {
      throw new BadRequestError("Class ID is required");
    }

    const classInfo = await classModel.findById(classId);
    if (!classInfo) {
      throw new NotFoundError("Class not found");
    }

    // Get registered students count
    const registeredCount = await classRegistrationModel.countDocuments({
      class_id: classId,
      status: "active",
    });

    return {
      ...classInfo.toObject(),
      registered_students: registeredCount,
      available_slots: classInfo.max_students - registeredCount,
    };
  }

  /**
   * Get classes by day of week
   * @param {string} day
   * @returns {Promise<Array>}
   */
  static async getClassesByDay(day) {
    if (!day) {
      throw new BadRequestError("Day is required");
    }

    const classes = await classModel
      .find({ day_of_week: day.toLowerCase() })
      .sort({ "time_slot.start_time": 1 });

    // Add registered students count for each class
    const classesWithCount = await Promise.all(
      classes.map(async (classInfo) => {
        const registeredCount = await classRegistrationModel.countDocuments({
          class_id: classInfo._id,
          status: "active",
        });

        return {
          ...classInfo.toObject(),
          registered_students: registeredCount,
          available_slots: classInfo.max_students - registeredCount,
        };
      })
    );

    return classesWithCount;
  }

  /**
   * Get all classes
   * @returns {Promise<Array>}
   */
  static async getAllClasses() {
    const classes = await classModel
      .find({})
      .sort({ day_of_week: 1, "time_slot.start_time": 1 });

    // Add registered students count for each class
    const classesWithCount = await Promise.all(
      classes.map(async (classInfo) => {
        const registeredCount = await classRegistrationModel.countDocuments({
          class_id: classInfo._id,
          status: "active",
        });

        return {
          ...classInfo.toObject(),
          registered_students: registeredCount,
          available_slots: classInfo.max_students - registeredCount,
        };
      })
    );

    return classesWithCount;
  }

  /**
   * Register student to class
   * @param {string} classId
   * @param {string} studentId
   * @returns {Promise<Object>}
   */
  static async registerStudentToClass(classId, studentId) {
    if (!classId || !studentId) {
      throw new BadRequestError("Class ID and Student ID are required");
    }

    // Validate class exists
    const classInfo = await classModel.findById(classId);
    if (!classInfo) {
      throw new NotFoundError("Class not found");
    }

    // Validate student exists
    const student = await studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundError("Student not found");
    }

    // Check if student is already registered for this class
    const existingRegistration = await classRegistrationModel.findOne({
      class_id: classId,
      student_id: studentId,
      status: "active",
    });

    if (existingRegistration) {
      throw new BadRequestError("Student is already registered for this class");
    }

    // Check class capacity
    const registeredCount = await classRegistrationModel.countDocuments({
      class_id: classId,
      status: "active",
    });

    if (registeredCount >= classInfo.max_students) {
      throw new BadRequestError("Class is at maximum capacity");
    }

    // Check for time conflicts with student's other classes
    await this.checkStudentTimeConflict(
      studentId,
      classInfo.day_of_week,
      classInfo.time_slot
    );

    // Create registration
    const registration = await classRegistrationModel.create({
      class_id: classId,
      student_id: studentId,
    });

    // Return registration with populated data
    const populatedRegistration = await classRegistrationModel
      .findById(registration._id)
      .populate("class_id", "name subject day_of_week time_slot teacher_name")
      .populate("student_id", "name current_grade");

    return populatedRegistration;
  }

  /**
   * Get students registered for a class
   * @param {string} classId
   * @returns {Promise<Array>}
   */
  static async getClassStudents(classId) {
    if (!classId) {
      throw new BadRequestError("Class ID is required");
    }

    const registrations = await classRegistrationModel
      .find({ class_id: classId, status: "active" })
      .populate("student_id", "name dob gender current_grade")
      .populate({
        path: "student_id",
        populate: {
          path: "parent_id",
          select: "name phone email",
        },
      })
      .sort({ registration_date: 1 });

    return registrations.map((reg) => reg.student_id);
  }

  /**
   * Validate time slot format
   * @param {Object} timeSlot
   */
  static validateTimeSlot(timeSlot) {
    if (!timeSlot || !timeSlot.start_time || !timeSlot.end_time) {
      throw new BadRequestError(
        "Time slot with start_time and end_time is required"
      );
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      !timeRegex.test(timeSlot.start_time) ||
      !timeRegex.test(timeSlot.end_time)
    ) {
      throw new BadRequestError("Time format must be HH:MM (24-hour format)");
    }

    // Check if start time is before end time
    const [startHour, startMin] = timeSlot.start_time.split(":").map(Number);
    const [endHour, endMin] = timeSlot.end_time.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes >= endMinutes) {
      throw new BadRequestError("Start time must be before end time");
    }
  }

  /**
   * Check for time conflicts with existing classes
   * @param {string} dayOfWeek
   * @param {Object} timeSlot
   * @returns {Promise<Object|null>}
   */
  static async checkTimeConflict(dayOfWeek, timeSlot) {
    const existingClasses = await classModel.find({
      day_of_week: dayOfWeek.toLowerCase(),
    });

    const newStart = this.timeToMinutes(timeSlot.start_time);
    const newEnd = this.timeToMinutes(timeSlot.end_time);

    for (const existingClass of existingClasses) {
      const existingStart = this.timeToMinutes(
        existingClass.time_slot.start_time
      );
      const existingEnd = this.timeToMinutes(existingClass.time_slot.end_time);

      // Check for overlap
      if (newStart < existingEnd && newEnd > existingStart) {
        return existingClass;
      }
    }

    return null;
  }

  /**
   * Check for time conflicts with student's existing classes
   * @param {string} studentId
   * @param {string} dayOfWeek
   * @param {Object} timeSlot
   */
  static async checkStudentTimeConflict(studentId, dayOfWeek, timeSlot) {
    // Get student's existing registrations for the same day
    const existingRegistrations = await classRegistrationModel
      .find({ student_id: studentId, status: "active" })
      .populate("class_id");

    const conflictingClasses = existingRegistrations.filter(
      (reg) => reg.class_id.day_of_week === dayOfWeek.toLowerCase()
    );

    const newStart = this.timeToMinutes(timeSlot.start_time);
    const newEnd = this.timeToMinutes(timeSlot.end_time);

    for (const registration of conflictingClasses) {
      const existingClass = registration.class_id;
      const existingStart = this.timeToMinutes(
        existingClass.time_slot.start_time
      );
      const existingEnd = this.timeToMinutes(existingClass.time_slot.end_time);

      // Check for overlap
      if (newStart < existingEnd && newEnd > existingStart) {
        throw new BadRequestError(
          `Student has a time conflict with class "${existingClass.name}" at ${existingClass.time_slot.start_time}-${existingClass.time_slot.end_time} on ${dayOfWeek}`
        );
      }
    }
  }

  /**
   * Convert time string to minutes
   * @param {string} timeStr
   * @returns {number}
   */
  static timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }
}

export default ClassService;
