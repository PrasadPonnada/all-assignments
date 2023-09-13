const express = require('express');
const jwt = require('jsonwebtoken');

const { v4: uuidv4 } = require('uuid');
const app = express();
const adminSecretkey = 'adminkey';
const userSecretkey = 'userkey';
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

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
      console.log('username', decoded);
      req.user = decoded.username;
      next();
    }
  });
};
// Admin routes
app.post('/admin/signup', (req, res) => {
  const { username, password } = req.body;
  const isAdminExists = ADMINS.find(
    (item) => item.username === username && item.password === password
  );
  if (isAdminExists) {
    res.json({ message: 'Admin already exists' });
  } else {
    const adminUser = {
      username,
      password,
      id: uuidv4(),
    };
    ADMINS.push(adminUser);
    const token = createAdminjwtToken({ id: adminUser.id });
    res.json({ message: 'Admin created successfully', token: token });
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );
  if (admin) {
    const token = createAdminjwtToken({ id: admin.id });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).send({ message: 'Admin Authentication failed' });
  }
});

app.post('/admin/courses', authenticateAdminJwt, (req, res) => {
  const course = req.body;
  course.id = uuidv4();
  COURSES.push(course);
  res.send({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateAdminJwt, (req, res) => {
  const courseId = req.params.courseId;
  let course = COURSES.find((course) => course.id === courseId);
  if (course) {
    Object.assign(course, req.body);
    console.log(COURSES);
    res.send('Course updated successfully');
  } else {
    res.send('Course Not Found!');
  }
});

app.get('/admin/courses', authenticateAdminJwt, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = { ...req.body, courses: [] };
  const isUserExists = USERS.find(
    (item) => item.username === user.username && item.password === user.password
  );
  if (isUserExists) {
    res.json({ message: 'User already exists' });
  } else {
    console.log(user);
    USERS.push(user);
    const token = createUserjwtToken({ username: user.username });
    res.json({ message: 'User created successfully', token: token });
  }
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.headers;
  const userInfo = USERS.find(
    (user) => user.username === username && user.password === password
  );
  if (userInfo) {
    const token = createUserjwtToken({ username: userInfo.username });
    res.send({ message: 'Logged in successfully', token: token });
  } else {
    res.status(404).send({ message: 'User Authentication failed' });
  }
});

app.get('/users/courses', authenticateUserJwt, (req, res) => {
  // logic to list all courses
  res.send({ courses: COURSES.filter((course) => course.published) });
});

app.post('/users/courses/:courseId', authenticateUserJwt, (req, res) => {
  const courseId = req.params.courseId;
  const isValidCourse = COURSES.some(
    (item) => item.id === courseId && item.published
  );
  if (isValidCourse) {
    let user = USERS.find((item) => item.username === req.user);
    console.log('start');
    console.log(req.user.username);
    console.log(user);
    console.log('end');
    user.courses.push(courseId);
    res.send('Course purchased successfully');
  } else {
    res.send('Course Does Not Exists');
  }
});

app.get('/users/purchasedCourses', authenticateUserJwt, (req, res) => {
  // logic to view purchased courses
  let user = USERS.find((item) => item.username === req.user);
  let courses = COURSES.filter((item) => user.courses.includes(item.id));
  res.send({ purchasedCourses: courses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
