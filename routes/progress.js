const express = require('express');
const router = express.Router();
const { format, isAfter } = require('date-fns');

const totalDaysInYear = 365;
let previousPercentage = -1;


router.get('/today', (req, res) => {
    const result = calculateProgress();
    res.json(result);
});

router.get('/:date', (req, res) => {
    const requestedDate = new Date(req.params.date);
    const result = calculateProgress(requestedDate);
    res.json(result);
});

function calculateProgress(date) {
    const requestedDate = date || new Date();
    const requestedDayOfYear = getDayOfYear(requestedDate);

    if (isAfter(requestedDate, new Date(requestedDate.getFullYear(), 11, 31))) {
        return {
            dateOfYear: requestedDate.toISOString().slice(0, 10),
            countDays: 1,
            progressBar: "Progreso: [ ] 0% del año completado",
            status: false
        };
    }

    const percentage = (requestedDayOfYear / totalDaysInYear) * 100;
    const roundedPercentage = Math.round(percentage);
    const progressBar = generateProgressBar(percentage, 30);

    const status = previousPercentage !== roundedPercentage;
    previousPercentage = roundedPercentage;

    return {
        dateOfYear: requestedDate.toISOString().slice(0, 10),
        countDays: requestedDayOfYear,
        progressBar: `Progreso: ${progressBar} ${roundedPercentage}% del año completado`,
        status: status
    };
}

function getDayOfYear(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay) + 1;
}

function generateProgressBar(percentage, size) {
    const actualSize = Math.max(1, size);
    const actualPercentage = Math.min(100, Math.max(0, percentage));
    const progressBar = "[" + "=".repeat(Math.round((actualPercentage / 100) * actualSize)) + ".".repeat(actualSize - Math.round((actualPercentage / 100) * actualSize)) + "]";
    return progressBar;
}

module.exports = router;
