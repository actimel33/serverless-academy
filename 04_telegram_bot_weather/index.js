import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const chatId = '439772038';
const bot = new TelegramBot(process.env.NODE_TELEGRAM_BOT_TOKEN, { polling: true });

const every3hours = '3 hours'
const every6hours = '6 hours'

bot.sendMessage(chatId, 'Please enter the city name to get the weather for! Type "exit" to stop!');
 
let city;

const getLink = (count) => `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.WEATHER_API_KEY}&cnt=${count}`

bot.on('message', async (msg) => {
  if (msg.text.toLowerCase() === 'exit') {
    process.exit();
  }

  console.log(msg.text);
  if (msg.text === every3hours) {
    try {
      const { data } = await axios.get(getLink(3));
    
      const textArray = data.list?.map(item => `${item.dt_txt.split(' ')[1]} => temperature: ${(item.main.temp - 273,15).toFixed()}℃`); 
      const result = textArray.map(item => `<pre>${item}; </pre>`).join('')

      await bot.sendMessage(
        chatId,
        result,
        {
            parse_mode: "HTML",
        }
    );
    
      process.exit();
    } catch (error) {
      console.log(error);
      process.exit();
    }
   
  }

  if (msg.text === every6hours) {
    try {
      const { data } = await axios.get(getLink(6));
    
      const textArray = data.list?.map(item => `${item.dt_txt.split(' ')[1]} => temperature: ${(item.main.temp - 273,15).toFixed()}℃`); 
  
      const result = textArray.map(item => `<pre>${item}; </pre>`).join('')
      await bot.sendMessage(
        chatId,
        result,
        {
            parse_mode: "HTML",
        }
    );

    process.exit();
    } catch(err) {
      console.log(error);
      process.exit();
    }
  }
  
  city = msg.text.toLowerCase();
  await bot.sendMessage(chatId, 'Select weather interval you want! button to the left of the clip)', { 
    reply_markup: {
      keyboard: [[ every3hours, every6hours]],
    }
  });
});

