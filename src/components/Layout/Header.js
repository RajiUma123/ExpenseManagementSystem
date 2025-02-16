import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { UserOutlined } from "@ant-design/icons"; // Importing Ant Design Icon

const Header = () => {
  const [loginUser, setLoginUser] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setLoginUser(user);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    message.success("Logout Successfully");
    navigate("/login");
  };
  return (
    <>
      <nav className="nav-page navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <button
            className="nav-page navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="nav-page navbar-toggler-icon" />
          </button>
          <div className="nav-page collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link className="navbar-brand ms-auto text-center" to="/">
              Expense Management
            </Link>
            <ul className="navbar-nav ms-auto align-items-center">
            {/* User Info Section */}
            <li className="nav-item d-flex align-items-center me-3">
              <UserOutlined style={{ fontSize: "30px", color: "white", marginRight: "10px" }} />
              <span className="fw-semibold text-dark text-white" style={{ fontSize: "20px" }}>
                {loginUser?.name || "Guest"}
              </span>
            </li>

            {/* Logout Button */}
            <li className="nav-item">
              <button className="btn btn-danger btn-sm ms-3" onClick={logoutHandler}>
                Logout
              </button>
            </li>
          </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
