import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CourseForm from './CourseForm';
/// You need to add input boxes to take input for users to create a course.
/// I've added one input so you understand the api to do it.
function CreateCourse() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [isPublished, setIsPublished] = React.useState(false);
  const navigate = useNavigate();

  async function saveCourse() {
    try {
      await axios.post(
        'http://localhost:3000/admin/courses',
        {
          title,
          description,
          price,
          isPublished,
        },
        {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      navigate('/courses', { relative: 'path' });
    } catch (error) {
      console.log(error);
      alert(error.response.data.message || error.message);
    }
  }

  return (
    <div>
      <h1>Create Course Page</h1>
      <CourseForm
        title={title}
        description={description}
        price={price}
        isPublished={isPublished}
        setTitle={setTitle}
        setDescription={setDescription}
        setPrice={setPrice}
        setIsPublished={setIsPublished}
        saveCourse={saveCourse}
      />
    </div>
  );
}
export default CreateCourse;
