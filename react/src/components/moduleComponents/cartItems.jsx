import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

import { useGlobalContext } from "../context/globalContextProvider";
import axiosClient from "../../axiosClient";

import cart from './cartItems.module.scss';

export default function CartItems() {
  const { user, setUser, setItem } = useGlobalContext();
  const navigate = useNavigate();

  const [localCart, setLocalCart] = useState(user.cart_items || []);
  const [quantities, setQuantities] = useState({});

  // Sync localCart when user.cart_items changes
  useEffect(() => {
    setLocalCart(user.cart_items || []);
  }, [user.cart_items]);

  // Initialize quantities when localCart changes
  useEffect(() => {
    const initialQuantities = {};
    localCart.forEach(item => {
      initialQuantities[item.id] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [localCart]);

  const toBuyHandler = async (e, quantity, item_id, cart_id) => {
    e.preventDefault();
    try {
      const res = await axiosClient.get(`/show-item/${item_id}`);
      const itemData = {
        ...res.data,
        quantity,
        cart_id,
      };
      setItem(itemData);
      navigate(`../../item/${item_id}/buy`);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Error fetching item details");
    }
  };

  async function handleUpdateQuantities(e, cartId, quantity) {
    e.preventDefault();
    try {
      // Update server first
      await axiosClient.put(`/cart/${cartId}/quantity`, {
        quantity: quantity,
      });

      // Update local state without refreshing entire user
      setLocalCart(prevCart => 
        prevCart.map(item => 
          item.id === cartId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity: ", error);
      alert(error?.response?.data?.message || "Error updating quantity");
    }
  }

  async function handleDeleteCart(e, cartId) {
    e.preventDefault();
    try {
      // Delete from server first
      await axiosClient.delete(`/cart/${cartId}`);

      // Update local state without refreshing entire user
      setLocalCart(prevCart => prevCart.filter(item => item.id !== cartId));
    } catch (error) {
      console.error("Error deleting cart item: ", error);
      alert(error?.response?.data?.message || "Error deleting item from cart");
    }
  }

  return (
    <div className={cart.cartItems}>
      {localCart.length > 0 ? (
        localCart.map((item, index) => (
          <div key={index} className={cart.cartItem}>
            <div className={cart.upper}>
              <button onClick={e => handleDeleteCart(e, item.id)}>
                <X />
              </button>
            </div>
            <div className={cart.up}>
              <Link to={`../item/${item.item_id}`} style={{ textDecoration: 'none' }}>
                <img 
                  src={`${import.meta.env.VITE_API_BASE_URL}${item.image_url}`} 
                  alt={item.item_name} 
                  onError={(e) => {
                    e.target.src = '/path/to/default-image.png';
                  }}
                />
              </Link>
              <h4>{item.item_name}</h4>
            </div>
            <div className={cart.down}>
              <div className={cart.left}>
                <input
                  type="number"
                  min="1"
                  value={quantities[item.id] || 1}
                  onChange={(e) => {
                    const newQty = Math.max(1, Number(e.target.value));
                    setQuantities(prev => ({
                      ...prev,
                      [item.id]: newQty
                    }));
                    handleUpdateQuantities(e, item.id, newQty);
                  }}
                />
                <div>Unit price: PHP {item.unit_price}</div>
              </div>
              <div className={cart.right}>
                <div>
                  <p>Grand Total: PHP {item.grand_total}</p>
                </div>
                <button
                  onClick={(e) =>
                    toBuyHandler(e, quantities[item.id] || 1, item.item_id, item.id)
                  }
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={cart.emptyCart}>No items in your cart</div>
      )}
    </div>
  );
}