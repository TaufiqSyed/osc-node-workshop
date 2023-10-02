const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const openDb = require('./openDb')

const initializeTables = async () => {
  try {
    const db = await openDb()
    await db.exec('DROP TABLE IF EXISTS users')
    await db.exec('DROP TABLE IF EXISTS recipes')
    // Create 'users' table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL
      )
    `)

    // Create 'recipes' table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `)

    console.log('Database tables initialized successfully.')
  } catch (error) {
    console.error('Error initializing database tables:', error.message)
  }
}

module.exports = initializeTables
