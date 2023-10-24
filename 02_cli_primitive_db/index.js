#!/usr/bin/env node
import inquirer from "inquirer";
import fs, { promises } from 'fs';
import path from "path";

const dbFileName = 'main.txt';
const format = 'utf-8';
const DBDir = path.resolve('db');
const DBFilePath = path.resolve(DBDir, dbFileName);

const onEnterAction = async () => {
  const { isDbSearch } = await inquirer.prompt([{
    message: 'Would you like to search your user in the database?',
    name: 'isDbSearch',
    type: 'confirm',
    default: false,
  }]);

  const isDBdirectoryExist = fs.existsSync(DBFilePath)
  if (!isDBdirectoryExist) {
    console.log("Sorry, You haven't entered any users yet.");
    process.exit(1);
  }
  // Search for user in the database goes here
  if (isDbSearch) {
    try {
      const data = await promises.readFile(DBFilePath, format);
      const parsed = data.split(',/n').filter(i => !!i).map(item => JSON.parse(item));

      console.log(parsed);

      const { userToFindInDb } = await inquirer.prompt([{
        message: 'Enter user name you want to find in the database?',
        name: 'userToFindInDb',
      }]);

      const user = parsed.filter(u => u.userName.toLowerCase() === userToFindInDb.toLowerCase());

      if (user) {
        console.log(`User(s) ${userToFindInDb} was found.`);
        console.log(JSON.stringify(user));
      } else {
        console.log(`Sorry, but there is no user ${userToFindInDb} in the database.`);
      }
    
      process.exit(0);
    } catch (err) {
      throw new Error(err);
    }
  } else {
    process.exit(0);
  }
};

const run = async() => {
  const { userName } = await inquirer.prompt([{
    message: 'Enter the user\'s name. To cancel press ENTER.',
    name: 'userName',
  }]);

  // If Enter was clicked on users name prompt
  if (!userName) {
    await onEnterAction();
  }
  
  // Prompt gender and age
  const { gender, age  } = await inquirer.prompt([
    {
      choices: ['male', 'female'],
      message: 'Choose your gender.',
      name: 'gender',
      type: 'list',
    },
    {
      message: 'Enter your age.',
      name: 'age',
      validate: (val) => !!Number(val),
    },
  ]);

  try {
    // Create user in db operation goes here
    const isDBdirectoryExist = fs.existsSync(DBFilePath);
    const isDBFileExist = fs.existsSync(DBFilePath);
    const dataToWrite = `${JSON.stringify({ userName: userName.trim(), age, gender })},/n`;

    if (!isDBdirectoryExist) {
      promises.mkdir(DBDir);
    }
    if (!isDBFileExist) {
      await promises.writeFile(DBFilePath, dataToWrite, format);
    } else {
      await promises.appendFile(DBFilePath, dataToWrite, format);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  run();
}; 

run();