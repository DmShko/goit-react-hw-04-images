import { useState } from 'react';

import { ReactComponent as IconMenu } from '../images/search-com.svg';

import search from './Searchbar.module.css';

export const Searchbar = ({ onSubmit }) => {

  const [ inputState, setInputValue ] = useState({ inputValue: '',});

  const changeInput = evt => {
    setInputValue({ inputValue: evt.target.value });
  };

  const formSubmit = evt => {
    evt.preventDefault();
    onSubmit('pageCounter', 0);
    if (inputState.inputValue.length !== 0)
      onSubmit('inputData', inputState.inputValue);
  };

  return (
    <header className={search.searchbar}>
      <form className={search.form} onSubmit={formSubmit}>
        <button type="submit" className={search.button}>
          <IconMenu className={search.icon} width="25px" height="25px"/>
        </button>

        <input
          value={inputState.inputValue}
          className={search.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={changeInput}
        />
      </form>
    </header>
  );
}
