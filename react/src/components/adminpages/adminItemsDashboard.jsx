import { Link } from 'react-router-dom';
import { useState } from 'react';

import itemsDashboard from './adminItemsDashboard.module.scss'

export default function AdminItemsDashboard({
  arr, 
  isPendingOrder = false, 
  isDisplayItems = false,
  onDelete = () => {},
  onStocks = () => {},
  onConfirm = () => {},
  onSearchChange = () => {},
  onSortChange = () => {},
  onSearchByChange = () => {},
}){

  console.log(arr);

  return (
    <div className={itemsDashboard.populatewrap}>
      <div className={itemsDashboard.populateItems}>
        <div className={itemsDashboard.header}>
          <div className={itemsDashboard.search}>
            <input type="text" placeholder='searchItems' 
            onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <select name="typesearch" id="" className={itemsDashboard.typesearch}
          onChange={(e) => onSearchByChange(e.target.value)}
          >
            <option value="id">Id</option>
            <option value="tag">Tag</option>
          </select>
          {isDisplayItems && (
          <select name="" id="" className={itemsDashboard.sortselect}
          onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="stocks">Stocks</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
          )}
          {isPendingOrder && (
          <select name="" id="" className={itemsDashboard.sortselect}
          onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="oldest">Oldest</option>
            <option value="newest">Newest</option>
          </select>
          )}
          
        </div>
        <div className={itemsDashboard.body}>
          <div className={itemsDashboard.populateItemswrap}>
          {arr.map ((item, index)=> (
            <div key={item.item_id} className={item.stocks <= 0 ? itemsDashboard.itemwrap2 : itemsDashboard.itemwrap}>
              {isDisplayItems && (
                <div className={itemsDashboard.idwrap}>
                  <p># {item.item_id}</p>
                </div>
              )}
              <div className={itemsDashboard.imgwrap}>
                <img src={`${import.meta.env.VITE_API_BASE_URL}${item.image_url}`} alt={item.item_name} />
              </div>
              <div className={itemsDashboard.namewrap}>
                <Link to={`../item/${item.item_id}`}><p>{item.item_name}</p></Link>
                {isPendingOrder && (
                  <>
                  <p className={itemsDashboard.username}>From: <b>{item.fullname}</b></p>
                  <p className={itemsDashboard.username}>Phone #: {item.phone_number}</p>
                  <p className={itemsDashboard.username}>Address: {item.address}</p>
                  <p className={itemsDashboard.username}>Amount: {item.amount} <br />Shipping fee: PHP{item.shipping_fee} <br />Grand Total: PHP {item.grand_total}</p><br/>
                  </>
                )}
              </div>
              {isDisplayItems && (
                <>
                <div className={itemsDashboard.stockwrap}>
                  <p>Stocks</p>
                  <input type="number" name="stocks" id="" defaultValue={item.stocks} onChange={(e) => onStocks(e, item.item_id)}/>
                </div>
                <div className={itemsDashboard.stockwrap}>
                  <button onClick={(e) => onDelete(e, item.item_id)}>Delete</button>
                </div>
                </>
              )}
              {isPendingOrder && (
                <>
                  <div className={itemsDashboard.confirmwrap}>
                    <button onClick={(e) => onConfirm(e, item.pending_order_id)}>Confirm</button>
                  </div>
                </>
              )}
            </div>
          ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}