import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faUserPlus,
  faEnvelope,
  faSignOutAlt,
  faInfoCircle,
  faHistory,
  faBell,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const { isLoggedIn, logout, currentUser } = useAuth(); // Added currentUser
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState(0); // Number of notifications
  const router = useRouter();

  useEffect(() => {
    // Fetch notifications count if the user is logged in
    const fetchNotifications = async () => {
      if (isLoggedIn) {
        try {
          const response = await fetch("/api/notifications", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token for authenticated request
            },
          });
          const data = await response.json();
          if (data.success) {
            setNotifications(data.data.length); // Update the count of notifications
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications();
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo Section */}
        <div className={styles.logoContainer}>
          <Link href="/" passHref>
            <div className="cursor-pointer flex items-center">
              <Image
                className={styles.logo}
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
          <Link href="/dashboard" passHref>
            <span
              className={`${styles.navLink} ${
                router.pathname === "/dashboard" ? styles.activeLink : ""
              }`}
            >
              Dashboard
            </span>
          </Link>
          <Link href="/create-request" passHref>
            <span
              className={`${styles.navLink} ${
                router.pathname === "/create-request" ? styles.activeLink : ""
              }`}
            >
              Create Request
            </span>
          </Link>
          <Link href="/transactions" passHref>
            <span
              className={`${styles.navLink} ${
                router.pathname === "/transactions" ? styles.activeLink : ""
              }`}
            >
              Transactions
            </span>
          </Link>
          {isLoggedIn && (
            <Link href="/messaging" passHref>
              <span
                className={`${styles.navLink} ${
                  router.pathname === "/messaging" ? styles.activeLink : ""
                }`}
              >
                Messaging
              </span>
            </Link>
          )}
        </div>

        {/* Authentication and Other Actions */}
        <div className={styles.authLinks}>
          {isLoggedIn ? (
            <>
              {/* Notifications Icon */}
              <Link href="/notifications" passHref>
                <span
                  className={`${styles.authLink} ${
                    router.pathname === "/notifications" ? styles.activeLink : ""
                  }`}
                  title="Notifications"
                >
                  <FontAwesomeIcon icon={faBell} />
                  {notifications > 0 && (
                    <span className={styles.notificationBadge}>
                      {notifications}
                    </span>
                  )}
                </span>
              </Link>

              {/* Messaging Icon */}
              <Link href="/messaging" passHref>
                <span
                  className={`${styles.authLink} ${
                    router.pathname === "/messaging" ? styles.activeLink : ""
                  }`}
                  title="Messaging"
                >
                  <FontAwesomeIcon icon={faComments} />
                </span>
              </Link>

              {/* Logout Button */}
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
                    <p>Are you sure you want to log out?</p>
                    <div className={styles.logoutConfirmButtons}>
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleLogout}
                        className={styles.logoutButton}
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
          <Link href="/contact" passHref>
            <span
              className={`${styles.authLink} ${
                router.pathname === "/contact" ? styles.activeLink : ""
              }`}
              title="Contact"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
          </Link>
          <Link href="/about" passHref>
            <span
              className={`${styles.authLink} ${
                router.pathname === "/about" ? styles.activeLink : ""
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
