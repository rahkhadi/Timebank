import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import NotificationsDropdown from "./NotificationsDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faUserPlus,
  faEnvelope,
  faSignOutAlt,
  faInfoCircle,
  faBell, // Add bell icon for notifications
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useAuth } from "../context/AuthContext"; // For authentication logic
import axios from "axios";
import RequestDropdown from "./RequestDropdown";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const { isLoggedIn, logout, currentUser } = useAuth(); // Auth state and methods
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false); // For toggling notifications dropdown
  const router = useRouter();

  // Handle user logout
  const handleLogout = () => {
    logout(); // Clears auth state and token
    setShowLogoutConfirm(false); // Close confirmation dialog
  };

  // Handle search input changes
  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await axios.get("/api/requests/search", {
        params: { query: term },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  };

  // Close dropdown when clicked outside
  const closeDropdown = () => {
    setSearchResults([]);
  };

  // Toggle notifications dropdown
  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications); // Open or close dropdown
  };

  // Determine if a route is active
  const isActive = (pathname) => router.pathname === pathname;

  // Keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowLogoutConfirm(false);
        setShowNotifications(false); // Close notifications dropdown
      }
      if (event.key === "Enter" && showLogoutConfirm) {
        handleLogout();
      }
    };

    if (showLogoutConfirm || showNotifications) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLogoutConfirm, showNotifications]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <Link href="/" passHref>
            <div className="cursor-pointer flex items-center">
              <Image
                className={`${styles.logo} inline`}
                src="/icon.jpg"
                alt="TimeBank Logo"
                width={50}
                height={50}
              />
              <h1 className="inline text-white text-xl">TimeBank</h1>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          { (
            <>
              <Link href="/dashboard" passHref>
                <span
                  className={`${styles.navLink} ${
                    isActive("/dashboard") ? styles.activeLink : ""
                  }`}
                >
                  Dashboard
                </span>
              </Link>
              <Link href="/create-request" passHref>
                <span
                  className={`${styles.navLink} ${
                    isActive("/create-request") ? styles.activeLink : ""
                  }`}
                >
                  Create Request
                </span>
              </Link>
              <Link href="/transactions" passHref>
                <span
                  className={`${styles.navLink} ${
                    isActive("/transactions") ? styles.activeLink : ""
                  }`}
                >
                  Transactions
                </span>
              </Link>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <Image
            src="/search-icon.svg"
            alt="Search"
            width={20}
            height={20}
            className={styles.searchIcon}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
            placeholder="Search for requests..."
          />
          {searchResults.length > 0 && (
            <RequestDropdown requests={searchResults} onClose={closeDropdown} />
          )}
        </div>

        {/* Auth and Notifications */}
        <div className={styles.authLinks}>
          {isLoggedIn && (
            <>
              {/* Notifications */}
              <FontAwesomeIcon
                icon={faBell}
                className={styles.authLink}
                title="Notifications"
                onClick={handleNotificationsClick}
              />
              {showNotifications && <NotificationsDropdown />}
            </>
          )}

          {/* Authentication Links */}
          {isLoggedIn ? (
            <>
              {/* Logout */}
              <span
                onClick={() => setShowLogoutConfirm(true)}
                className={styles.authLink}
                title="Logout"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </span>
              {showLogoutConfirm && (
                <div className={styles.logoutConfirm}>
                  <div className={styles.logoutConfirmContent}>
                    <p style={{ color: "#001F3F" }}>
                      Are you sure you want to log out?
                    </p>
                    <div className={styles.logoutConfirmButtons}>
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className={`${styles.logoutConfirmButton} ${styles.cancelButton}`}
                        style={{ color: "#636363" }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`${styles.logoutConfirmButton} ${styles.logoutButton}`}
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/signup" passHref>
                <span className={styles.authLink} title="Sign Up">
                  <FontAwesomeIcon icon={faUserPlus} />
                </span>
              </Link>
              <Link href="/login" passHref>
                <span className={styles.authLink} title="Login">
                  <FontAwesomeIcon icon={faSignInAlt} />
                </span>
              </Link>
            </>
          )}

          {/* Additional Links */}
          <Link href="/contact" passHref>
            <span
              className={`${styles.authLink} ${
                isActive("/contact") ? styles.activeLink : ""
              }`}
              title="Contact"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
          </Link>
          <Link href="/about" passHref>
            <span
              className={`${styles.authLink} ${
                isActive("/about") ? styles.activeLink : ""
              }`}
              title="About"
            >
              <FontAwesomeIcon icon={faInfoCircle} />
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
