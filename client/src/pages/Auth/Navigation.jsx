import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaArrowDown, FaArrowUp, FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./navigation.css";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../app/api/usersApiSlice";
import { logout } from "../../app/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setShowSidebar();
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  //   zIndex: 999; sidebar top of everything
  return (
    <div
      style={{ zIndex: 999 }}
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden 
      flex-col justify-between p-4 text-white bg-black 
      w-[4%] hover:w-[15%] h-[100vh] fixed`}
      id="navigation-container"
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link
          to="/"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineHome size={26} className="mr-2 mt-[3rem]" />
          <span className="hidden nav-item-name mt-[3rem]">HOME</span>
        </Link>
        <Link
          to="/shop"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShopping size={26} className="mr-2 mt-[3rem]" />
          <span className="hidden nav-item-name mt-[3rem]">SHOP</span>
        </Link>
        <Link
          to="/cart"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <AiOutlineShoppingCart size={26} className="mr-2 mt-[3rem]" />
          <span className="hidden nav-item-name mt-[3rem]">CART</span>
        </Link>
        <Link
          to="/favorate"
          className="flex items-center transition-transform transform hover:translate-x-2"
        >
          <FaHeart size={26} className="mr-2 mt-[3rem]" />
          <span className="hidden nav-item-name mt-[3rem]">FAVORATE</span>
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-8000 focus:outline-none"
        >
          {userInfo ? (
            <span className="text-white">{userInfo.username}</span>
          ) : (
            <></>
          )}
          {userInfo && dropdownOpen ? (
            <FaArrowDown className="h-4 w-4 ml-1" />
          ) : (
            <FaArrowUp className="h-4 w-4 ml-1" />
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute right-0 mt-2 mr-14 space-y-2  bg-white text-gray-600 ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            }`}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productList"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link
                to="/admin/profile"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>

      {!userInfo && (
        <ul>
          <li>
            <Link
              to="/login"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineLogin size={26} className="mr-2 mt-[3rem]" />
              <span className="hidden nav-item-name mt-[3rem]">login</span>
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="flex items-center transition-transform transform hover:translate-x-2"
            >
              <AiOutlineUserAdd size={26} className="mr-2 mt-[3rem]" />
              <span className="hidden nav-item-name mt-[3rem]">register</span>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Navigation;
