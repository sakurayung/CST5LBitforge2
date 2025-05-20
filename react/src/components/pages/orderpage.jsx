import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useGlobalContext } from "../context/globalContextProvider";
import axiosClient from "../../axiosClient";
import order from './orderpage.module.scss';

export default function OrderPage() {
  const { user, item, amount } = useGlobalContext();

  console.log(item);

  const [shippingFee, setShippingFee] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    phoneNumber: user?.phone_number || '',
    street: user?.default_address?.street || '',
    city: user?.default_address?.city || '',
    region: user?.default_address?.region || '',
    postalCode: user?.default_address?.postal_code || '',
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user?.role !== "user") {
    return <Navigate to='/' replace/>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userAddress = `${formData.street}, ${formData.city}, ${formData.region}, ${formData.postalCode}`;
      const warehouseAddress = item.warehouse;

      const confirmProceed = window.confirm(
        `Confirm delivery address:\n${userAddress}\n\nContinue to place the order?`
      );

      if (!confirmProceed) {
        setIsSubmitting(false);
        return;
      }

      // Calculate distance and shipping fee
      const distanceResponse = await axiosClient.post('/calculate-distance', {
        from: userAddress,
        to: warehouseAddress,
      });

      const distance = distanceResponse.data.distance;
      const fee = Math.ceil(distance * 2);
      const units = amount != 0 ? amount : item.quantity;
      const total = (item.price * units) + fee;

      setShippingFee(fee);
      setTotalFee(total);

      // Prepare order payload
      const payload = {
        user_id: user.id,
        item_id: item.item_id,
        quantity: amount != 0 ? amount : item.quantity,
        unit_price: item.price,
        shipping_fee: fee,
        fullname: formData.fullname,
        phone_number: formData.phoneNumber,
        deliver_to: userAddress,
        shipped_from: warehouseAddress,
      };

      const orderResponse = await axiosClient.post('/store-pending-orders', payload);

      if (item.cart_id != null || item.cart_id != undefined) {
        try {
        const res = await axiosClient.delete(`/cart/${item.cart_id}`);
        console.log(res.data.message);
      } catch (error) {
        console.error("Delete failed:", error);
      }
      }
      
      alert("✅ Order placed successfully!");

      window.location.href = "/";

    } catch (err) {
      console.error("Order submission error:", err.response?.data || err.message);
      
      let errorMessage = "Failed to submit order. Please try again.";
      if (err.response?.data?.message === "Insufficient stock available.") {
        errorMessage = `Insufficient stock. Only ${err.response.data.available_stock} items available.`;
      } else if (err.response?.data?.errors) {
        errorMessage = Object.values(err.response.data.errors).join('\n');
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={order.order}>
      <div>
        <form onSubmit={handleSubmit}>
          <h1>Confirm Order Details</h1>
          
          <div>
            <h4>Full name:</h4>
            <div>
              <input 
                type="text" 
                name="fullname" 
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <h4>Phone Number:</h4>
            <div>
              <input 
                type="tel" 
                name="phoneNumber" 
                value={formData.phoneNumber}
                onChange={handleChange}
                pattern="09\d{9}"
                title="Please enter a valid Philippine mobile number (09xxxxxxxxx)"
                required
              />
            </div>
          </div>

          <div className={order.addresswrap}>
            <h4>Delivery Address</h4>
            <div>
              <div className={order.addresslabelswrap}>
                <h4>Street / Town:</h4>
                <h4>City:</h4>
                <h4>Region:</h4>
                <h4>Postal Code:</h4>
              </div>
              <div className={order.addressinputwrap}>
                <div>
                  <input 
                    type="text" 
                    name="street" 
                    value={formData.street} 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    name="region" 
                    value={formData.region} 
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    name="postalCode" 
                    value={formData.postalCode} 
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={order.pricewrap}>
            <p>Item Price: PHP {item.price.toLocaleString()} x {amount != 0 ? amount : item.quantity}</p>
            <p>Shipping Fee: PHP {shippingFee.toLocaleString()}</p>
            <p className={order.total}>Total: PHP {totalFee.toLocaleString()}</p>
          </div>

          <div className={order.button}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Confirm Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}