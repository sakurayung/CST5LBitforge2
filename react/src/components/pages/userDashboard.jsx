import { Navigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import { useGlobalContext } from "../context/globalContextProvider";
import CartItems from "../moduleComponents/cartItems";
import PurchasedItems from "../moduleComponents/purchasedItems";
import PendingOrders from "../moduleComponents/pendingOrders";
import axiosClient from "../../axiosClient";

import dashboard from './userDashboard.module.scss'

export default function UserDashboard(){
  const { user, setUser, setAmount, fetchUser} = useGlobalContext();

  const [file, setFile] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editedValues, setEditedValues] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    default_address: {
      street: user.default_address?.street || "",
      city: user.default_address?.city || "",
      region: user.default_address?.region || "",
      postal_code: user.default_address?.postal_code || "",
    },
  });

  const fileInputRef = useRef(null);
  setAmount(0);
  
  async function RefreshUserDetails() {
    await fetchUser();
  }

  useEffect(()=>{
    RefreshUserDetails();
  },[]);
  
  
  // 📸 Auto-upload profile picture on file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      uploadProfilePicture(selectedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const uploadProfilePicture = async (selectedFile) => {
    const formData = new FormData();
    formData.append("profile_picture", selectedFile);

    try {
      const response = await axiosClient.post(
        `/user/${user?.id}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(response.data.user);
      setFile(null);
      console.log("Profile picture updated");
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
    }
  };

  const handleChange = (e, field, isAddress = false) => {
    if (isAddress) {
      setEditedValues((prev) => ({
        ...prev,
        default_address: {
          ...prev.default_address,
          [field]: e.target.value,
        },
      }));
    } else {
      setEditedValues((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("username", editedValues.username);
      formData.append("email", editedValues.email);
      formData.append("phone_number", editedValues.phone_number);

      formData.append("default_address[street]", editedValues.default_address.street);
      formData.append("default_address[city]", editedValues.default_address.city);
      formData.append("default_address[region]", editedValues.default_address.region);
      formData.append("default_address[postal_code]", editedValues.default_address.postal_code);

      const response = await axiosClient.post(
        `/user/${user?.id}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data.user);
      setEditingField(null);
    } catch (error) {
      console.error("Failed to update user details:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (!user) return <div>Loading...</div>;
  if (user.role !== "user") return <Navigate to="/" replace />;

  return (
    <div className={dashboard.dashboard}>
      <aside>
        <div><a href="#dashboard-userDetails">User Details</a></div>
        <div><a href="#dashboard-cartItems">Cart Items</a></div>
      </aside>

      <div className={dashboard.main}>
        <section id="dashboard-userDetails" className={dashboard.sect1}>
          <div className={dashboard.title}>
            <h4>User Details</h4>
          </div>
          <div className={dashboard.down}>
            <div className={dashboard.pfp}>
              <div className={dashboard.imagewrap}>
                <input
                  type="file"
                  accept="image/jpg, image/jpeg, image/png"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                {file ? (
                  <div
                    className={dashboard.previewimage}
                    onClick={handleClick}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={URL.createObjectURL(file)} alt="Preview" />
                  </div>
                ) : user.profile_picture ? (
                  <div
                    className={dashboard.previewimage}
                    onClick={handleClick}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${user.profile_picture}`}
                      alt="Profile"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleClick}
                    className={dashboard.selectimageButton}
                  >
                    Select File
                  </button>
                )}
              </div>
            </div>
            <div className={dashboard.userDetails}>
              <div className={dashboard.userIDfield}>
                <div className={dashboard.dtl1}><p>ID: </p></div>
                <div className={dashboard.dtl2}><p>{user?.id}</p></div>
              </div>

              {/* Username */}
              <div>
                <div className={dashboard.dtl1}><p className={dashboard.username}>Username: </p></div>
                <div className={dashboard.dtl2}>
                  {editingField === 'username' ? (
                    <input
                      type="text"
                      value={editedValues.username}
                      onChange={(e) => handleChange(e, 'username')}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                  ) : (
                    <>
                      <p>{user?.username}</p>
                      <button onClick={() => handleEdit('username')}>Edit</button>
                    </>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <div className={dashboard.dtl1}><p>Email: </p></div>
                <div className={dashboard.dtl2}>
                  {editingField === 'email' ? (
                    <input
                      type="text"
                      value={editedValues?.email}
                      onChange={(e) => handleChange(e, 'email')}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                  ) : (
                    <>
                      <p>{user.email}</p>
                      <button onClick={() => handleEdit('email')}>Edit</button>
                    </>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <div className={dashboard.dtl1}><p>Phone Number: </p></div>
                <div className={dashboard.dtl2}>
                  {editingField === 'phone_number' ? (
                    <input
                      type="text"
                      value={editedValues?.phone_number}
                      onChange={(e) => handleChange(e, 'phone_number')}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                  ) : (
                    <>
                      <p>{user?.phone_number}</p>
                      <button onClick={() => handleEdit('phone_number')}>Edit</button>
                    </>
                  )}
                </div>
              </div>

              {/* Default Address */}
              <div>
                <div className={dashboard.dtl1}><p>Default Address: </p></div>
                <div className={dashboard?.dtaddresses}>
                  {['street', 'city', 'region', 'postal_code'].map((field) => (
                    <div key={field}>
                      {editingField === field ? (
                        <input
                          type="text"
                          value={editedValues.default_address?.[field]}
                          onChange={(e) => handleChange(e, field, true)}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                      ) : (
                        <div>
                          <p>{user.default_address?.[field]}</p>
                          <button onClick={() => handleEdit(field)}>Edit</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={dashboard.userDetails2}>
              <div><p>Overall Spend: {user?.overall_spend}</p></div>
              <div><p>Average Spend: {user?.average_spend}</p></div>
              <div><p>Items Ordered: {user?.item_ordered}</p></div>
              <div><p>Cart Items: {user?.cart_items_quantity}</p></div>
              <div><p>Pending Items: {user?.pending_orders_quantity}</p></div>
            </div>
          </div>
        </section>
        <section className={dashboard.sect2}>
          <div className={dashboard.title}>
            <h4>Pending Orders</h4>
          </div>
          <div className={dashboard.pendingOrders}>
            <PendingOrders />
          </div>
        </section>
        <section id="dashboard-cartItems" className={dashboard.sect3}>
          <div className={dashboard.title}>
            <h4>Cart Items</h4>
          </div>
          <div className={dashboard.cart}>
            <CartItems />
          </div>
        </section>
        <section id="dashboard-purchasedItems" className={dashboard.sect4}>
          <div className={dashboard.title}>
            <h4>Purchased Items</h4>
          </div>
          <div className={dashboard.purchase}>
            <PurchasedItems />
          </div>
        </section>
      </div>
      
    </div>
  )

}