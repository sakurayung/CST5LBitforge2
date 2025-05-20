import { createBrowserRouter, Navigate } from 'react-router-dom'

import PublicLayout from './components/publicLayout';
import AdminLayout from './components/adminpages/adminLayout';

import ErrorPage from './components/pages/errorPage';
import ItemDisplay from './components/pages/itemDisplay';
import SignIn from './components/pages/signin';
import Login from './components/pages/login';
import AdminDashboard from './components/adminpages/adminDashboard';
import AdminDisplayUsers from './components/adminpages/AdminDisplayUsers';
import AdminItemsDashboard from './components/adminpages/adminItemsDashboard';
import UserDisplay from './components/pages/userDisplay';
import Home from './components/pages/home';
import AdminProtectedRoute from './components/adminProtectedRoute';
import UserDashboard from './components/pages/userDashboard';
import OrderPage from './components/pages/orderpage';
import AdminCreateItems from './components/adminpages/adminCreateItems';
import AdminItemModify from './components/pages/itemModify';

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home/>,
      },
      {
        path: 'item/:id',
        element: <ItemDisplay />,
      },
      {
        path: 'user/:id',
        element: <UserDisplay />
      },
      {
        path: 'dashboard',
        element: <UserDashboard />
      },
      {
        path: 'item/:id/buy',
        element: <OrderPage />
      },
      {
        path: 'item/:id/edit',
        element: <AdminItemModify />
      }
    ],
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      { 
        index: true, 
        element: <AdminDashboard /> 
      },
      { 
        path: 'users', 
        element: <AdminDisplayUsers /> 
      },
      { 
        path: 'items', 
        element: <AdminItemsDashboard /> 
      },
      { 
        path: 'createitem', 
        element: <AdminCreateItems /> 
      },
    ]
  },
  /*
  {
    path: '/error',
    element: <ErrorPage />,
  },
  */
  {
    path: '*',
    element: <ErrorPage />,
  }
]);

export default router