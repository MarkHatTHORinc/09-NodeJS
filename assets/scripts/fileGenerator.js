// -----------------------------------------------------------------------------
// Program:  fileGenerator.js
// Purpose:  Provide Helper Functions to
//           1) Read and parse template file
//           3) Write to output file
//              a) Substitue answers into placeholders
// -----------------------------------------------------------------------------
// Author:   Mark Harrison
// Date:     April 12, 2021
// -----------------------------------------------------------------------------

const inquirer = require("inquirer");

// -----------------------------------------------------------------------------
// Global Variables Section
// -----------------------------------------------------------------------------
let allAnswers = [];
let linesOut = [];
let placeholders = [];
let inqChoices = [];
let inqMessages = [];
let inqTypes = [];


// --------------------------------------------------------------------------------------------------------------
// Function: processTemplate
// Purpose:  Reads template stream file, split into lines, call
// Input:    <fileSystem> file system object, <string> file name to read
// Returns:  <boolean> true = success, false = failure
// --------------------------------------------------------------------------------------------------------------
async function processTemplate(fs, inputFile) {
  // "utf8" encodes the raw buffer data in human-readable format

  try {
    data = await fs.readFile(inputFile, 'utf8')
  } catch (err) {
    console.log(`Something went wrong...`);
    console.log(err);
    return false;
  }
  // split the contents by new line
  let lines = data.split(/\r?\n/);
  processLines(lines);
  return true;
}


// --------------------------------------------------------------------------------------------------------------
// Function: processLines
// Purpose:  Processes the Input data. It will scan for questions to ask and store input into arrays.  It will 
//           then substitute values into place holders and will call writeOutput 
// Input:    <string> data to process
// Returns:  <boolean> true = success, false = failure
// --------------------------------------------------------------------------------------------------------------
function processLines(lines) {

  lines.forEach((line) => {
    // Comment lines start with "//" in first two positions and will be ignored
    if (line.substr(0, 2) !== '//') {
      // Qustions start with <<
      let strPh = line.search("<<");

      if (strPh >= 0) {
        strPh += 2;
        let inqChoice = ' ';
        let inqMessage = ' ';
        let inqType = 'input';
        let ph = '';
        let endPh = 0;
        let endMsg = line.length - 2;
        // Place Holder Id is between << and >>
        endPh = line.search("@@");
        if (endPh <= 0) {
          // Type of Input not provided
          endPh = line.search(">>");
          ph = line.substr(strPh, endPh - strPh);
        } else {
          // Type of Input was provided
          ph = line.substr(strPh, endPh - strPh);
          let strCh = endPh + 2;
          endPh = line.search(">>");
          if (line.substr(strCh, 5) == 'list:') {
            inqType = 'list'
            strCh += 5;
            inqChoice = line.substr(strCh, endPh - strCh)
          }
        }

        inqMessage = line.substr(endPh + 2, endMsg);
        inqChoices.push(inqChoice);
        inqMessages.push(inqMessage);
        inqTypes.push(inqType);
        placeholders.push(ph);
      } else {
        linesOut.push(line);
      }
    }
  }
  );

  return true;
}

// --------------------------------------------------------------------------------------------------------------
// Function: askQuestions
// Purpose:  Ask User Questions from Template
// Input:    <[string]> array of strings (questions)
// Returns:  <boolean> true = success, false = failure
// --------------------------------------------------------------------------------------------------------------
async function askQuestions(inquirer) {
  
  let startQuestion = 0;
  // ** Future Release **
  // First Check to see if there the user took a break. Data will be stored in localstorage
  // if (localStorage.getItem("Generator_Questions")) {
  //   allAnswers = JSON.parse(localStorage.getItem("Generator_Questions"));
  //   startQuestion = allAnswers.length;
  // }
  for (let i = startQuestion; i < inqMessages.length; i++) {
    let answers = [];  // answers to this question
    let done = 'RUNNING';
    do {
      if (inqTypes[i] === 'input') {
        const entry = await inquirer.prompt([
          {
            type: "input",
            name: "userInput",
            message: inqMessages[i] + " (DONE/STOP)",
            validate(value) {
              valueUpper = value.toUpperCase();
              switch (valueUpper) {
                case 'DONE':
                  allAnswers.push(answers);
                  done = 'DONE';
                  break;
                case 'STOP':
                  console.log('\nUser Aborted the generator.')
                  done = 'ABORT';
                  process.exit(0);
                case 'BREAK':
                  // ** Future Release **
                  // console.log('\nUser is taking a break. Storing Answers up to this point.')
                  // localStorage.setItem("Generator_Questions", JSON.stringify(allAnswers));
                  // done = 'BREAK';
                  // process.exit(0);
                default:
                  if (value !== '' && value !== undefined) {
                    answers.push(value);
                  }
              }
              return true;
            }
          }]);
      } else {  // list
        done = "DONE";
        let inqChoice = inqChoices[i].split(",");
        const entry = await inquirer.prompt([
          {
            type: "list",
            name: "userInput",
            message: inqMessages[i],
            choices: inqChoice
          }])
          .then(value => {
            answers.push(value.userInput);
            allAnswers.push(value.userInput);
          });
      }
    } while (done === 'RUNNING');
  };
  return;
}


