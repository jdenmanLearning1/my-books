import Shelves from "../enums/Shelves";
import PropTypes from "prop-types";

const Book = ({
  id,
  title,
  authors,
  coverImageUrl,
  shelf,
  onShelfChangeRequest,
}) => {
  const handleChange = (event) => {
    onShelfChangeRequest({ id: id, targetShelf: event.target.value });
  };

  return (
    <div className='book'>
      <div className='book-top'>
        <div
          className='book-cover'
          style={{
            width: 128,
            height: 193,
            backgroundImage: `url(${coverImageUrl})`,
          }}
        ></div>
        <div className='book-shelf-changer'>
          <select defaultValue={shelf ?? Shelves.None} onChange={handleChange}>
            <option value={Shelves.None} disabled>
              Move to...
            </option>
            <option value={Shelves.CurrentlyReading}>Currently Reading</option>
            <option value={Shelves.WantToRead}>Want To Read</option>
            <option value={Shelves.Read}>Read</option>
            <option value={Shelves.None}>None</option>
          </select>
        </div>
      </div>
      <div className='book-title'>{title}</div>
      {authors &&
        authors.map((author) => (
          <div key={author} className='book-authors'>
            {author}
          </div>
        ))}
    </div>
  );
};

Book.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  authors: PropTypes.array.isRequired,
  coverImageUrl: PropTypes.string.isRequired,
  shelf: PropTypes.string,
  onShelfChangeRequest: PropTypes.func.isRequired,
};

export default Book;
