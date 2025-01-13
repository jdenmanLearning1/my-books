import PropTypes from 'prop-types';
import Shelves from '../enums/Shelves';
import Shelf from './Shelf';
import { Link } from 'react-router-dom';

const MyShelves = ({ books, handleExistingBookShelfChange }) => {
  return (
    <div className='app'>
      <div className='list-books'>
        <div className='list-books-title'>
          <h1>MyReads</h1>
        </div>
        <div className='list-books-content'>
          <div>
            <Shelf
              title='Currently Reading'
              name={Shelves.CurrentlyReading}
              books={books}
              onShelfChangeRequest={handleExistingBookShelfChange}
            />
            <Shelf
              title='Want To Read'
              name={Shelves.WantToRead}
              books={books}
              onShelfChangeRequest={handleExistingBookShelfChange}
            />
            <Shelf
              title='Read'
              name={Shelves.Read}
              books={books}
              onShelfChangeRequest={handleExistingBookShelfChange}
            />
          </div>
        </div>
        <div className='open-search'>
          <Link to='/search'>Add a book</Link>
        </div>
      </div>
    </div>
  );
};

MyShelves.propTypes = {
  books: PropTypes.array,
  handleExistingBookShelfChange: PropTypes.func.isRequired,
};

export default MyShelves;
