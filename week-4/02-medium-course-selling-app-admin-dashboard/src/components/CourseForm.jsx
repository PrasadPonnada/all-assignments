/* eslint-disable react/prop-types */

function CourseForm({
  title,
  setTitle,
  description,
  setDescription,
  price,
  setPrice,
  isPublished,
  setIsPublished,
  saveCourse,
}) {
  return (
    <div>
      <label>Title</label> <br />
      <input
        type={'text'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <label>Description</label> <br />
      <input
        type={'text'}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <label>Price</label> <br />
      <input
        type={'number'}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br />
      <input
        type={'checkbox'}
        checked={isPublished}
        onChange={() => {
          setIsPublished(!isPublished);
        }}
      />
      <label>Is Published</label>
      <br />
      <br />
      <button onClick={saveCourse}>Save</button>
    </div>
  );
}
export default CourseForm;
