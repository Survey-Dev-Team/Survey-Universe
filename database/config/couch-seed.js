const axios = require('axios');
const fs = require('fs');

const DB_URL = 'http://admin:password@database:5984/survey-universe';
const BASE_URL = 'http://admin:password@database:5984';
const SEED_FILE = '/shared/data/database-seed.json';
const VIEWS_FILE = '/shared/data/database-views.json';

const INDEXES = [
  { name: 'idx-root-deleted',     fields: ['root_type', 'is_deleted'] },
  { name: 'idx-root-email',       fields: ['root_type', 'email'] },
  { name: 'idx-root-creator',     fields: ['root_type', 'creator_id', 'is_deleted'] },
  { name: 'idx-root-home',        fields: ['root_type', 'is_home', 'is_deleted'] },
  { name: 'idx-root-status',      fields: ['root_type', 'status', 'is_deleted'] },
  { name: 'idx-root-type-status', fields: ['root_type', 'survey_type', 'status', 'is_deleted'] },
  { name: 'idx-response-survey',  fields: ['root_type', 'survey_id'] },
  { name: 'idx-response-user',    fields: ['root_type', 'respondent_id'] },
  { name: 'idx-token',            fields: ['root_type', 'token'] },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForCouchDB() {
  console.log('Waiting for CouchDB...');
  for (let i = 0; i < 30; i++) {
    try {
      await axios.get(BASE_URL + '/_up');
      console.log('CouchDB is ready.');
      return;
    } catch {
      await sleep(2000);
    }
  }
  throw new Error('CouchDB did not become ready in time');
}

async function createDatabase() {
  try {
    await axios.put(DB_URL);
    console.log('Database created.');
  } catch (e) {
    if (e.response && e.response.status === 412) {
      console.log('Database already exists.');
    } else {
      throw e;
    }
  }
}

async function upsertDesignDocs() {
  if (!fs.existsSync(VIEWS_FILE)) {
    console.log('No views file found, skipping design docs.');
    return;
  }
  const designDocs = JSON.parse(fs.readFileSync(VIEWS_FILE, 'utf8'));
  for (const doc of designDocs) {
    const id = doc._id;
    try {
      const existing = await axios.get(`${DB_URL}/${encodeURIComponent(id)}`);
      doc._rev = existing.data._rev;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        delete doc._rev;
      } else {
        throw e;
      }
    }
    await axios.put(`${DB_URL}/${encodeURIComponent(id)}`, doc);
    console.log(`Design doc upserted: ${id}`);
  }
}

async function createIndexes() {
  for (const idx of INDEXES) {
    try {
      await axios.post(`${DB_URL}/_index`, {
        index: { fields: idx.fields },
        name: idx.name,
        type: 'json',
      });
      console.log(`Index created: ${idx.name}`);
    } catch (e) {
      console.error(`Failed to create index ${idx.name}:`, e.response?.data || e.message);
    }
  }
}

async function seedDocuments() {
  if (!fs.existsSync(SEED_FILE)) {
    console.log('No seed file found, skipping.');
    return;
  }
  const docs = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
  const result = await axios.post(`${DB_URL}/_bulk_docs`, { docs, new_edits: true });

  let inserted = 0;
  let skipped = 0;
  for (const r of result.data) {
    if (r.error === 'conflict') {
      skipped++;
    } else if (r.ok) {
      inserted++;
    } else {
      console.error(`Failed to insert ${r.id}: ${r.error} — ${r.reason}`);
    }
  }
  console.log(`Seed complete: ${inserted} inserted, ${skipped} already existed.`);
}

(async function main() {
  try {
    await waitForCouchDB();
    await createDatabase();
    await upsertDesignDocs();
    await createIndexes();
    await seedDocuments();
    console.log('Seeding finished successfully.');
  } catch (e) {
    console.error('Seeding failed:', e.message);
    process.exit(1);
  }
})();
