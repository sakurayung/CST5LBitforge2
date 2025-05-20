import { Outlet, Navigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"

import { useGlobalContext } from "../context/globalContextProvider"
import axiosClient from "../../axiosClient";
import PopulateItems from "../moduleComponents/populateItems";
import adminlayout from './adminLayout.module.scss'
import DropdownUserProfileHeader from "../moduleComponents/dropdownUserProfileHeader";

export default function AdminLayout() {
  const { 
    user, 
    displayItems, setDisplayItems,
    isSearch, setisSearch 
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
        noStockItems: false, // actual search keyword
      };
      const res = await axiosClient.get(`/search-items`, { params });
      setDisplayItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  }

  useEffect(() => {
    if (isSearch) {
      fetchItems(sortItemsBy, searchbyitems, searchItemsKeyword);
    }
  }, [sortItemsBy, searchbyitems, searchItemsKeyword, isSearch]);

  if (user.role !== 'admin'){
    return <Navigate to="/error" /> // Redirect to home if not admin
  }

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

  return (
    <div className={adminlayout.mainwrap}>
      <header>
        <nav>
          <div className={adminlayout.leftnav}>
            <h1>BITFORGE</h1>
            <Link to="/admin" onClick={(e) => {setisSearch(false)}}>Dashboard</Link>
            <Link to="/" onClick={(e) => {setisSearch(false)} }>Home</Link>
          </div>
          <div className={adminlayout.rightnav}>
            <div className={adminlayout.searchtab}>
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
            <DropdownUserProfileHeader />
          </div>
        </nav>
      </header>
      {! isSearch ? (<Outlet />):(
        <div className={adminlayout.searchResultwrap}>
          <div className={adminlayout.header}>
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
          <div className={adminlayout.body}>
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