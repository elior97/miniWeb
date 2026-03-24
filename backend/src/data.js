const fs = require('fs');
const path = require('path');

// Path to the JSON file that stores all our data
const DATA_FILE = path.join(__dirname, '..', 'data', 'state.json');

// The starting state written to the file on first run
const DEFAULT_STATE = {
  statuses: [],
  transitions: []
};

// Read and return the current data from state.json.
// If the file does not exist yet, create it with the default state first.
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    // Make sure the data/ folder exists
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    // Write the default state so the file is never missing again
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STATE, null, 2));
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

// Write obj back to state.json, pretty-printed so it is easy to read.
function writeData(obj) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2));
}

module.exports = { readData, writeData };
