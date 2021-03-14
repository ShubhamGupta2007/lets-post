import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      className="footer  mt-auto py-3"
      style={{
        backgroundColor: "#009688",
        // position: "absolute",
        bottom: "0px",
        right: "0px",
        left: "0px",
      }}
    >
      <div className="container">
        <span className="text-muted text-dark ">
          <span className="text-dark">@2021 Developed by</span>{" "}
          <a
            className="text-white"
            href="https://www.linkedin.com/in/shubhamgupta2007/"
            target="_blank"
          >
            Shubham Gupta
          </a>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
