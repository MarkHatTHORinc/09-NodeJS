// -----------------------------------------------------------------------------
// Program:  index.js
// Purpose:  1) Display the directions for using this program
//           2) Get a valid template file name
//           3) Get an output file name
//           4) Call file functions from fileGenerator to generate actual file.
// Input:    argv[2] <optional> template file name 
//           argv[3] <optional> output file name 
// -----------------------------------------------------------------------------
// Author:   Mark Harrison
// Date:     April 12, 2021
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------
// Node library package for reading and writing files
const { promises: fs } = require('fs');
// const util = require("util");
const inquirer = require('inquirer');
const { argv } = require('process');
const fileGenerator = require('./fileGenerator');

// -----------------------------------------------------------------------------
// Global Variables Section
// -----------------------------------------------------------------------------
const baseInputDirectory =
    './assets/templates/';
//    '/Users/markh/gt-bootcamp/homework/09-NodeJS/assets/templates/';
const baseOutputDirectory =
    './output/';
const defaultInputFile = 'professional.txt';
const defaultOutputFile = 'README.md';
let inputFile = "";
let outputFile = "";

// -----------------------------------------------------------------------------
// Function: displayDirections
// Purpose:  Display the directions for using this program
// Input:    <none> 
// Returns:  <none> 
// -----------------------------------------------------------------------------
function displayDirections() {
    console.log(` 
                       FILE GENERATOR FROM TEMPLATE

    This program will generate a stream file based upon a template file.
    Questions are stored in the template file and will be prompted to the user
    to provide substitution in the template. Each question can accept multiple
    lines of input.
    If you are through answering a question enter "DONE" and you will be prompted
    for the next question.
    If you want to quit without writing an output file enter "STOP".
      ** In a future release you will be able to take a break and
          resume later where you left off enter "BREAK". **

    `);
}

// -----------------------------------------------------------------------------
// Function: checkFile
// Purpose:  Checks to see if a file exists
// Input:    <string> file to check 
// Returns:  <boolean/string> 
//              boolean true=file exists, 
//              string=text that file does not exists 
// --------------------------------------------------------------------------------------------------------------
async function checkFile(value) {
    if (value == "" || value === undefined) {
        return true;
    } else {
        let fileName = baseInputDirectory + value;
        let fileExists;
        try {
            fileExists = await fs.access(fileName)
        } catch (err) {
            return `An invalid file was entered. Try again...`;
        }
        return true;
    }
}

// --------------------------------------------------------------------------------------------------------------
// Function: main
// Purpose:  Control Processes
//             1) Display Program Directions
//             2) Get Template File Name
//             3) Get Output File Name
//             4) Process Template - breakout questions and output skeleton
//             5) Ask Questions - store results in array
//             6) Write Output file - substitute answers in placeholders
//             7) Close File Stream
//             8) Clean up local storage
// Input:    <>
// Returns:  <>
// --------------------------------------------------------------------------------------------------------------
async function main() {
    // Process 1) Display Program Directions
    displayDirections();

    // Process 2) Get Template File Name
    if (argv.length < 3) {   // A template file was not passed, verify default is okay to use
        const answer = await inquirer.prompt([
            {
                type: "input",
                name: "inputFile",
                message: `Enter Template File to Use (ENTER for Default of ${defaultInputFile}): `,
                validate(value) {
                    if (value == "" || value === undefined) {
                        return true;
                    } else return checkFile(value);
                }
            }]);
        if (answer.inputFile == "" || answer.inputFile === undefined) {  // Use default input file name
            inputFile = baseInputDirectory + defaultInputFile;
        } else {
            inputFile = baseInputDirectory + answer.inputFile;
        }
    } else {
        inputFile = baseInputDirectory + argv[2];
    }

    // Process 3) Get Output file name
    // Output file is passed in argsv[3]
    if (argv.length < 4) {   // An output file was not passed, verify default is okay to use
        const answer = await inquirer.prompt([
            {
                type: "input",
                name: "outputFile",
                message: `Enter Output File to Use (ENTER for Default of ${defaultOutputFile}): `,
                validate(value) {
                    return true;
                }
            }]);

        if (answer.outputFile == "" || answer.outputFile === undefined) {  // Use default output file name
            outputFile = baseOutputDirectory + defaultOutputFile;
        } else {
            outputFile = baseOutputDirectory + answer.outputFile;
        }
    } else {
        outputFile = baseOutputDirectory + argv[3];
    }


    // Process 4) Process Template - breakout questions and output skeleton
    await fileGenerator.processTemplate(fs, inputFile);


    // Process 5) Ask Questions - store results in array
    await fileGenerator.askQuestions(inquirer);
    

    // Process 6) Write Output file - substitute answers in placeholders
    await fileGenerator.writeOutputFile(fs, outputFile);


    // Process 7) Close File Stream
    // This is not needed since we will not reuse fs and will be reclaimed by program ending
    //fs.close();

    
    // Process 8) ** Future Release **
    //    Clean up local storage (will have to write a function called local storage that writes to disk)
    // localStorage.removeItem("Generator_Questions");


    console.log(`${outputFile} has been created.`)
    return;
}

// --------------------------------------------------------------------------------------------------------------
// MAINLINE
// Purpose:  This code is executed when the program is loaded into memory.
// --------------------------------------------------------------------------------------------------------------
main();
