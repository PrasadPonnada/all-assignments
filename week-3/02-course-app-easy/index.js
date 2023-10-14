const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { v4: uuidv4, stringify } = require('uuid');
const app = express();
const adminSecretkey = 'adminkey';
const userSecretkey = 'userkey';
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

//Define Mongoose Schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  prince: Number,
  imageLink: String,
  published: Boolean,
});

//Define Mongoose Models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

//Connect MongooseDb
mongoose.connect(
  'mongodb+srv://Dp:Prasad%400637@cluster0.0klnzg4.mongodb.net/'
);

const createAdminjwtToken = (payload) => {
  var token = jwt.sign(payload, adminSecretkey, { expiresIn: '1h' });
  return token;
};

const createUserjwtToken = (payload) => {
  var token = jwt.sign(payload, userSecretkey);
  return token;
};

const authenticateAdminJwt = (req, res, next) => {
  const jwtToken = req.headers.authorization.split(' ')[1];
  jwt.verify(jwtToken, adminSecretkey, (err, decoded) => {
    if (err) {
      res.status(403).send({ message: 'Admin authentication failed' });
    } else {
      next();
    }
  });
};

const authenticateUserJwt = (req, res, next) => {
  const jwtToken = req.headers.authorization.split(' ')[1];
  jwt.verify(jwtToken, userSecretkey, (err, decoded) => {
    if (err) {
      res.status(403).send({ message: 'Admin authentication failed' });
    } else {
      req.user = decoded.username;
      next();
    }
  });
};

// Admin routes
app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;
  const isAdminExists = await Admin.findOne({ username, password });
  if (isAdminExists) {
    res.json({ message: 'Admin already exists' });
  } else {
    const admin = new Admin({ username, password });
    await admin.save();
    const token = createAdminjwtToken({ id: admin.username });
    res.json({ message: 'Admin created successfully', token: token });
  }
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = createAdminjwtToken({ id: admin.id });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).send({ message: 'Admin Authentication failed' });
  }
});

app.post('/admin/courses', authenticateAdminJwt, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.send({
    message: 'Course created successfully',
    courseId: course.id,
  });
});

app.put('/admin/courses/:courseId', authenticateAdminJwt, async (req, res) => {
  const courseId = req.params.courseId;
  let course = await Course.findByIdAndUpdate(courseId, req.body, {
    new: true,
  });
  if (course) {
    res.send('Course updated successfully');
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateAdminJwt, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.json({ courses });
});

// User routes
app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.json({ message: 'User already exists' });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = createUserjwtToken({ username: user.username });
    res.json({ message: 'User created successfully', token: token });
  }
});

app.post('/users/login', async (req, res) => {
  const { username, password } = req.headers;
  const userInfo = await User.findOne({ username, password });
  if (userInfo) {
    const token = createUserjwtToken({ username });
    res.send({ message: 'Logged in successfully', token: token });
  } else {
    res.status(404).send({ message: 'User Authentication failed' });
  }
});

app.get('/users/courses', authenticateUserJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

app.post('/users/courses/:courseId', authenticateUserJwt, async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (course) {
    console.log(req);
    const user = await User.findOne({ username: req.user });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
    } else {
      res.status(404).json({ message: 'User Not Found' });
    }
    res.send('Course purchased successfully');
  } else {
    res.status(404).json({ message: 'Course Does Not Exists' });
  }
});

app.get('/users/purchasedCourses', authenticateUserJwt, async (req, res) => {
  // logic to view purchased courses
  let user = await User.findOne({ username: req.user }).populate(
    'purchasedCourses'
  );
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(404).json({ message: 'Course Does Not Exists' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
