/* eslint-disable jsx-a11y/anchor-is-valid */
import './App.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Shelves from './enums/Shelves';
import Shelf from './components/Shelf';
import { get, getAll, search, update } from './BooksAPI';
import Book from './components/Book';
import { debounce } from 'lodash';

function App() {
  const [showSearchPage, setShowSearchpage] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const loadUserBooks = async () => {
      setBooks(await getAll());
    };

    loadUserBooks();
    console.log(books);
  }, []);

  const reloadBooks = async () => {
    let userBooks = await getAll();
    console.log('reloaded books', userBooks);
    setBooks(userBooks);
  };

  const addNewBookToShelf = async ({ id, targetShelf }) => {
    let bookToAdd = searchResults.find((book) => book.id === id);
    bookToAdd.shelf = targetShelf;

    await update(bookToAdd, targetShelf);
    console.log('Added', bookToAdd.title);
    //setBooks(newBooks);
    reloadBooks();
  };

  const handleExistingBookShelfChange = async ({ id, newShelf }) => {
    const existingBookIndex = books.findIndex((item) => item.id === id);

    var newBooks = [...books];

    if (newBooks[existingBookIndex].shelf === Shelves.None)
      setBooks(newBooks.filter((book) => book.id !== id));
    else newBooks[existingBookIndex].shelf = newShelf;

    await update(newBooks[existingBookIndex], newShelf);
    //setBooks(newBooks);

    reloadBooks();
  };

  const debouncedSearchRequest = debounce(async (searchTerm) => {
    if (searchTerm.length === 0) {
      setSearchResults(null);
      return;
    }

    let res = await search(searchTerm);

    if (res.length !== undefined) {
      let validData = res.filter(
        (book) =>
          book.authors !== undefined &&
          book.imageLinks !== undefined &&
          book.imageLinks.smallThumbnail !== undefined
      );

      validData.forEach((book, index) => {
        let userBook = books.find((thisBook) => book.id === thisBook.id);
        if (userBook) {
          book.shelf = userBook.shelf;
        }
      });

      setSearchResults(validData);
    } else {
      setSearchResults(null);
    }
  }, 500);

  const handleInputChange = (event) => {
    debouncedSearchRequest(event.target.value.trim());
  };

  return (
    <div className='app'>
      {showSearchPage ? (
        <div className='search-books'>
          <div className='search-books-bar'>
            <Link to='/search'>Close</Link>
            {/* <a
              className='close-search'
              onClick={() => {
                setSearchResults(null);
                setShowSearchpage(!showSearchPage);
              }}
            >
              Close
            </a> */}
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
              {searchResults &&
                searchResults.map((book) => (
                  <li key={book.id}>
                    <Book
                      id={book.id}
                      title={book.title}
                      author={book.authors}
                      coverImageUrl={book.imageLinks.smallThumbnail}
                      shelf={book.shelf}
                      onShelfChangeRequest={addNewBookToShelf}
                    />
                  </li>
                ))}
            </ol>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default App;
