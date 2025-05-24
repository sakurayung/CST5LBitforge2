import { Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { useGlobalContext } from "../context/globalContextProvider";
import axiosClient from "../../axiosClient";
import dashboard from './adminDashboard.module.scss';
import AdminItemsDashboard from "./adminItemsDashboard";
import AdminUsersDashboard from "./AdminDisplayUsers";

export default function AdminDashboard(){
  const { 
    user, 
    adnminDetails, setAdnminDetails,
    displayItems, setDisplayItems,
    pendingOrders, setPendingOrders,
    displayUsers, setDisplayUsers } = useGlobalContext();

  const [sortUserBy, setSortUserBy] = useState("id");
  const [sortItemsBy, setSortItemsBy] = useState("stocks");
  const [sortPendingOrdersBy, setSortPendingOrdersBy] = useState("oldest");

  const [searchbyitems, setSearchByItems] = useState("id");
  const [searchbypendingorders, setSearchpendingorders] = useState("id");

  const [searchUsername, setSearchUsername] = useState("");
  const [searchItemsKeyword, setSearchItemsKeyword] = useState("");
  const [searchPendingOrdersKeyword, setSearchPendingOrdersKeyword] = useState("");

  console.log(adnminDetails, user);
  
  if (!user) {
    // Display a loading indicator while user data is being fetched
    return <div>Loading...</div>;
  }

  if (user.role !== "admin") {
    // Redirect to error page if the user does not have the 'user' role
    return <Navigate to='/' replace/>;
  }

  async function handleCheckItem(e, id) {
    e.preventDefault();
  
    if (!confirm('Confirm and mark this order as delivered?')) return;

    try {
      const response = await axiosClient.post('/confirm-order', {
        pending_order_id: id
      });
      
      alert(`Order confirmed! Delivered at: ${new Date(response.data.delivered_at).toLocaleString()}`);
      // Refresh data or update UI
      fetchPendingOrders(sortPendingOrdersBy, searchbypendingorders, searchPendingOrdersKeyword);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to confirm delivery';
      alert(`Error: ${errorMsg}`);
      console.error('Delivery confirmation failed:', error);
    }
  }

  async function handleStocksItem(e, itemId) {
    const stock = e.target.value;
    
    // Basic validation
    if (isNaN(stock)) {
      console.error('Invalid stock value');
      return;
    }

    try {
      const response = await axiosClient.put(`/items/${itemId}/stocks`, {
        stocks: parseInt(stock) // Ensure it's sent as integer
      });

      if (response.data.success) {
        console.log('Stock updated successfully', response.data);
        // Optional: Update UI state or show success notification
        fetchItems(sortItemsBy, searchbyitems, searchItemsKeyword);
      } else {
        throw new Error(response.data.message || 'Update failed');
      }

    } catch (error) {
      console.error('Failed to update stock:', error);
      
      let errorMessage = 'Failed to update stock';
      if (error.response) {
        // Handle validation errors
        if (error.response.status === 422) {
          errorMessage = Object.values(error.response.data.errors)
            .flat()
            .join('\n');
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      
      alert(errorMessage);
    }
  }

  async function handleDeletItem(e, itemId) {
    e.preventDefault();

    console.log(itemId);
    
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await axiosClient.delete(`/items/${itemId}`);
      fetchItems(sortItemsBy, searchbyitems, searchItemsKeyword);
      alert("Item deleted successfully!");
    } catch (err) {
      console.error(`Failed to delete item ${itemId}:`, err);
      alert("Failed to delete item. Please try again.");
    }
  }

  async function handleDeleteUser(e, userId) {
    e.preventDefault();

    const confirmDelete = window.confirm("Are you sure you want to delete this user instead of suspension?");
    if (!confirmDelete) return;

    try {
      const res = await axiosClient.delete(`/user/${userId}`);
      fetchUsers(sortUserBy, searchUsername); // Refresh list after deletion
      alert(res.data.message);
    } catch (err) {
      console.error(`Failed to delete user ${userId}:`, err);
    }
  }

  async function handleSuspendUser(e, userId, isSuspend) {
    e.preventDefault();

    const confirmSuspend = window.confirm(
      `Are you sure you want to ${isSuspend ? 'unsuspend' : 'suspend'} this user?`
    );
    if (!confirmSuspend) return;

    try {
      const response = await axiosClient.patch(`/users/${userId}/suspend`);
      fetchUsers(sortUserBy, searchUsername); // Refresh list after deletion
      alert(response.data.message);
    } catch (err) {
      console.error(`Failed to update user ${userId}:`, err);
      alert("Something went wrong, please try again.");
    }
  }

  const handleUserSortChange = (value) => {
    setSortUserBy(value);
  };

  const handleUserSearchChange = (value) => {
    setSearchUsername(value);
  };

  useEffect(() => {
    fetchUsers(sortUserBy, searchUsername);
  }, [sortUserBy, searchUsername]);

  useEffect(() => {
    fetchItems(sortItemsBy, searchbyitems, searchItemsKeyword);
  }, [sortItemsBy, searchbyitems, searchItemsKeyword]);

  useEffect(() => {
    fetchPendingOrders(sortPendingOrdersBy, searchbypendingorders, searchPendingOrdersKeyword);
  }, [sortPendingOrdersBy, searchbypendingorders, searchPendingOrdersKeyword]);

  useEffect(() => {
    axiosClient.get('/display-admin-details')
      .then(({ data }) => {
        setAdnminDetails(data);
      })
      .catch((err) => {
        console.error("Failed to load admin details:", err);
      });
  }, []);
  
  async function fetchUsers(sort, username = "") {
    try {
      const params = { sortby: sort };
      if (username.trim() !== "") {
        params.username = username;
      }

      const res = await axiosClient.get(`/populate-users`, { params });
      setDisplayUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }

  async function fetchItems(sort, searchBy, keyword) {
    try {
      const params = {
        sortby: sort,       // 'stocks', 'price', or 'ratings'
        searchby: searchBy, // 'id', 'name', or 'tags'
        keyword: keyword,   // actual search keyword
      };
      const res = await axiosClient.get(`/search-items`, { params });
      setDisplayItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  }

  async function fetchPendingOrders(sort, searchBy, keyword) {
    try {
      const params = {
        sortby: sort,       // 'oldest', 'newest'
        searchby: searchBy, // 'id' or 'tags'
        keyword: keyword,   // the search term
      };
      const res = await axiosClient.get(`/pending-orders`, { params });
      setPendingOrders(res.data.pending_orders); // Assuming this sets state
    } catch (err) {
      console.error("Failed to fetch pending orders:", err);
    }
  }

  async function fetchPendingOrders(sort, searchBy, keyword) {
    try {
      const params = {
        sort: sort === 'newest' ? 'newest' : 'oldest',
      };

      if (keyword.trim() !== "") {
        if (searchBy === 'id') {
          params.item_id = keyword;
        } else if (searchBy === 'tags') {
          params.tag = keyword;
        }
      }

      const res = await axiosClient.get('/pending-orders', { params });
      
      // Format the ordered_at date if needed
      const formattedOrders = res.data.data.map(order => ({
        ...order,
        ordered_at: order.ordered_at || new Date().toISOString() // fallback if null
      }));
      
      setPendingOrders(formattedOrders);
    } catch (err) {
      console.error("Failed to fetch pending orders:", err);
      // Optionally set an error state here
    }
  }
  

  return (
    <div className={dashboard.dashboard}>
      <aside>
        <div><a href="#overview">Overview</a></div>
        <div><Link to={`createitem`}>Add Item</Link></div>
        <div><a href="#pending-orders">Pending Orders</a></div>
        <div><a href="#items-overview">Items Overview</a></div>
        <div><a href="#users-overview">Users Overview</a></div>
      </aside>
      <div>
        <div className={dashboard.main}>
          <section id="overview" className={dashboard.sect1}>
            <div className={dashboard.title}>
              <h4>Overview</h4>
            </div>
            <div className={dashboard.detailswrap}>
              <div className={dashboard.overviewwrap}>
                <div className={dashboard.left}> 
                <p>Total Items: {adnminDetails?.total_items?.toLocaleString?.() || 0}</p>
                <p>Total Sold: {adnminDetails?.total_sold?.toLocaleString?.() || 0}</p>
                <p>Total Earnings: PHP {adnminDetails?.total_earning?.toLocaleString?.() || 0}</p>
                <p>Average Earnings: PHP {adnminDetails?.average_earnings_per_day?.toLocaleString?.() || 0} per day</p>
              </div>
              <div className={dashboard.right}>
                <p>Total Users: {adnminDetails?.total_users?.toLocaleString?.() || 0}</p>
                <p>Total Pending Orders: {adnminDetails?.total_pending_orders?.toLocaleString?.() || 0}</p>
              </div>
              </div>
            </div>
          </section>
          <section id="pending-orders" className={dashboard.sect2}>
            <div className={dashboard.title}>
              <h4>Pending Orders</h4>
            </div>
            <div className={dashboard.items}>
              <AdminItemsDashboard 
              arr={pendingOrders} 
              onConfirm={handleCheckItem} 
              onSearchChange={(val) => setSearchPendingOrdersKeyword(val)}
              onSortChange={(val) => setSortPendingOrdersBy(val)}
              onSearchByChange={(val) => setSearchpendingorders(val)}
              isPendingOrder />
            </div>
          </section>
          <section id="items-overview" className={dashboard.sect3}>
            <div className={dashboard.title}>
              <h4>Items</h4>
            </div>
            <div className={dashboard.items}>
              <AdminItemsDashboard arr={displayItems} 
              onStocks={handleStocksItem}
              onDelete={handleDeletItem} 
              onSearchChange={(val) => setSearchItemsKeyword(val)}
              onSortChange={(val) => setSortItemsBy(val)}
              onSearchByChange={(val) => setSearchByItems(val)}
              isDisplayItems />
            </div>
          </section>
          <section id="users-overview" className={dashboard.sect4}>
            <div className={dashboard.title}>
              <h4>Users</h4>
            </div>
            <div className={dashboard.users}>
              <AdminUsersDashboard
                arr={displayUsers}
                onDelete={handleDeleteUser}
                onSuspend={handleSuspendUser}
                onSortChange={handleUserSortChange}
                onSearchChange={handleUserSearchChange}
              />
            </div>
          </section>
        </div>
      </div>
      
      
    </div>
  )

}