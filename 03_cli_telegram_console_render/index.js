#!/usr/bin/env node

import { Command } from 'commander';

import TelegramBot from 'node-telegram-bot-api';

import { promises } from 'fs';

import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.NODE_TELEGRAM_BOT_TOKEN, { polling: true });

const program = new Command();

const chatId = '439772038';

const sendMessage = async (message) => {
  await bot.sendMessage(chatId, message)

  process.exit(0);
};


const sendPhoto = async (path) => {
  const photo = await promises.readFile(path);

  await bot.sendPhoto(chatId, photo);

  process.exit(0)
};

program
  .version('1.0.0')
  .command('message <message>')
  .alias('m')
  .description('Send message to Telegram Bot.')
  .action(sendMessage);
  
program
  .version('1.0.0')
  .command('photo <path>')
  .alias('p')
  .description('Send photo to Telegram Bot. Just drop it to console after p-flag.')
  .action(sendPhoto);

program.parse(process.argv);