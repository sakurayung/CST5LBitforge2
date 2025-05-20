import { Outlet } from "react-router-dom";

import { useGlobalContext } from "./context/globalContextProvider";
import GuestLayout from "./guestLayout";
import UserLayout from "./userLayout";
import AdminLayout from "./adminpages/adminLayout";

export default function PublicLayout() {
  const { user, token } = useGlobalContext();

  console.log(user?.role, token);

  // Still waiting for hydration
  if (token === undefined || user === undefined) {
    return null; // or a spinner
  }

  // No token = guest, regardless of role
  if (!token) {
    return <GuestLayout><Outlet /></GuestLayout>;
  }

  // With token, decide layout by role
  if (user.role === "admin") {
    return <AdminLayout><Outlet /></AdminLayout>;
  }

  if (user.role === "user") {
    return <UserLayout><Outlet /></UserLayout>;
  }

  // Default fallback
  return <GuestLayout><Outlet /></GuestLayout>;
}
