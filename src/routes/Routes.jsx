import AddBalancePage from "../pages/AddBalancePage";
import AddressPage from "../pages/AddressPage";
import BalanceOrdersPage from "../pages/BalanceOrdersPage";
import CartPage from "../pages/CartPage";
import HomePage from "../pages/HomePage";
import MyOrdersPage from "../pages/MyOrdersPage";
import MyReviewsPage from "../pages/MyReviewsPage";
import MyWishListsPage from "../pages/MyWishListsPage";
import ProductCategoryPage from "../pages/ProductCategoryPage";
import ProductPage from "../pages/ProductPage";
import ProfilePage from "../pages/ProfilePage";
import AddProduct from "../pages/admin/AddProduct";
import AdminPage from "../pages/admin/AdminPage";
import AdminProductPage from "../pages/admin/AdminProductPage";
import BrandsPage from "../pages/admin/BrandsPage";
import CategoriesPage from "../pages/admin/CategoriesPage";
import CategoryPage from "../pages/admin/CategoryPage";
import CountryPage from "../pages/admin/CountryPage";
import CustomerPage from "../pages/admin/CustomerPage";
import CustomersPage from "../pages/admin/CustomersPage";
import LocationsPage from "../pages/admin/LocationsPage";
import OrderPage from "../pages/admin/OrderPage";
import OrdersPage from "../pages/admin/OrdersPage";
import ProductsPage from "../pages/admin/ProductsPage";
import PropertiesPage from "../pages/admin/PropertiesPage";
import ReviewsPage from "../pages/admin/ReviewsPage";
import ForgotPassword from "../pages/auth/ForgotPassword";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPage from "../pages/auth/SignUpPage";

export const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/signup",
    element: <SignUpPage />,
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  {
    path: "/",
    element: <HomePage />,
  },

  {
    path: "/category/:categorySlug",
    element: <ProductCategoryPage />,
  },

  {
    path: "/profile",
    element: <ProfilePage />,
  },

  {
    path: "/add-balance",
    element: <AddBalancePage />,
  },

  {
    path: "/wishlists",
    element: <MyWishListsPage />,
  },

  {
    path: "/product/:productId",
    element: <ProductPage />,
  },

  {
    path: "/cart",
    element: <CartPage />,
  },

  {
    path: "/address",
    element: <AddressPage />,
  },

  {
    path: "/orders",
    element: <MyOrdersPage />,
  },

  {
    path: "/balance-orders",
    element: <BalanceOrdersPage />,
  },

  {
    path: "/reviews",
    element: <MyReviewsPage />,
  },

  {
    path: "/admin/home",
    element: <AdminPage />,
  },

  {
    path: "/admin/categories",
    element: <CategoriesPage />,
  },

  {
    path: "/admin/category/:categorySlug",
    element: <CategoryPage />,
  },

  {
    path: "/admin/products",
    element: <ProductsPage />,
  },

  {
    path: "/admin/add-product",
    element: <AddProduct />,
  },

  {
    path: "/admin/brands",
    element: <BrandsPage />,
  },

  {
    path: "/admin/properties",
    element: <PropertiesPage />,
  },

  {
    path: "/admin/product/:productId",
    element: <AdminProductPage />,
  },

  {
    path: "/admin/locations",
    element: <LocationsPage />,
  },

  {
    path: "/admin/country/:countryId",
    element: <CountryPage />,
  },

  {
    path: "/admin/orders",
    element: <OrdersPage />,
  },

  {
    path: "/admin/order/:orderId",
    element: <OrderPage />,
  },

  {
    path: "/admin/reviews",
    element: <ReviewsPage />,
  },

  {
    path: "/admin/customers",
    element: <CustomersPage />,
  },

  {
    path: "/admin/customer/:customerEmail",
    element: <CustomerPage />,
  },
];
