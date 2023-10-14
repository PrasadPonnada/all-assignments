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
        <Course
          key={c.id}
          id={c.id}
          title={c.title}
          description={c.description}
          price={c.price}
          isPublished={c.isPublished}
          navToEditCourse={navToEditCourse}
        />
      ))}
    </div>
  );
}

function Course(props) {
  return (
    <div>
      <br />
      <b>Title: {props.title}</b>
      <br />
      <b>Description: {props.description}</b>
      <br />
      <b>Price: {props.price}</b>
      <br />
      <b>IsPublished: {props.isPublished.toString()}</b>
      <br />
      <button onClick={props.navToEditCourse.bind(this, props.id)}>Edit</button>
    </div>
  );
}

export default ShowCourses;
