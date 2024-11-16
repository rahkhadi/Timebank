import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faUserPlus,
  faEnvelope,
  faSignOutAlt,
  faHeart,
  faList,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import RequestDropdown from "./RequestDropdown";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowLogoutConfirm(false);
      }
      if (event.key === "Enter" && showLogoutConfirm) {
        handleLogout();
      }
    };

    if (showLogoutConfirm) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showLogoutConfirm]);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowLogoutConfirm(false);
    }
  }, [isLoggedIn]);

  const handleSearchChange = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5001/api/requests/search", {
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

  const closeDropdown = () => {
    setSearchResults([]);
  };

  const isActive = (pathname) => router.pathname === pathname;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
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

        <div className={styles.navLinks}>
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
        </div>

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

        <div className={styles.authLinks}>
          {isLoggedIn ? (
            <>
              <Link href="/favorites" passHref>
                <span
                  className={`${styles.authLink} ${
                    isActive("/favorites") ? styles.activeLink : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faHeart} title="Favorites" />
                </span>
              </Link>
              <Link href="/watchlist" passHref>
                <span
                  className={`${styles.authLink} ${
                    isActive("/watchlist") ? styles.activeLink : ""
                  }`}
                >
                  <FontAwesomeIcon icon={faList} title="Watchlist" />
                </span>
              </Link>
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
                    <p style={{ color: "#001F3F" }}>Are you sure you want to log out?</p>
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
