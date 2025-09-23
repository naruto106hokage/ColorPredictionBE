
require('dotenv').config();
const mongoose = require('mongoose');
const Slot = require('./models/Slot');

const MONGODB_URI = process.env.MONGODB_URI;

const dummySlots = [
    {
        slotNumber: "1",
        slotName: "Morning Rush",
        startDate: new Date().setHours(0, 0, 0, 0),
        startTime: new Date().setHours(9, 0, 0, 0),
        endTime: new Date().setHours(12, 0, 0, 0),
        status: "active"
    },
    {
        slotNumber: "2",
        slotName: "Afternoon Chill",
        startDate: new Date().setHours(0, 0, 0, 0),
        startTime: new Date().setHours(12, 0, 0, 0),
        endTime: new Date().setHours(15, 0, 0, 0),
        status: "active"
    },
    {
        slotNumber: "3",
        slotName: "Evening Fun",
        startDate: new Date().setHours(0, 0, 0, 0),
        startTime: new Date().setHours(15, 0, 0, 0),
        endTime: new Date().setHours(18, 0, 0, 0),
        status: "active"
    },
    {
        slotNumber: "4",
        slotName: "Night Owl",
        startDate: new Date().setHours(0, 0, 0, 0),
        startTime: new Date().setHours(18, 0, 0, 0),
        endTime: new Date().setHours(21, 0, 0, 0),
        status: "completed",
        winningNumber: 7
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected for seeding');

        await Slot.deleteMany({});
        console.log('Existing slots cleared');

        await Slot.insertMany(dummySlots);
        console.log('Dummy slots inserted');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.disconnect();
        console.log('MongoDB disconnected');
    }
};

seedDB();
