const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token
const token = 'YOUR_TELEGRAM_BOT_TOKEN';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Function to fetch a random quote
async function getRandomQuote() {
    try {
        const response = await axios.get('https://api.quotable.io/random');
        const quote = response.data;
        return `${quote.content} - ${quote.author}`;
    } catch (error) {
        console.error('Error fetching quote:', error);
        return 'Failed to fetch quote. Please try again later.';
    }
}

// Event listener for the '/quote' command
bot.onText(/\/quote/, async (msg) => {
    const chatId = msg.chat.id;
    const quote = await getRandomQuote();
    bot.sendMessage(chatId, quote);
});

// Event listener for the '/weather' command
bot.onText(/\/weather (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const city = match[1];
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_OPENWEATHERMAP_API_KEY`);
        const weatherData = response.data;
        const temperature = Math.round(weatherData.main.temp - 273.15); // Convert temperature to Celsius
        const description = weatherData.weather[0].description;
        const message = `Weather in ${city}: ${description}, Temperature: ${temperature}°C`;
        bot.sendMessage(chatId, message);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        bot.sendMessage(chatId, 'Failed to fetch weather data. Please check the city name and try again.');
    }
});

// Event listener for the '/roll' command
bot.onText(/\/roll/, (msg) => {
    const chatId = msg.chat.id;
    const randomNumber = Math.floor(Math.random() * 6) + 1; // Generate a random number between 1 and 6
    bot.sendMessage(chatId, `You rolled a ${randomNumber}`);
});

// Event listener for the '/cat' command
bot.onText(/\/cat/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        const catImageUrl = response.data[0].url;
        bot.sendPhoto(chatId, catImageUrl);
    } catch (error) {
        console.error('Error fetching cat image:', error);
        bot.sendMessage(chatId, 'Failed to fetch cat image. Please try again later.');
    }
});

// Event listener for unsupported commands
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Unsupported command. Use /quote, /weather, /roll, or /cat.');
});
