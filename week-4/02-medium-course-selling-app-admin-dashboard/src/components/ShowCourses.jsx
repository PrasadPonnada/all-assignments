import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ShowCourses() {
  const [courses, setCourses] = React.useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getCourses = async () => {
      const response = await axios.get('http://localhost:3000/admin/courses', {
        headers: {
          Authorization: 'bearer ' + localStorage.getItem('token'),
        },
      });
      setCourses(response.data.courses);
    };
    getCourses();
  }, []);

  function navToEditCourse(id) {
    navigate(`/courses/${id}`, { relative: 'path' });
  }

  // Add code to fetch courses from the server
  // and set it in the courses state variable.
  return (
    <div>
      <h1>All Courses </h1>
      <button onClick={() => navigate('/about', { relative: 'path' })}>
        Create Course
      </button>
      {courses.map((c) => (
        <Course course={c} key={c.id} navToEditCourse={navToEditCourse} />
      ))}
    </div>
  );
}

function Course(props) {
  return (
    <div style={{ backgroundColor: 'lightcoral ' }}>
      <br />
      <b>Title: {props.course.title}</b>
      <br />
      <b>Description: {props.course.description}</b>
      <br />
      <b>Price: {props.course.price}</b>
      <br />
      <b>IsPublished: {props.course.isPublished.toString()}</b>
      <br />
      <button onClick={props.navToEditCourse.bind(this, props.course.id)}>
        Edit
      </button>
    </div>
  );
}

export default ShowCourses;
