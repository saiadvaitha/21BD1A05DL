const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const BASE_URL = 'http://20.244.56.144/test';
let numberWindow = [];

const fetchNumbers = async (type) => {
    try {
        const response = await axios.get(`${BASE_URL}/${type}`, { timeout: 500 });
        return response.data.numbers;
    } catch (error) {
        console.error(`Error fetching ${type} numbers:`, error.message);
        return [];
    }
};

const getAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return (sum / numbers.length).toFixed(2);
};

app.get('/numbers/:type', async (req, res) => {
    const type = req.params.type;

    if (!['primes', 'fibo', 'even', 'rand'].includes(type)) {
        return res.status(400).send({ error: 'Invalid number type' });
    }

    const numbers = await fetchNumbers(type);

    if (numbers.length === 0) {
        return res.status(500).send({ error: 'Failed to fetch numbers from the third-party server' });
    }

    const windowPrevState = [...numberWindow];
    numbers.forEach(number => {
        if (!numberWindow.includes(number)) {
            if (numberWindow.length >= WINDOW_SIZE) {
                numberWindow.shift();
            }
            numberWindow.push(number);
        }
    });

    const average = getAverage(numberWindow);

    res.send({
        windowPrevState,
        windowCurrState: numberWindow,
        numbers,
        avg: average,
    });
});

app.listen(PORT, () => {
    console.log(`Average Calculator microservice running on http://localhost:${PORT}`);
});
