const axios = require('axios');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DB_URL = 'http://admin:password@database:5984/survey-universe';
const VIEWS_FILE = '/shared/data/database-views.json';
const DATA_FILE = '/shared/data/database-data.json';

const getData = (filepath) => {
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }
  } catch (e) { 
    console.error(`Error reading file ${filepath}`); 
  }
  return [];
};

const writeLocal = (docWithRev, localData) => {
  const index = localData.findIndex(doc => doc._id === docWithRev._id);
  if (index !== -1) {
    localData[index] = docWithRev;
  } else {
    localData.push(docWithRev);
  }
  return localData;
};

(async function watchChanges() {
  try {
    console.log('Connecting to CouchDB...');
    
    const response = await axios({
      method: 'get',
      url: `${DB_URL}/_changes?feed=continuous&include_docs=true`,
      responseType: 'stream'
    });

    const lineReader = readline.createInterface({ input: response.data, terminal: false });
    lineReader.on('line', (line) => {
      if (!line.trim()) return;

      try {
        const change = JSON.parse(line);

        if (!change.id || change.deleted || !change.doc) return;
        const docWithRev = change.doc;
        const filepath = change.id.startsWith('_design/') ? VIEWS_FILE : DATA_FILE;

        const currentData = getData(filepath);
        const updatedData = writeLocal(docWithRev, currentData);
        
        fs.writeFileSync(filepath, JSON.stringify(updatedData, null, 2), 'utf8');
        console.log(`[Sync] Updated: ${change.id} -> ${path.basename(filepath)}`);
      } catch (parseError) {
        console.error('Error while parsing a string:', parseError.message);
      }
    });

    response.data.on('end', () => {
      console.warn('Stream ended. Reconnecting...');
      setTimeout(watchChanges, 5000);
    });

  } catch (error) {
    console.error('CouchDB error, attempting reconnection in 5 seconds...');
    setTimeout(watchChanges, 5000);
  }
})();
