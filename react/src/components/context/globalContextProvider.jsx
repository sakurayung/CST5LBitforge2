import { createContext, useContext, useEffect, useState } from 'react';

import axiosClient from '../../axiosClient';

const GlobalContext = createContext({
  user: null,
  token: null,
  item: null,
  displayItems: null,
  displayTopPreBuildDesktop: null,
  displayTopgamingLaptop: null,
  displayTopgamingDesktop: null,
  displayTopgamingAccessories: null,
  pendingOrders: null,
  displayUsers: null,
  comments: null,
  adnminDetails: null,
  isSearch: false,
  amount: 0,
  setUser: () => {},
  setToken: () => {},
  setItem: () => {},
  setDisplayItems: () => {},
  setDisplayTopPreBuildDesktop: () => {},
  setDisplayTopgamingLaptop: () => {},
  setDisplayTopgamingDesktop: () => {},
  setDisplayTopgamingAccessories: () => {},
  setPendingOrders: () => {},
  setDisplayUsers: () => {},
  setComments: () => {},
  setAdnminDetails: () => {},
  setisSearch: () => {},
  setAmount: () => {},
});

export function GlobalContextProvider({ children }){
  
  const [user, setUser] = useState({ role: 'guest'});
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN') || null);
  const [item, setItem] = useState({});
  const [displayItems, setDisplayItems] = useState([]);
  const [displayTopPreBuildDesktop, setDisplayTopPreBuildDesktop] = useState([]);
  const [displayTopgamingLaptop, setDisplayTopgamingLaptop] = useState([]);
  const [displayTopgamingDesktop, setDisplayTopgamingDesktop] = useState([]);
  const [displayTopgamingAccessories, setDisplayTopgamingAccessories] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [adnminDetails, setAdnminDetails] = useState({});
  const [isSearch, setisSearch] = useState(false);
  const [amount, setAmount] = useState(0);

  const tmpItemDetails = {
    "item_id": 1,
    "image_url": "https://picsum.photos/seed/pc1/200/200",
    "item_name": "ComputerXYZ",
    "tags": ["Gaming", "Desktop", "High-end"],
    "warehouse": "Ma-a, Davao City, 8000",
    "price": 30000,
    "rating": 9.42,
    "stocks": 10,
    "specs": {
      "processor": {
        "brand": "Intel",
        "model": "Core i9-13900K",
        "cores": 24,
        "threads": 32,
        "base_clock": "3.0GHz",
        "boost_clock": "5.8GHz"
      },
      "graphics_card": {
        "brand": "NVIDIA",
        "model": "RTX 4080",
        "vram": "16GB GDDR6X",
        "clock_speed": "2205MHz"
      },
      "ram": {
        "type": "DDR5",
        "capacity": "32GB",
        "speed": "6000MHz"
      },
      "storage": {
        "type": "NVMe SSD + HDD",
        "capacity": "1TB SSD + 2TB HDD"
      },
      "motherboard": {
        "chipset": "Z790",
        "form_factor": "ATX",
        "socket": "LGA1700"
      },
      "display": {
        "size": "27 inches",
        "resolution": "2560x1440",
        "panel_type": null,
        "refresh_rate": "165Hz"
      },
      "battery": {
        "capacity": null,
        "life": null
      },
      "keyboard": {
        "type": null,
        "backlit": "RGB"
      },
      "mouse": {
        "type": "Wired",
        "dpi": "16000"
      },
      "microphone": {
        "type": "Condenser",
        "pattern": "Cardioid"
      },
      "headset": {
        "driver_size": "50mm",
      },
      "ports": [
        "USB 3.2",
        "USB-C",
        "HDMI",
        "DisplayPort",
        "Ethernet"
      ],
      "connectivity": [
        "WiFi 6E",
        "Bluetooth 5.3"
      ],
      "operating_system": "Windows 11 Pro",
      "power_supply": "850W 80+ Gold",
      "cooling": "Liquid Cooling",
      "dimensions": "18.5 x 8.3 x 19.6 in",
      "weight": "12 kg"
    },
    "comments": [
      {
        "user_id": "u1",
        "username": "Adminmock123",
        "role": "user",
        "vote_count": 102,
        "vote_likes": 80,
        "comment": " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit in minima minus qui laudantium fuga maiores! Molestiae minima numquam, soluta maxime delectus repudiandae sequi eveniet aperiam reprehenderit quasi, esse laudantium! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit in minima minus qui laudantium fuga maiores! Molestiae minima numquam, soluta maxime delectus repudiandae sequi eveniet aperiam reprehenderit quasi, esse laudantium! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit in minima minus qui laudantium fuga maiores! Molestiae minima numquam, soluta maxime delectus repudiandae sequi eveniet aperiam reprehenderit quasi, esse laudantium!"
      },
      {
        "user_id": "u1004",
        "username": "Michael34",
        "role": "admin",
        "vote_count": 80,
        "vote_likes": 54,
        "comment": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit in minima minus qui laudantium fuga maiores! Molestiae minima numquam, soluta maxime delectus repudiandae sequi eveniet aperiam reprehenderit quasi, esse laudantium!"
      },
      {
        "user_id": "u1005",
        "username": "Gaymer",
        "vote_count": 17,
        "vote_likes": 12,
        "comment": "ASASS sasa"
      }
    ]
  }

  const tmpItemPendingOrders = [
    {
      "pending_order_id": "po1",
      "item_id": "i1",
      "image_url": "https://picsum.photos/seed/pc1/200/200",
      "fullname": "Myname mynane",
      "phone_number": "09456382948",
      "amount": 3,
      "shipping_fee": 11,
      "grand_total": 30011,
    },
    {
      "pending_order_id": "po2",
      "item_id": "i1",
      "image_url": "https://picsum.photos/seed/pc1/200/200",
      "fullname": "Myname mynane",
      "phone_number": "09456382948",
      "amount": 3,
      "shipping_fee": 11,
      "grand_total": 30011,
    },
  ]

  const tmpItem = [
    {
      "item_id": 1,
      "image_url": "https://picsum.photos/seed/pc1/200/200",
      "item_name": "ComputerXYZ",
      "tags": ["gaming", "desktop", "high-end"],
      "price": "PHP30000",
      "rating": 9.42,
      "stocks": 10
    },
    {
      "item_id": 2,
      "image_url": "https://picsum.photos/seed/pc2/200/200",
      "item_name": "LaptopMaster500",
      "tags": ["portable", "gaming", "RGB"],
      "price": "PHP45000",
      "rating": 9.15,
      "stocks": 7
    },
    {
      "item_id": 3,
      "image_url": "https://picsum.photos/seed/pc3/200/200",
      "item_name": "ServerBlade-X",
      "tags": ["server", "enterprise", "performance"],
      "price": "PHP120000",
      "rating": 8.96,
      "stocks": 3
    },
    {
      "item_id": 4,
      "image_url": "https://picsum.photos/seed/pc4/200/200",
      "item_name": "UltraSlimBook",
      "tags": ["ultrabook", "lightweight", "business"],
      "price": "PHP38000",
      "rating": 9.70,
      "stocks": 5
    },
    {
      "item_id": 5,
      "image_url": "https://picsum.photos/seed/pc5/200/200",
      "item_name": "MegaBuildZ",
      "tags": ["custom", "gaming", "water-cooled"],
      "price": "PHP90000",
      "rating": 9.85,
      "stocks": 2
    },
    {
      "item_id": 6,
      "image_url": "https://picsum.photos/seed/pc6/200/200",
      "item_name": "WorkMate Lite",
      "tags": ["office", "compact", "budget"],
      "price": "PHP25000",
      "rating": 8.65,
      "stocks": 12
    },
    {
      "item_id": 7,
      "image_url": "https://picsum.photos/seed/pc7/200/200",
      "item_name": "StreamPro X200",
      "tags": ["streaming", "content-creator", "RGB"],
      "price": "PHP70000",
      "rating": 9.20,
      "stocks": 4
    },
    {
      "item_id": 8,
      "image_url": "https://picsum.photos/seed/pc8/200/200",
      "item_name": "EduBox Mini",
      "tags": ["education", "affordable", "small-form"],
      "price": "PHP18000",
      "rating": 8.50,
      "stocks": 15
    },
    {
      "item_id": 9,
      "image_url": "https://picsum.photos/seed/pc9/200/200",
      "item_name": "GamingBeast RTX",
      "tags": ["RTX", "high-performance", "gaming"],
      "price": "PHP110000",
      "rating": 9.75,
      "stocks": 1
    },
    {
      "item_id": 10,
      "image_url": "https://picsum.photos/seed/pc10/200/200",
      "item_name": "ProDesigner Studio",
      "tags": ["design", "4K", "creator"],
      "price": "PHP85000",
      "rating": 9.35,
      "stocks": 6
    }
  ]
  
  const tmpUser = {
    "profile_picture": "sample pfp",
    "id": "u1",
    "username": "Adminmock123",
    "email": "adminsystem@gmail.com",
    "role": "user",
    "password": "123",
    "phone_number": "09123456789",
    "default_address": {
      "street": "Tomahawk st, Indangan",
      "city": "Davao",
      "region": "Davao Region",
      "postal_code": 8000
    },
    "overall_spend": 110000,
    "average_spend": 10000,
    "items_ordered": 6,
    "cart_items_quantity": 2,
    "pending_orders_quantity": 3,
    "cart_items": [
      {
        "item_id": 1,
        "quantity": 2,
        "item_name": "ComputerXYZ",
        "image_url": "https://picsum.photos/seed/pc1/200/200",
        "unit_price": 30000,
        "grand_total": 60000,
        "stocks": 10
      },
      {
        "item_id": 3,
        "quantity": 4,
        "item_name": "ServerBlade-X",
        "image_url": "https://picsum.photos/seed/pc3/200/200",
        "unit_price": 120000,
        "grand_total": 480000,
        "stocks": 3
      }
    ],
    "purchase_receipts": [
      {
        "receipt_id": "R1001",
        "buyer_id": "u1",
        "item": {
          "item_id": 1,
          "name": "ComputerXYZ",
          "image_url": "https://picsum.photos/seed/pc1/200/200",
          "quantity": 2,
          "unit_price": 15000,
          "total_price": 30000
        },
        "total_amount": 30000,
        "shipping_fee": 500,
        "grand_total": 30500,
        "ordered_at": "2025-04-15T09:30:00Z",
        "delivered_at": "2025-04-17T14:45:00Z",
        "shipped_from": "Warehouse A",
        "delivered_to": "123 Main St, Cityville"
      },
      {
        "receipt_id": "R1002",
        "buyer_id": "u2",
        "item": {
          "item_id": 2,
          "name": "LaptopMaster500",
          "image_url": "https://picsum.photos/seed/pc2/200/200",
          "quantity": 1,
          "unit_price": 45000,
          "total_price": 45000
        },
        "total_amount": 45000,
        "shipping_fee": 750,
        "grand_total": 45750,
        "ordered_at": "2025-04-16T11:20:00Z",
        "delivered_at": "2025-04-18T16:10:00Z",
        "shipped_from": "Warehouse B",
        "delivered_to": "456 Oak Ave, Townsville"
      },
      {
        "receipt_id": "R1003",
        "buyer_id": "u3",
        "item": {
          "item_id": 4,
          "name": "UltraSlimBook",
          "image_url": "https://picsum.photos/seed/pc4/200/200",
          "quantity": 3,
          "unit_price": 38000,
          "total_price": 114000
        },
        "total_amount": 114000,
        "shipping_fee": 600,
        "grand_total": 114600,
        "ordered_at": "2025-04-17T08:15:00Z",
        "delivered_at": "2025-04-19T12:00:00Z",
        "shipped_from": "Warehouse C",
        "delivered_to": "789 Pine Rd, Villageville"
      }
    ],
    "pending_orders": [
      {
        "receipt_id": "R1004",
        "item": {
          "item_id": 2,
          "name": "LaptopMaster500",
          "image_url": "https://picsum.photos/seed/laptopmaster500/200/200",
          "quantity": 1,
          "unit_price": 45000
        },
        "total_amount": 45000,
        "shipping_fee": 800,
        "grand_total": 45800,
        "ordered_at": "2025-04-19T10:00:00Z",
        "delivered_at": "2025-04-21T16:30:00Z",
        "shipped_from": "Warehouse B",
        "delivered_to": "123 Main St, Cityville"
      },
      {
        "receipt_id": "R1005",
        "item": {
          "item_id": 1,
          "name": "ComputerXYZ",
          "image_url": "https://picsum.photos/seed/computerxyz/200/200",
          "quantity": 1,
          "unit_price": 30000
        },
        "total_amount": 30000,
        "shipping_fee": 500,
        "grand_total": 30500,
        "ordered_at": "2025-04-20T08:30:00Z",
        "delivered_at": "2025-04-22T14:00:00Z",
        "shipped_from": "Warehouse A",
        "delivered_to": "456 Oak Ave, Townsville"
      },
      {
        "receipt_id": "R1006",
        "item": {
          "item_id": 4,
          "name": "UltraSlimBook",
          "image_url": "https://picsum.photos/seed/ultraslimbook/200/200",
          "quantity": 3,
          "unit_price": 38000
        },
        "total_amount": 114000,
        "shipping_fee": 600,
        "grand_total": 114600,
        "ordered_at": "2025-04-21T09:45:00Z",
        "delivered_at": "2025-04-23T12:15:00Z",
        "shipped_from": "Warehouse C",
        "delivered_to": "789 Pine Rd, Villageville"
      }
    ]
  }
  
  const tmpPendingOrders = {
    
  }

  const tmpDisplayUsers = [
    {
      "user_id": "u1001",
      "username": "JohnDoe123",
      "email": "john@gmail.com",
      "role": "user",
      "phone_number": "09123456789",
      "default_address": {
        "street": "123 Main St",
        "city": "Davao",
        "region": "Davao Region",
        "postal_code": 8000
      }
    },
    {
      "user_id": "u1002",
      "username": "JaneSmith456",
      "email": "jne@gmail.com",
      "role": "user",
      "phone_number": "09123456789",
      "default_address": {
        "street": "456 Oak Ave",
        "city": "Davao",
        "region": "Davao Region",
        "postal_code": 8000
      }
    },
    {
      "user_id": "u1003",
      "username": "AdminMark01",
      "email": "admin.mark@site.com",
      "role": "admin",
      "phone_number": "09998887766",
      "default_address": {
        "street": "100 Admin St",
        "city": "Davao City",
        "region": "Davao Region",
        "postal_code": 8000
      }
    },
    {
      "user_id": "u1004",
      "username": "AlexRivera789",
      "email": "alex.rivera@gmail.com",
      "role": "user",
      "phone_number": "09987654321",
      "default_address": {
        "street": "789 Pine Blvd",
        "city": "Tagum",
        "region": "Davao Region",
        "postal_code": 8100
      }
    },
    {
      "user_id": "u1005",
      "username": "SuperAdminGrace",
      "email": "grace.admin@site.com",
      "role": "admin",
      "phone_number": "09095556677",
      "default_address": {
        "street": "999 Admin Lane",
        "city": "Digos",
        "region": "Davao Region",
        "postal_code": 8002
      }
    }
  ]

  const tmpadminDetails = {
    "total_items": 1000,
    "total_sold": 500,
    "total_earnings": 1000000,
    "average_earnings_perDay": 10000,
    "total_users": 200,
    "total_pending_orders": 50,
  }

  function setToken(token) {
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token); // Save token to localStorage
    } else {
      localStorage.removeItem('ACCESS_TOKEN'); // Remove token from localStorage
    }
    axiosClient.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
  }

  // Fetch user data from the API
  async function fetchUser() {
    try {
      const res = await axiosClient.get('/user');
      console.log('User data fetched:', res.data);
      setUser(res.data.user); // Assuming your API returns the user object under the 'user' key
    } catch (error) {
      console.error('Fetch user failed:', error);
      setUser({ role: 'guest' });
      setToken(null); // Clear the token if fetching user fails
    }
  }

  async function fetchitems() {
    try {
      const [response1, response2, response3, response4] = await Promise.all([
        axiosClient.get('/populate-top-pre-build-desktops'),
        axiosClient.get('/populate-top-items', {
          params: { query1: 'gaming', query2: 'laptop' }
        }),
        axiosClient.get('/populate-top-items', {
          params: { query1: 'gaming', query2: 'desktop' }
        }),
        axiosClient.get('/populate-top-items', {
          params: { query1: 'gaming', query2: 'accessories' }
        })
      ]);

      setDisplayTopPreBuildDesktop(response1.data.data);
      setDisplayTopgamingLaptop(response2.data.data);
      setDisplayTopgamingDesktop(response3.data.data);
      setDisplayTopgamingAccessories(response4.data.data);

    } catch (error) {
      console.error('Failed to fetch items:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('ACCESS_TOKEN'); // Retrieve token from localStorage

    if (storedToken) {
      _setToken(storedToken); // Set the token in state
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`; // Set Authorization header

      // Fetch user data after setting token
      fetchUser(); 
    } else {
      setUser({ role: 'guest' }); // Set default user as guest if no token
    }

    // Optional: Initialize other state variables
    //setDisplayItems(tmpItem);
    setAdnminDetails(tmpadminDetails);
    //setDisplayTopPreBuildDesktop(tmpItem);
    //setDisplayUsers(tmpDisplayUsers);
    fetchitems();
  }, []);

  console.log(user?.role, `search: ${isSearch}`);

  return (
    <GlobalContext.Provider value={{
      user,
      token, 
      item,
      displayItems,
      displayTopPreBuildDesktop,
      displayTopgamingLaptop,
      displayTopgamingDesktop,
      displayTopgamingAccessories,
      pendingOrders,
      displayUsers,
      comments,
      adnminDetails,
      isSearch,
      amount,

      setUser,
      setToken,
      setItem,
      setDisplayItems,
      setDisplayTopPreBuildDesktop,
      setDisplayTopgamingLaptop,
      setDisplayTopgamingDesktop,
      setDisplayTopgamingAccessories,
      setPendingOrders,
      setDisplayUsers,
      setComments,
      setAdnminDetails,
      tmpItemDetails,
      setisSearch,
      setAmount,

      fetchUser
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
