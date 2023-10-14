import axios from 'axios';
import React, { useEffect } from 'react';
import CourseForm from './CourseForm';
import { useNavigate, useParams } from 'react-router-dom';

function EditCourse() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [isPublished, setIsPublished] = React.useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getCourse = async () => {
      const response = await axios.get('http://localhost:3000/admin/courses', {
        headers: {
          Authorization: 'bearer ' + localStorage.getItem('token'),
        },
      });
      const course = response.data.courses.find(
        (x) => x.id === parseInt(params.id)
      );
      setTitle(course.title);
      setDescription(course.description);
      setPrice(course.price);
      setIsPublished(course.isPublished);
    };
    getCourse();
  }, [params.id]);

  async function updateCourse() {
    await axios.put(
      `http://localhost:3000/admin/courses/${params.id}`,
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
  }
  return (
    <div>
      <h1>Edit Course</h1>
      <CourseForm
        title={title}
        description={description}
        price={price}
        isPublished={isPublished}
        setTitle={setTitle}
        setDescription={setDescription}
        setPrice={setPrice}
        setIsPublished={setIsPublished}
        saveCourse={updateCourse}
      />
    </div>
  );
}

export default EditCourse;
