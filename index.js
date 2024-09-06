const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/scheduler', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  email: String,
  availability: [
    {
      day: String,
      slots: [{ start: Date, end: Date }],
    },
  ],
});
const User = mongoose.model('User', UserSchema);

app.post('/api/login', async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, availability: [] });
    await user.save();
  }
  res.json(user);
});

app.get('/api/users/:email/availability', async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  res.json(user.availability);
});

app.post('/api/availability', async (req, res) => {
  const { email, day, start, end } = req.body;
  const user = await User.findOne({ email });
  user.availability.push({ day, slots: [{ start, end }] });
  await user.save();
  res.json(user.availability);
});

app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post('/api/schedule', async (req, res) => {
  res.json({ message: 'Session scheduled' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
