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
    await db.exec(`
    INSERT INTO users (username)
    VALUES
      ("John Doe");
  `)
    // Create 'recipes' table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `)

    await db.exec(`
    INSERT INTO recipes (title, imageUrl, ingredients, instructions, user_id)
    VALUES
      ("Vietnamese Pho", "https://www.recipetineats.com/wp-content/uploads/2019/04/Beef-Pho_6.jpg","2 large onions;150g ginger;3lb brisket;2lb marrow bones", "Remove impurities from beef with a 5 minute boil;Scum be amazed at all the icky stuff that comes out;Wash the bones to get all the icky scum off;Simmer for 3 hours – bones, beef, water, onion, ginger and spices (cinnamon, cardamom, coriander, star anise);Remove brisket so that it can be used as a topping", 1);
  `)

    console.log('Database tables initialized successfully.')
  } catch (error) {
    console.error('Error initializing database tables:', error.message)
  }
}

module.exports = initializeTables
