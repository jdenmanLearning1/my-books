/* eslint-disable jsx-a11y/anchor-is-valid */
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MyShelves from './components/MyShelves';
import Search from './components/Search';
import Shelves from './enums/Shelves';
import { getAll, search, update } from './BooksAPI';
import { debounce } from 'lodash';

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    reloadBooks();
  }, []);

  const reloadBooks = async () => {
    let userBooks = await getAll();
    setBooks(userBooks);
  };

  const addNewBookToShelf = async ({ id, targetShelf }) => {
    let bookToAdd = searchResults.find((book) => book.id === id);
    bookToAdd.shelf = targetShelf;

    await update(bookToAdd, targetShelf);
    reloadBooks();
  };

  const handleExistingBookShelfChange = async ({ id, newShelf }) => {
    const existingBookIndex = books.findIndex((item) => item.id === id);

    var newBooks = [...books];

    if (newBooks[existingBookIndex].shelf === Shelves.None)
      setBooks(newBooks.filter((book) => book.id !== id));
    else newBooks[existingBookIndex].shelf = newShelf;

    await update(newBooks[existingBookIndex], newShelf);

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

  const handleSearchInputChange = (event) => {
    debouncedSearchRequest(event.target.value.trim());
  };

  return (
    <Routes>
      <Route
        exact
        path='/'
        element={
          <MyShelves
            books={books}
            handleExistingBookShelfChange={handleExistingBookShelfChange}
          />
        }
      />
      <Route
        exact
        path='/search'
        element={
          <Search
            books={searchResults}
            handleInputChange={handleSearchInputChange}
            handleAddNewBookToShelf={addNewBookToShelf}
          />
        }
      />
    </Routes>
  );
}

export default App;
