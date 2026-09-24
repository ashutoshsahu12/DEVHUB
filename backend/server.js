const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'devhub_super_secret_key_2026';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://DEVHUB:devhub_project@cluster0.s2t9ox9.mongodb.net/?appName=Cluster0';

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// --- Mongoose Schemas & Models ---

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const bookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // 'repo' or 'user'
  itemId: { type: String, required: true },
  title: { type: String, required: true },
  owner: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

// --- Auth Routes ---

// Check Username Availability Route
app.get('/api/auth/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ available: false });
    }
    res.json({ available: true });
  } catch (err) {
    console.error('Check username error:', err);
    res.status(500).json({ error: 'Server error checking username.' });
  }
});

// Check Email Availability Route
app.get('/api/auth/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ available: false });
    }
    res.json({ available: true });
  } catch (err) {
    console.error('Check email error:', err);
    res.status(500).json({ error: 'Server error checking email.' });
  }
});

// Register Route
app.post('/api/auth/register', async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already exists.' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already exists.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Account created successfully. Please sign in.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Login Route (Make sure 'email' is included in the user object)
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        username: user.username, 
        email: user.email // <--- This ensures the email is sent
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// --- Middleware for Protected Routes ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

// --- Bookmark Routes ---

app.get('/api/bookmarks', verifyToken, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks.' });
  }
});

app.post('/api/bookmarks', verifyToken, async (req, res) => {
  const { type, itemId, title, owner, description, url } = req.body;
  try {
    const newBookmark = new Bookmark({
      userId: req.user.id,
      type,
      itemId,
      title,
      owner,
      description,
      url
    });
    await newBookmark.save();
    res.status(201).json({ id: newBookmark._id, message: 'Bookmark saved successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save bookmark.' });
  }
});

app.delete('/api/bookmarks/:itemId', verifyToken, async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ userId: req.user.id, itemId: req.params.itemId });
    res.json({ message: 'Bookmark removed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove bookmark.' });
  }
});

app.listen(PORT, () => {
  console.log(`DevHub MongoDB Backend running on https://devhub-backend-lpen.onrender.com:${PORT}`);
});