import React from "react";
import "./AboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
// import YouTubeIcon from "@material-ui/icons/YouTube";
// import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CodeIcon from '@mui/icons-material/Code';
import ProfileImage from "../../../images/Profile.png"
const About = () => {
  const visitGitHub = () => {
    window.location = "https://github.com/kshzz24";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src={ProfileImage}
              alt="Founder"
            />
            <Typography>Kshitiz Bartaria</Typography>
            <Button onClick={visitGitHub} color="primary">
              Visit GitHub
            </Button>
            <span>
              This is a Full Stack WebApp
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Other Links</Typography>
            <a
              href="https://github.com/kshzz24"
              target="blank"
            >
              <GitHubIcon  />
            </a>

            <a href="https://in.linkedin.com/in/kshitiz-bartaria?trk=public_profile_like_view_actor-name" target="blank">
              <LinkedInIcon  />
            </a>
            <a href="https://leetcode.com/kshzz24/" target="blank">
              <CodeIcon  />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;