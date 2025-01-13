import PropTypes from 'prop-types';
import Book from './Book';
import { Link } from 'react-router-dom';

const Search = ({ books, handleInputChange, handleAddNewBookToShelf }) => {
  return (
    <div className='app'>
      <div className='search-books'>
        <div className='search-books-bar'>
          <Link to='/' className='close-search'>
            Close
          </Link>
          <div className='search-books-input-wrapper'>
            <input
              type='text'
              placeholder='Search by title, author, or ISBN'
              autoFocus
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='search-books-results'>
          <ol className='books-grid'>
            {books &&
              books.map((book) => (
                <li key={book.id}>
                  <Book
                    id={book.id}
                    title={book.title}
                    authors={book.authors}
                    coverImageUrl={book.imageLinks.smallThumbnail}
                    shelf={book.shelf}
                    onShelfChangeRequest={handleAddNewBookToShelf}
                  />
                </li>
              ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

Search.propTypes = {
  books: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleAddNewBookToShelf: PropTypes.func.isRequired,
};

export default Search;
