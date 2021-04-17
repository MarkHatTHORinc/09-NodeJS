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
const defaultInputFile = 'markh.txt';
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
    console.log('              FILE GENERATOR FROM TEMPLATE')
    console.log(' ')
    console.log(
        'This program will generate a stream file based upon a template file.');
    console.log(
        'Questions are stored in the template file and will be prompted to the user');
    console.log(
        '  to provide substitution in the template. Each question can accept multiple');
    console.log(
        '  lines of input.');
    console.log(
        'If you are through answering a question enter "DONE" and you will be prompted');
    console.log(
        '  for the next question.');
    console.log(
        'If you want to take a break and resume later where you left off enter "BREAK.');
    console.log(
        'If you want to quit without writing an output file enter "STOP".');
    console.log(' ');
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
        let fileName = baseDirectory + value;
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
    }
    console.log(inputFile);
    console.log(outputFile);


    // Process 4) Process Template - breakout questions and output skeleton
    await fileGenerator.processTemplate(fs, inputFile);


    // Process 5) Ask Questions - store results in array
    await fileGenerator.askQuestions(inquirer);
    

    // Process 6) Write Output file - substitute answers in placeholders
    console.log('Calling writeOutputFile');
    await fileGenerator.writeOutputFile(fs, outputFile);

    //fs.close();
    console.log(`${outputFile} has been created.`)
    return;
}

// --------------------------------------------------------------------------------------------------------------
// MAINLINE
// Purpose:  This code is executed when the program is loaded into memory.
// --------------------------------------------------------------------------------------------------------------
main();
