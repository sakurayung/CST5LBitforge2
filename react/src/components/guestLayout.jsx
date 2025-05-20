import { Outlet, Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { useGlobalContext } from "./context/globalContextProvider";
import axiosClient from "../axiosClient";
import PopulateItems from "./moduleComponents/populateItems";

import guestlayout from './guestLayout.module.scss'

export default function GuestLayout() {
  const { 
    user,
    isSearch, setisSearch,
    displayItems, setDisplayItems,
  } = useGlobalContext();

  const [sortItemsBy, setSortItemsBy] = useState('latest'); // 'latest', 'popularity', 'rated'
  const [searchbyitems, setSearchByItems] = useState('tags'); // 'tags' or 'name'
  const [searchItemsKeyword, setSearchItemsKeyword] = useState('');

  async function fetchItems(sort, searchBy, keyword) {
    try {
      const params = {
        sortby: sort,       // 'stocks', 'price', or 'ratings'
        searchby: searchBy, // 'id', 'name', or 'tags'
        keyword: keyword,   // actual search keyword
        noStockItems: false,  // actual search keyword
      };
      const res = await axiosClient.get(`/search-items`, { params });
      setDisplayItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  }

  console.log(searchItemsKeyword);

  useEffect(() => {
    if (isSearch) {
      fetchItems(sortItemsBy, searchbyitems, searchItemsKeyword);
    }
  }, [sortItemsBy, searchbyitems, searchItemsKeyword, isSearch]);


  const handleSearchChange = (e) => {
    setSearchItemsKeyword(e.target.value);
    setisSearch(e.target.value !== '');
  };

  const handleSortChange = (e) => {
    setSortItemsBy(e.target.value);
  };

  const handleSearchByChange = (e) => {
    setSearchByItems(e.target.value.toLowerCase());
  };

  console.log( `Search: ${isSearch}`)

  return(
    <div className={guestlayout.mainwrap}>
      <header>
        <nav>
          <div className={guestlayout.leftnav}>
            <h1>BITFORGE</h1>
            <Link to="/" onClick={(e) => {setisSearch(false)}}>Home</Link>
          </div>
          <div className={guestlayout.rightnav}>
            <div className={guestlayout.searchtab}>
              <input type="text" 
                onChange={handleSearchChange}
                value={searchItemsKeyword}
                placeholder="Search items..."
              />
              <select name="searchby" 
                onChange={handleSearchByChange}
                value={searchbyitems}
              >
                <option value="tags">Tag</option>
                <option value="name">Name</option>
              </select>
            </div>
            <Link to="/signin" onClick={(e) => {setisSearch(false)}}>Sign In</Link>
            <Link to="/login" onClick={(e) => {setisSearch(false)}}>Login</Link>
          </div>
        </nav>
      </header>
      {! isSearch ? (<Outlet />):(
        <div className={guestlayout.searchResultwrap}>
          <div className={guestlayout.header}>
            <select 
              name="sortby" 
              onChange={handleSortChange}
              value={sortItemsBy}
            >
              <option value="latest">Latest</option>
              <option value="popularity">Popularity</option>
              <option value="rated">Rated</option>
            </select>
          </div>
          <div className={guestlayout.body}>
          {displayItems.map((item, index) => (
            <Link to={`item/${item.item_id}`} key={index}
            style={{ textDecoration: 'none'}} 
            onClick={(e)=>{setisSearch(false)}} 
            >
              <PopulateItems item={item} />
            </Link>
          ))}
          </div>
        </div>
      )}
    </div>
  )
}