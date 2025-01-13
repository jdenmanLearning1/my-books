import { useEffect, useState } from 'react';
import Book from './Book';
import PropTypes from 'prop-types';

const Shelf = ({ title, name, books, onShelfChangeRequest }) => {
  const [shelfBooks, setShelfBooks] = useState([]);

  const handleShelfChangeRequest = ({ id, targetShelf }) => {
    onShelfChangeRequest({ id: id, newShelf: targetShelf });
  };

  useEffect(() => {
    setShelfBooks(books.filter((book) => book.shelf === name));
  }, [name, books]);

  return (
    <div className='bookshelf'>
      <h2 className='bookshelf-title'>{title}</h2>
      <div className='bookshelf-books'>
        <ol className='books-grid'>
          {shelfBooks &&
            shelfBooks.map((book) => (
              <li key={book.id}>
                <Book
                  id={book.id}
                  title={book.title}
                  authors={book.authors}
                  coverImageUrl={book.imageLinks.smallThumbnail}
                  shelf={book.shelf}
                  onShelfChangeRequest={handleShelfChangeRequest}
                />
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
};

Shelf.propTypes = {
  name: PropTypes.string.isRequired,
  books: PropTypes.array,
  onShelfChangeRequest: PropTypes.func.isRequired,
};

export default Shelf;