// --------------------------------------------------------------------------------------------------------------
// Function: createOutputFile
// Purpose:  Create the Output stream file
// Input:    <fileSystem> file system object, <string> file name to be created
// Returns:  <boolean> true = success, false = failure
// --------------------------------------------------------------------------------------------------------------
function createOutputFile(fs, outputFile) {
  fs.open(outputFile, 'w', 666, (err) =>
    err ? console.error(err) : console.log('Output File Created.')
  );
}


// --------------------------------------------------------------------------------------------------------------
// Function: checkForReplaceData
// Purpose:  Check to see if the data has replacement markers 
// Input:    <string> data to check <int>start position 
// Returns:  <int> Less than zero=no replacement markers, Zero or greater=start of replacement marker   
// --------------------------------------------------------------------------------------------------------------
function checkForReplaceData(data) {
  return (data.search("%#") + 2);
}


// --------------------------------------------------------------------------------------------------------------
// Function: getReplaceDataName
// Purpose:  Get the name of the replacement data
// Input:    <string> data to check <int>start position 
// Returns:  <string> replaceDataName   
// --------------------------------------------------------------------------------------------------------------
function getReplaceDataName(data, strRd) {
  let replaceDataName = '';
  if (strRd >= 0) {  // has substitutions for this data record
    endRd = data.search("#%");
    if (endRd >= 0) {
      replaceDataName = data.substr(strRd, endRd - strRd);
    }
  }
  return replaceDataName;
}


// --------------------------------------------------------------------------------------------------------------
// Function: replaceData
// Purpose:  Replace data for any replacement markers. There can be multiple lines to write for this record.
// Input:    <string> data to replace data (if needed) 
// Returns:  [<string>] data with replacement values   
// --------------------------------------------------------------------------------------------------------------
function replaceData(data) {
  let loops = 0;
  let returnData = [];

  // Get first replacement field. The number of its answers will control number of records to write
  strRd = checkForReplaceData(data);
  if (strRd >= 2) {                   // has substitutions for this data record
    replaceDataName = getReplaceDataName(data, strRd);   // controlling place holder
    let x = placeholders.indexOf(replaceDataName);
    // Determine how many answers were entered for this place holder
    if (x >= 0) {
      let answers = allAnswers[x];
      if (answers === undefined) {
        loops = 1;
      } else {
        if (inqTypes[x] == 'list') {  // list answers break each letter of work into array
          loops = 1;
        } else {
          loops = answers.length;       // the amount of answers for this place holder will control how many records we write
        }
      }
    } else {                          // there is a place holder that didn't have a question with answers
      loops = 1;
    }

    // Now loop through for the number of lines to write and replace values
    for (let i = 0; i < loops; i++) {
      let newData = data;
      let hasMore = true;
      let myCount = 0;
      do {
        myCount++;
        if (myCount > 5) process.exit(1); // Doesn't support more than 5 substitutions per line
        strRd = checkForReplaceData(newData);
        if (strRd >= 2) {           // has substitutions for this data record
          replaceDataName = getReplaceDataName(newData, strRd);   // controlling place holder
          let x = placeholders.indexOf(replaceDataName);
          let answers = [];
          let answer;
          if (x >= 0) {
            if (inqTypes[x] == 'list') {
              // answers = allAnswers[x].toString();
              answers = allAnswers[x].toString();
            } else {
              answers = allAnswers[x];
            }
            if (answers === undefined) {
              answers = ["***********"];
            }
          } else {
            answers = ["***********"];
          }
          if (i >= loops) {  // We are on a record greater than the number of answers for this place holder
            answer = answers[0];  // Default to first answer
          } else {                    // We have an answer for this record
            if (inqTypes[x] == 'list') {
              answer = answers.toString();
            } else {
            answer = answers[i];
            }
          }
          newData = newData.replace('%#' + replaceDataName + '#%', answer);
        } else {
          hasMore = false;          // this will cause the function to quit looking for substitutions
        }
      } while (hasMore);
      returnData[i] = newData;
    }
  } else {
    returnData.push(data);          // No replacement data needed, so return the original data back in an array
  }

  return returnData;
}


// --------------------------------------------------------------------------------------------------------------
// Function: writeOutputFile
// Purpose:  Write to the Output stream file
// Input:    <fileSystem> file system object, <string> output file name
// Returns:  <> 
// --------------------------------------------------------------------------------------------------------------
async function writeOutputFile(fs, outputFile) {
  createOutputFile(fs, outputFile);

  for (let i = 0; i < linesOut.length; i++) {
    let data = linesOut[i] + "\r\n";     // Add line return
    let newData = replaceData(data);     // Get substituted data for any replacement markers
    for (let x = 0; x < newData.length; x++) {  // this record may have multipe values to write
      await fs.appendFile(outputFile, newData[x]);
    }
  }
}


module.exports = { processTemplate, askQuestions, writeOutputFile };