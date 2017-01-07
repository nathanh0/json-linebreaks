/**
 * json-linebreaks
 * @version 0.0.1
 *
 * @description Add line breaks to arrays containing multiple rows.
 *              This will not prettify your JSON.
 *              Primarily used for files with 1,000 or more records
 *
 * @example     node json-linebreaks.js --input ./test-read.json --output ./test-save.json
 */

const version = '0.0.1';
const clientArgs = require('command-line-args');
const clientDefs = [
    { name: 'input', type: String },
    { name: 'output', type: String },
    { name: 'write-input', type: Boolean },
    { name: 'console', type: Boolean },
    { name: 'version', type: Boolean },
    { name: 'help', type: Boolean }
];
const options = clientArgs(clientDefs);
const getUsage = require('command-line-usage');
const sections = [
    {
        header: 'json-linebreaks '+version,
        content: 'Injects line breaks to JSON string },{ to allow for streaming large JSON files.'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'input',
                typeLabel: '[underline]{file}',
                description: 'The JSON file to read: ./test-read.json'
            },
            {
                name: 'output',
                typeLabel: '[underline]{file}',
                description: 'The file to save to: ./test-save.json'
            },
            {
                name: 'write-input',
                typeLabel: '',
                description: 'Outputs result to the --input file.'
            },
            {
                name: 'console',
                typeLabel: '',
                description: 'Outputs result to the console.'
            },
            {
                name: 'version',
                description: 'Print the current version of json-linebreaks.'
            },
            {
                name: 'help',
                description: 'Print this usage guide.'
            }
        ]
    },
    {
        header: 'Synopsis',
        content: [
            '$ node json-linebreaks [[bold]{--input} [underline]{file}] [bold]{--output} [underline]{file}',
            '$ node json-linebreaks [[bold]{--input} [underline]{file}] --write-input',
            '$ node json-linebreaks [[bold]{--input} [underline]{file}] --console',
            '$ node json-linebreaks [bold]{--version}',
            '$ node json-linebreaks [bold]{--help}'
        ]
    }
]
const usage = getUsage(sections);

/*******************************************************************
 *******************************************************************
 *******************************************************************/

/**
 * These two variables are the primary use of this entire script.
 * A string is found (regex) => It is replaced with the same string injected with a line break.
 */
const findString    = '\}\,\{';
const replaceString = '}'+"\n"+',{';

var fs = require('fs')
    , inFile = options['input']
    , outFile = options['output']
    , consoleOut = (options['console'] ? true : false )
    , overwriteInFile = (options['write-input'] ? true : false)
    , getVersion = (options['version'] ? true : false)
    , getHelp = (options['help'] ? true : false)
    , ready = true;

if ( getVersion )
{
    console.log(version);
    return;
}

if ( getHelp )
{
    console.log(usage);
    return;
}

if (inFile == undefined || (outFile == undefined && ! consoleOut && ! overwriteInFile) ) {
    ready = false;
}

if (!ready) {
    console.log(usage);
}

if (ready) {
    var data = require(inFile);
    var dataOut = JSON.stringify(data).replace(new RegExp(findString, 'g'), replaceString);

    if ( consoleOut )
    {
        console.log(dataOut);
    }
    else
    {
        fs.writeFile(outFile, dataOut, function (err) {
            if (err) {
                console.log("Failed to write to output file: " + err);
                return false;
            }
            console.log("File saved: " + outFile);
            return true;
        });
    }
}
