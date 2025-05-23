import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { useGlobalContext } from "../context/globalContextProvider";
import DisplayComments from "../moduleComponents/displayComments";
import itemDisplay from './itemDisplay.module.scss';
import axiosClient from "../../axiosClient";
import placeholderImg from './../../assets/placeholder-profile_3_5.png';
import adminimg from './../../assets/Untitled.png';

export default function ItemDisplay() {
  const { user, item, setItem, amount, setAmount, } = useGlobalContext();
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  console.log( id );

  async function fetchItemDetails() {
    try {
      const res = await axiosClient.get(`/show-item/${id}`);
      setItem(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching item details:", error); 
    }
  }

  useEffect(() => {
    fetchItemDetails();
    setComments([]);
  },[]);

  const tags = Array.isArray(item?.tags) ? item.tags : [];
  if (!item) return null;

  const specs = item.specs || {};

  const specSections = [
    {
      key: 'processor',
      label: 'Processor',
      fields: [
        ['brand', 'Brand'],
        ['model', 'Model'],
        ['cores', 'Cores'],
        ['threads', 'Threads'],
        ['base_clock', 'Base Clock'],
        ['boost_clock', 'Boost Clock'],
      ]
    },
    {
      key: 'graphics_card',
      label: 'Graphics Card',
      fields: [
        ['brand', 'Brand'],
        ['model', 'Model'],
        ['vram', 'VRAM'],
        ['clock_speed', 'Clock Speed'],
      ]
    },
    {
      key: 'ram',
      label: 'Memory (RAM)',
      fields: [
        ['type', 'Type'],
        ['capacity', 'Capacity'],
        ['speed', 'Speed'],
      ]
    },
    {
      key: 'storage',
      label: 'Storage',
      fields: [
        ['type', 'Type'],
        ['capacity', 'Capacity'],
      ]
    },
    {
      key: 'motherboard',
      label: 'Motherboard',
      fields: [
        ['chipset', 'Chipset'],
        ['form_factor', 'Form Factor'],
        ['socket', 'Socket'],
      ]
    },
    {
      key: 'display',
      label: 'Display',
      fields: [
        ['size', 'Size'],
        ['resolution', 'Resolution'],
        ['panel_type', 'Panel Type'],
        ['refresh_rate', 'Refresh Rate'],
      ]
    },
    {
      key: 'keyboard',
      label: 'Keyboard',
      fields: [
        ['type', 'Type'],
        ['backlit', 'Backlit'],
      ]
    },
    {
      key: 'mouse',
      label: 'Mouse',
      fields: [
        ['type', 'Type'],
        ['dpi', 'DPI'],
      ]
    },
    {
      key: 'microphone',
      label: 'Microphone',
      fields: [
        ['type', 'Type'],
        ['pattern', 'Pattern'],
      ]
    },
    {
      key: 'headset',
      label: 'Headset',
      fields: [
        ['driver_size', 'Driver Size'],
        ['mic', 'Has Mic'],
        ['wireless', 'Wireless'],
      ]
    },
    {
      key: 'ports',
      label: 'Ports',
      isArray: true
    },
    {
      key: 'connectivity',
      label: 'Connectivity',
      isArray: true
    },
    {
      key: 'operating_system',
      label: 'Operating System',
      isSingle: true
    },
    {
      key: 'power_supply',
      label: 'Power Supply',
      isSingle: true
    },
    {
      key: 'cooling',
      label: 'Cooling System',
      isSingle: true
    },
    {
      key: 'dimensions',
      label: 'Dimensions',
      isSingle: true
    },
    {
      key: 'weight',
      label: 'Weight',
      isSingle: true
    }
  ];

  async function handleSelectRating(rating) {
    setSelectedRating(rating);
    setShowDropdown(false);

    const data = {
      user_id: user.id,
      item_id: item.item_id,
      rate: rating,
    };

    try {
      const response = await axiosClient.post("/rate-item", data);
      console.log("Rating recorded:", response.data);
      // Optional: toast message or update UI
    } catch (error) {
      console.error("Failed to rate item:", error.response?.data || error.message);
      alert(error.response.data?.message);
      // Optional: toast error message
    }
  }

  const handleTextareaInput = (e) => {
    e.target.style.height = 'auto'; // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set to scroll height
  };

  async function handleCommentSubmit(e) {
    e.preventDefault();

    console.log(comment);

    const data = {
      user_id: user.id,           // assuming `user` is available from context/state
      item_id: item.item_id,      // assuming `item` is passed from props or state
      comment: comment,           // the textarea value
    };

    try {
      const response = await axiosClient.post('/comment-item', data);
      console.log(comment);
      setComment(""); // clear textarea
      setComments([...comments, {username: user.username, comment: comment, role: user.role}])

      // Optional: re-fetch or update comment list here
    } catch (error) {
      const errData = error.response?.data;
      console.log(errData);

      if (errData?.errors) {
        // Show first validation error if available
        const firstErrorKey = Object.keys(errData.errors)[0];
        console.log(firstErrorKey);
        alert(errData.errors[firstErrorKey][0]);
      } else {
        alert(errData?.message || "Something went wrong while posting your comment.");
      }
    }
  }


  function handleBuyClick(e) {
    e.preventDefault();
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0 || amt > item.stocks) {
      alert(`Please enter a valid amount between 1 and ${item.stocks}.`);
    } else {
      navigate('buy');
    }
  }

  async function handleCartClick(e) {
    e.preventDefault();
    const amt = Number(amount);
    
    const payload={
      user_id: user.id,
      item_id: item.item_id,
      quantity: amt,
      unit_price: item.price,
      stocks: 1
    }

    try {
      const res = await axiosClient.post('/cart/store', payload);

      alert('Item successfully added to cart!');
      console.log('Cart Response:', res.data);

    } catch (error) {
      const errMsg = error.response?.data?.message || 'An error occurred while adding to cart.';
      alert(`Failed to add to cart: ${errMsg}`);
      console.error('Add to Cart Error:', error);
    }
  }

  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    // Convert to number (empty string becomes NaN)
    const numValue = Number(value);

    console.log(value);
    
    // If empty, allow empty input (better UX for backspace)
    if (value === '') {
      setAmount('');
      return;
    }
    
    // If not a number or negative, set to 1
    if (isNaN(numValue) || numValue < 1) {
      setAmount(1);
      return;
    }
    
    // If exceeds available stock, cap at max stock
    if (numValue > item.stocks) {
      setAmount(item.stocks);
      return;
    }
    
    // Otherwise, set the valid number
    setAmount(numValue);
  };

  return (
    <div className={itemDisplay.wrapper}>
      <div>
        <div className={itemDisplay.top}>
          <div className={itemDisplay.left}>
            <img src={`${import.meta.env.VITE_API_BASE_URL}${item?.image_url}`} alt="" />
          </div>
          <div className={itemDisplay.right}>
            <div className={itemDisplay.namewrap}>
              <p><i>#{item.item_id}</i></p>
              <h3>{item.item_name}</h3>
            </div>
            <div className={itemDisplay.detailswrap}>
              <div className={itemDisplay.tags}>
                <h4>Tags:</h4>
                <div>
                  {tags.length > 0 ? tags.map(tag => (
                    <div key={tag}><p>{tag}</p></div>
                  )) : <p>No tags available</p>}
                </div>
              </div>
              <div className={itemDisplay.stocks}><p><b>Stocks:</b> {item.stocks}</p></div>
              <div className={`${showFullDetails ? itemDisplay.expand : itemDisplay.collapse}`}>
              {specSections.map(section => {
                const data = specs[section.key];
                
                // Helper function to check if data has any non-null values
                const hasValidData = (data) => {
                  if (data === null || data === undefined) return false;
                  if (Array.isArray(data)) return data.length > 0;
                  if (typeof data === 'object') {
                    return Object.values(data).some(
                      val => val !== null && val !== undefined && val !== 'null' && val !== ''
                    );
                  }
                  return data !== null && data !== undefined && data !== 'null' && data !== '';
                };

                // Skip if no valid data
                if (!hasValidData(data)) return null;

                // Handle arrays like ports, connectivity
                if (section.isArray && Array.isArray(data) && data.length > 0) {
                  return (
                    <div key={section.key} className={itemDisplay.specs}>
                      <h4>&bull; {section.label}:</h4>
                      <div>
                        {data.map((val, idx) => (
                          <p key={idx}><b>-</b> {val}</p>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Handle single-value sections like OS, cooling, etc.
                if (section.isSingle && data) {
                  return (
                    <div key={section.key} className={itemDisplay.specs}>
                      <h4>&bull; {section.label}:</h4>
                      <div>
                        <p>{data}</p>
                      </div>
                    </div>
                  );
                }

                // Handle objects with specific fields (default case)
                if (section.fields && Array.isArray(section.fields)) {
                  const visibleFields = section.fields.filter(([field]) => {
                    const value = data[field];
                    return value !== null && value !== undefined && value !== 'null' && value !== '';
                  });

                  if (visibleFields.length === 0) return null;

                  return (
                    <div key={section.key} className={itemDisplay.specs}>
                      <h4>&bull; {section.label}:</h4>
                      <div>
                        {visibleFields.map(([field, label]) => (
                          <p key={field}><b>{label}:</b> {data[field].toString()}</p>
                        ))}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
              </div>
              <div className={itemDisplay.button}>
                <button
                className={itemDisplay.toggleBtn}
                onClick={() => setShowFullDetails(!showFullDetails)}
                >
                  {showFullDetails ? "See Less" : "See More"}
                </button>
              </div>
              
            </div>
          </div>
        </div>
        <div className={itemDisplay.bottom}>
          <div className={itemDisplay.top}>
            <div className={itemDisplay.left}>
              <div className={itemDisplay.dropdownWrapper}>
                <div className={ItemDisplay.scoreWrapper}>
                  <p className={itemDisplay.scoreLabel}>Score: </p>
                  <p
                    className={itemDisplay.dropdownToggle}
                    onClick={() => {
                      if (!(user.role==="admin")) {
                        setShowDropdown((prev) => !prev);
                      }
                    }}
                    style={{ cursor: user.role==="admin" ? 'default' : 'pointer' }}
                  >
                    {selectedRating !== null ? selectedRating : item.rating} / 10
                  </p>
                </div>
                {!(user.role==="admin")&&showDropdown && (
                  <div className={itemDisplay.dropdownMenu}>
                    {[...Array(10)].map((_, i) => {
                      const score = 10 - i;
                      return (
                        <div
                          key={score}
                          className={itemDisplay.dropdownItem}
                          onClick={() => handleSelectRating(score)}
                        >
                          {score}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className={itemDisplay.right}>
              <div className={itemDisplay.pricewrap}>
                <p>PHP {item.price}</p>
              </div>
              <div>
              {!(user.role === "admin") ? (
                <>
                <div className={itemDisplay.amountinput}>
                  <input type="number"
                  name="amount"
                  placeholder="Amount"
                  min={1}
                  max={item.stocks}
                  value={amount === '' ? '' : Number(amount)}  
                  onChange={handleAmountChange}
                  />
                </div>
                <button className={itemDisplay.cart} onClick={handleCartClick}>Cart</button>
                <button className={itemDisplay.buy} onClick={handleBuyClick}>Buy</button>
                </>
              ):(
                <button className={itemDisplay.Editbtn}><Link to='edit' >Edit</Link></button>
              )}
              </div>
            </div>
          </div>  
          <div className={itemDisplay.commentswrap}>
            <div className={itemDisplay.comment}>
              <div className={itemDisplay.innerComment}>
                <form>
                  <textarea
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      handleTextareaInput(e);
                    }}
                    placeholder="Write your comment..."
                    className={itemDisplay.commentTXTA}
                  />
                </form>
              </div>  
              <div className={itemDisplay.submitCommentwrap}>
                <button onClick={handleCommentSubmit}>Comment</button>
              </div>
            </div>
          </div>
          <div className={itemDisplay.displaycomments}>
            <div className={itemDisplay.commentwrap}>
              {comments.length != 0 ? (comments.map((comments, index)=>(
                <div key={index}>
                  <div className={itemDisplay.username}>
                    <img src={comments.role?.toLowerCase() === 'admin' ? adminimg : comments.profile_picture ? `${import.meta.env.VITE_API_BASE_URL}${cmnt.profile_picture}`
                      : placeholderImg} alt="" />
                    <h4>{comments.username}</h4>
                    {comments.role?.toLowerCase() === "admin" && (
                      <div className={itemDisplay.userrole}>
                        <p>{comments.role?.charAt(0).toUpperCase() + comments.role?.slice(1).toLowerCase()}</p>
                      </div>
                    )}
                  </div>
                  <div className={itemDisplay.comment}>
                      <div>
                        <p>{comments.comment}</p>
                      </div>
                  </div>
                </div>
              ))): (<></>)}
            </div>
            <DisplayComments />
          </div>
        </div>
      </div>
    </div>
  );
}
