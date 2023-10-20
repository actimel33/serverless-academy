#!/usr/bin/env node
const greetingMessage = "Hello, enter 10 words or digits separated by spaces. ";
const tryAgainMessage = 'Do you want to try again? Y/n: ';
const anErrorOccurred = 'An error occurred! ===>';
const blankInput = "Words or digits were not entered!";
const notANumber = "Your input was not a number!";
const notAllowedNumber = "Your input was not in the range of 1 to 7!";
const actionMessage = `
What operation do you want to do, enter the corresponding number from 1 to 7 please, and press enter to continue:
  1.Sort words alphabetically
  2.Show numbers from lesser to greater
  3.Show numbers from bigger to smaller
  4.Display words in ascending order by number of letters in the word
  5.Show only unique words
  6.Display only unique values from the set of words and numbers entered by the user
  7.To exit the program, the user need to enter exit, otherwise the program will repeat itself again and again, asking for new data and suggesting sorting
`;

const sort = (userInputArray, order) => userInputArray.sort((a, b) => order === 'ASC' ? a - b : b - a);
const actionsMap = {
  1: (userInputArray) => userInputArray.sort(),
  2: (userInputArray) => sort(userInputArray.filter(Number), 'ASC'),
  3: (userInputArray) => sort(userInputArray.filter(Number)),
  4: (userInputArray) => userInputArray.filter((item) => !Number(item)).sort((a, b) => a.length - b.length),
  5: (userInputArray) => ([ ...new Set(userInputArray.filter((item) => !Number(item))) ]),
  6: (userInputArray) => ([ ...new Set(userInputArray) ]),
}

const prompt = (question) => {
  return new Promise((resolve, reject) => {
    process.stdin.resume();
    process.stdout.write(question);

    process.stdin.on('data', data => resolve(data.toString().trim()));
    process.stdin.on('error', err => reject(err));
  });
}

const run = async () => {
  try {
    const userInput = await prompt(greetingMessage);
    process.stdin.pause();
    
    if (!Boolean(userInput)) { 
      throw new Error(blankInput);
    }

    const chosenAction = await prompt(actionMessage);
    process.stdin.pause();

    if (!Number(chosenAction)) {
      throw new Error(notANumber);
    }

    if ((Number(chosenAction) > 6 || Number(chosenAction) < 1 ) && Number(chosenAction) !== 7) {
      throw new Error(notAllowedNumber);
    }

    if (Number(chosenAction) === 7) {
      process.exit()
    }

    const userInputArray = userInput.split(' ').filter((item) => /\S/.test(item))

    const result = actionsMap[chosenAction](userInputArray);

    console.log(result);
  } catch(error) {
    console.log(`${anErrorOccurred} ${error}`);

    const userInput = await prompt(tryAgainMessage);
    process.stdin.pause();

    if (userInput === 'Y' || userInput === 'y') {
      run();
    }
  }

};

run();
