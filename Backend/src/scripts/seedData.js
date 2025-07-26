import mongoose from "mongoose";
import "dotenv/config";

// Import models
import parentModel from "../models/parentModel.js";
import studentModel from "../models/studentModel.js";
import classModel from "../models/classModel.js";
import classRegistrationModel from "../models/classRegistrationModel.js";
import subscriptionModel from "../models/subscriptionModel.js";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected for seeding...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample data
const sampleData = {
  parents: [
    {
      name: "Nguyễn Văn An",
      phone: "0901234567",
      email: "nguyen.van.an@email.com",
    },
    {
      name: "Trần Thị Bình",
      phone: "0912345678",
      email: "tran.thi.binh@email.com",
    },
    {
      name: "Lê Hoàng Cường",
      phone: "0923456789",
      email: "le.hoang.cuong@email.com",
    },
  ],

  classes: [
    {
      name: "Toán Cơ Bản",
      subject: "Toán học",
      day_of_week: "monday",
      time_slot: {
        start_time: "08:00",
        end_time: "09:30",
      },
      teacher_name: "Cô Lan",
      max_students: 12,
    },
    {
      name: "Tiếng Anh Giao Tiếp",
      subject: "Tiếng Anh",
      day_of_week: "tuesday",
      time_slot: {
        start_time: "14:00",
        end_time: "15:30",
      },
      teacher_name: "Thầy John",
      max_students: 15,
    },
    {
      name: "Lý Thuyết Vật Lý",
      subject: "Vật lý",
      day_of_week: "wednesday",
      time_slot: {
        start_time: "09:00",
        end_time: "10:30",
      },
      teacher_name: "Thầy Minh",
      max_students: 10,
    },
    {
      name: "Hóa Học Thực Hành",
      subject: "Hóa học",
      day_of_week: "thursday",
      time_slot: {
        start_time: "15:00",
        end_time: "16:30",
      },
      teacher_name: "Cô Hương",
      max_students: 8,
    },
  ],
};

// Clear existing data
const clearData = async () => {
  try {
    await classRegistrationModel.deleteMany({});
    await subscriptionModel.deleteMany({});
    await studentModel.deleteMany({});
    await classModel.deleteMany({});
    await parentModel.deleteMany({});
    console.log("✅ Cleared existing data");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
  }
};

// Seed parents
const seedParents = async () => {
  try {
    const parents = await parentModel.insertMany(sampleData.parents);
    console.log(`✅ Created ${parents.length} parents`);
    return parents;
  } catch (error) {
    console.error("❌ Error seeding parents:", error);
    return [];
  }
};

// Seed students
const seedStudents = async (parents) => {
  try {
    const students = [
      {
        name: "Nguyễn Minh Đức",
        dob: new Date("2010-03-15"),
        gender: "male",
        current_grade: "Lớp 8",
        parent_id: parents[0]._id,
      },
      {
        name: "Nguyễn Thu Hà",
        dob: new Date("2012-07-22"),
        gender: "female",
        current_grade: "Lớp 6",
        parent_id: parents[0]._id,
      },
      {
        name: "Trần Quốc Bảo",
        dob: new Date("2009-11-08"),
        gender: "male",
        current_grade: "Lớp 9",
        parent_id: parents[1]._id,
      },
      {
        name: "Lê Thùy Linh",
        dob: new Date("2011-05-30"),
        gender: "female",
        current_grade: "Lớp 7",
        parent_id: parents[2]._id,
      },
    ];

    const createdStudents = await studentModel.insertMany(students);
    console.log(`✅ Created ${createdStudents.length} students`);
    return createdStudents;
  } catch (error) {
    console.error("❌ Error seeding students:", error);
    return [];
  }
};

// Seed classes
const seedClasses = async () => {
  try {
    const classes = await classModel.insertMany(sampleData.classes);
    console.log(`✅ Created ${classes.length} classes`);
    return classes;
  } catch (error) {
    console.error("❌ Error seeding classes:", error);
    return [];
  }
};

// Seed class registrations
const seedClassRegistrations = async (students, classes) => {
  try {
    const registrations = [
      {
        class_id: classes[0]._id, // Toán Cơ Bản
        student_id: students[0]._id, // Nguyễn Minh Đức
        status: "active",
      },
      {
        class_id: classes[1]._id, // Tiếng Anh Giao Tiếp
        student_id: students[0]._id, // Nguyễn Minh Đức
        status: "active",
      },
      {
        class_id: classes[0]._id, // Toán Cơ Bản
        student_id: students[2]._id, // Trần Quốc Bảo
        status: "active",
      },
      {
        class_id: classes[2]._id, // Lý Thuyết Vật Lý
        student_id: students[2]._id, // Trần Quốc Bảo
        status: "active",
      },
      {
        class_id: classes[1]._id, // Tiếng Anh Giao Tiếp
        student_id: students[3]._id, // Lê Thùy Linh
        status: "active",
      },
    ];

    const createdRegistrations = await classRegistrationModel.insertMany(
      registrations
    );
    console.log(
      `✅ Created ${createdRegistrations.length} class registrations`
    );
    return createdRegistrations;
  } catch (error) {
    console.error("❌ Error seeding class registrations:", error);
    return [];
  }
};

// Seed subscriptions
const seedSubscriptions = async (students) => {
  try {
    const currentDate = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(currentDate.getMonth() + 1);

    const subscriptions = [
      {
        student_id: students[0]._id, // Nguyễn Minh Đức
        package_name: "Gói Cơ Bản",
        start_date: currentDate,
        end_date: oneMonthLater,
        total_sessions: 20,
        used_sessions: 5,
        status: "active",
      },
      {
        student_id: students[2]._id, // Trần Quốc Bảo
        package_name: "Gói Nâng Cao",
        start_date: currentDate,
        end_date: oneMonthLater,
        total_sessions: 30,
        used_sessions: 2,
        status: "active",
      },
      {
        student_id: students[3]._id, // Lê Thùy Linh
        package_name: "Gói Tiêu Chuẩn",
        start_date: currentDate,
        end_date: oneMonthLater,
        total_sessions: 15,
        used_sessions: 8,
        status: "active",
      },
    ];

    const createdSubscriptions = await subscriptionModel.insertMany(
      subscriptions
    );
    console.log(`✅ Created ${createdSubscriptions.length} subscriptions`);
    return createdSubscriptions;
  } catch (error) {
    console.error("❌ Error seeding subscriptions:", error);
    return [];
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to database
    await connectDB();

    // Clear existing data
    await clearData();

    // Seed data in order
    const parents = await seedParents();
    const students = await seedStudents(parents);
    const classes = await seedClasses();
    await seedClassRegistrations(students, classes);
    await seedSubscriptions(students);

    console.log("🎉 Database seeding completed successfully!");

    // Display summary
    console.log("\n📊 SUMMARY:");
    console.log(`Parents: ${parents.length}`);
    console.log(`Students: ${students.length}`);
    console.log(`Classes: ${classes.length}`);
    console.log("Class Registrations: 5");
    console.log("Subscriptions: 3");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("📦 Database connection closed");
    process.exit(0);
  }
};

seedDatabase();

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
