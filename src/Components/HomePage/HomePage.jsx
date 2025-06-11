import React from "react";
import "./HomePage.css"; // Make sure this path is correct
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Footerbar from "../layout/Footerbar";

const HomePage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/home/sport"); // or any page you want
  };

  return (
    <div className="page-container-full">
      {/* Welcome Section */}
      <Navbar />
      {/* Theme Box */}
      <div id="box1">
        <div id="theme">Choose your theme</div>
      </div>

      <hr />

      {/* Cards Section */}
      <div className="cardBox">
        <div id="cards">
          <div className="card">
            <div onClick={handleClick}>
              <img
                src="data:image/jpeg;base64,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" // placeholder
                alt="Sport"
              />
            </div>
            <div className="info">
              <p>Sport</p>
              <p className="price">Free</p>
            </div>
          </div>

          <div className="card">
            <img
              src="https://thumbs.dreamstime.com/b/news-newspapers-folded-stacked-word-wooden-block-puzzle-dice-concept-newspaper-media-press-release-42301371.jpg" // placeholder
              alt="News"
            />
            <div className="info">
              <p>News</p>
              <p className="price">Free</p>
            </div>
          </div>

          <div className="card">
            <img
              src="https://media.licdn.com/dms/image/v2/D5612AQHl0jMLNzIPuQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1701770133932?e=2147483647&v=beta&t=kdmptmnZ9y7xHJXXBxcHZQjp0GgMNKZ3ssyoB8BtJHI" // placeholder
              alt="Marketing"
            />
            <div className="info">
              <p>Marketing</p>
              <p className="price">Free</p>
            </div>
          </div>
        </div>
      </div>

      <Footerbar />
    </div>
  );
};

export default HomePage;
