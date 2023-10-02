const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('database.db')
const { open } = require('sqlite')

async function openDb() {
  return open({
    filename: 'database.sqlite',
    driver: sqlite3.Database,
  })
}

module.exports = openDb
