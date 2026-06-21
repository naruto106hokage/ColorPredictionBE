
const mongoose = require('mongoose');
const Slot = require('./models/Slot');
const Bet = require('./models/Bet');
const User = require('./models/User');

let slotCounter = 1;

const createNewSlot = async () => {
    const now = new Date();
    const newSlot = new Slot({
        slotNumber: slotCounter.toString(),
        slotName: `Game #${slotCounter}`,
        startDate: now.getTime(),
        startTime: now.getTime(),
        endTime: now.getTime() + 60000, // 1 minute from now
        status: 'active'
    });
    await newSlot.save();
    console.log(`New game slot created: ${newSlot.slotName}`);
    slotCounter++;
    return newSlot;
};

const processGame = async () => {
    console.log('Processing game tick...');
    let activeSlot = await Slot.findOne({ status: 'active' }).sort({ createdAt: 1 });

    // If no active slot, create one and skip the rest of the tick
    if (!activeSlot) {
        console.log('No active slot found. Creating a new one.');
        await createNewSlot();
        return;
    }

    // Mark the current slot as processing
    activeSlot.status = 'processing';
    await activeSlot.save();

    const bets = await Bet.find({ slotId: activeSlot._id });

    let winningNumber;

    if (bets.length === 0) {
        // If no bets, pick a random number 0-9
        winningNumber = 1;
        console.log(`No bets placed. Randomly selected winning number: ${winningNumber}`);
    } else {
        const betAmounts = {}; // { '3': 250, '7': 150, ... }
        for (let i = 0; i <= 9; i++) {
            betAmounts[i] = 0;
        }

        bets.forEach(bet => {
            betAmounts[bet.number] += bet.amount;
        });

        let minAmount = Infinity;
        Object.values(betAmounts).forEach(amount => {
            if (amount < minAmount) {
                minAmount = amount;
            }
        });

        const tiedNumbers = [];
        for (const number in betAmounts) {
            if (betAmounts[number] === minAmount) {
                tiedNumbers.push(parseInt(number));
            }
        }

        // Choose one of the least-bet numbers if there is a tie.
        winningNumber = tiedNumbers[Math.floor(Math.random() * tiedNumbers.length)];
        console.log(`Calculated winning number from least bets: ${winningNumber}`);
    }

    // Update slot with winning number and mark as completed
    activeSlot.winningNumber = winningNumber;
    activeSlot.status = 'completed';
    await activeSlot.save();

    // Process payouts
    for (const bet of bets) {
        if (bet.number === winningNumber) {
            bet.status = 'win';
            const winningAmount = bet.amount * 3;
            bet.winningAmount = winningAmount;
            await User.findByIdAndUpdate(bet.userId, { $inc: { winningWallet: winningAmount } });
        } else {
            bet.status = 'loss';
        }
        await bet.save();
    }
    console.log(`Payouts processed for slot ${activeSlot.slotName}`);

    // Create the next slot
    await createNewSlot();
};

const startGameEngine = () => {
    console.log('Starting game engine...');
    // Run processGame every 60 seconds
    setInterval(processGame, 60000);
    // Run it once immediately to get the first game started
    processGame();
};

module.exports = { startGameEngine };
