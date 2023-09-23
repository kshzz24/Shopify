import React from 'react'
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";


const Footer = () => {
  return (
    <footer id="footer">
    <div className="leftFooter">
      <h4>DOWNLOAD OUR APP</h4>
      <p>Download App for Android and IOS mobile phone</p>
      <img src={playStore} alt="playstore" />
      <img src={appStore} alt="Appstore" />
    </div>

    <div className="midFooter">
      <h1>Shopify.</h1>
      <p>High Quality is our first priority</p>

    </div>

    <div className="rightFooter">
        <h2>Follow Me</h2>
   
        <a href="https://github.com/kshzz24/">Github</a>
        <a href="https://leetcode.com/kshzz24/">LeetCode</a>
    </div>

    
  </footer>
  );
}

export default Footer