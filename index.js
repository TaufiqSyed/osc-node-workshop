const express = require('express')
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const openDb = require('./db/openDb')
const initializeTables = require('./db/initializeTables')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

initializeTables()

let db
openDb().then((e) => {
  db = e
})

// Create User
app.post('/users', async (req, res) => {
  const { username } = req.body
  const { lastID } = await db.run('INSERT INTO users (username) VALUES (?)', [
    username,
  ])
  res.status(201).json({ id: lastID, username })
})

// Create Recipe
app.post('/recipes', async (req, res) => {
  const { title, ingredients, instructions, imageUrl } = req.body
  console.log('title ' + title)
  console.log('ingredients ' + ingredients)
  console.log('instructions ' + instructions)
  console.log('imageUrl ' + imageUrl)
  const user_id = 1 // assuming no auth on client
  const { lastID } = await db.run(
    'INSERT INTO recipes (title, ingredients, instructions, imageUrl, user_id) VALUES (?, ?, ?, ?, ?)',
    [title, ingredients, instructions, imageUrl, user_id]
  )
  res
    .status(201)
    .json({ id: lastID, title, ingredients, instructions, user_id })
})

// Get all recipes
app.get('/recipes', async (req, res) => {
  const recipes = await db.all('SELECT * FROM recipes')
  res.json(recipes)
})

// Update Recipe by ID
app.put('/recipes/:id', async (req, res) => {
  const { title, ingredients, instructions } = req.body
  const { id } = req.params
  await db.run(
    'UPDATE recipes SET title = ?, ingredients = ?, instructions = ? WHERE id = ?',
    [title, ingredients, instructions, id]
  )
  res.json({ id, title, ingredients, instructions })
})

// Get Recipe by ID
app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params
  const recipe = await db.get('SELECT * FROM recipes WHERE id = ?', [id])
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' })
  }
  res.json(recipe)
})

// Delete Recipe by ID
app.delete('/recipes/:id', async (req, res) => {
  const { id } = req.params
  await db.run('DELETE FROM recipes WHERE id = ?', [id])
  res.json({ message: 'Recipe deleted successfully' })
})

// Get all recipes for a user
app.get('/users/:userId/recipes', async (req, res) => {
  const { userId } = req.params
  const recipes = await db.all('SELECT * FROM recipes WHERE user_id = ?', [
    userId,
  ])
  res.json(recipes)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
