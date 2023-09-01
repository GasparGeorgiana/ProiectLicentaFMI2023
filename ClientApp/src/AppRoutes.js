import  Home  from "./components/Home/Home";
import  Login from "./components/UserAccount/Login";
import Register  from "./components/UserAccount/Register";
import LoginWith2Factor from "./components/UserAccount/LoginWith2Factor";
import AddFoodForm from "./components/Food/AddFoodForm";
import Foods from "./components/Food/Foods";
import AddRestaurantForm from "./components/Restaurants/AddRestaurantForm";
import Restaurants from "./components/Restaurants/Restaurants";
import PendingOrders from "./components/Orders/PendingOrders";
import YourOrders from "./components/Orders/YourOrders";
import ConfirmedOrders from "./components/Orders/ConfirmedOrders";
import PastOrders from "./components/Orders/PastOrders";
import RegisterAsOwner from "./components/UserAccount/RegisterAsOwner";
import EditFood from "./components/Food/EditFood";
const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/login2factor',
    element: <LoginWith2Factor />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/register-as-owner',
    element: <RegisterAsOwner />
  },
  {
    path: '/add-food',
    element: <AddFoodForm />
  },
  {
    path: '/edit-food',
    element: <EditFood />
  },
  {
    path: '/add-restaurant',
    element: <AddRestaurantForm />
  },
  {
    path: '/food-list/:id',
    element: <Foods />
  },
  {
    path: '/restaurants-list',
    element: <Restaurants />
  },
  {
    path: '/pending-orders',
    element: <PendingOrders />
  },
  {
    path: '/your-orders',
    element: <YourOrders />
  },
  {
    path: '/confirmed-orders',
    element: <ConfirmedOrders />
  },
  {
    path: '/past-orders',
    element: <PastOrders />
  },
];

export default AppRoutes;