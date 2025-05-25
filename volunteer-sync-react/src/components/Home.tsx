import React from "react";
import { Link } from "react-router-dom";
import { mockStats, mockProjects } from "../data/mockData";
import "../css/style.css";

const Home: React.FC = () => {
  const latestProjects = mockProjects.slice(0, 3);

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <div className="curve">
          <img src="/assets/curve.svg" alt="" />
        </div>
        <div className="header">
          <div className="main-logo">
            <img src="/assets/logo.svg" alt="logo" className="logo" />
          </div>
          <div className="logo">
            <img src="/assets/logo.svg" alt="logo" className="logo" />
            <h1>VolunteerSync</h1>
          </div>
        </div>
        <div className="content hero-main">
          <div className="hero-main-text">
            <h1>Join Our Community of Volunteers</h1>
            <p>
              Join us in making a difference in our communities across Rwanda.
              Find opportunities to volunteer with organizations that match your
              interests. VolunteerSync brings volunteers and organizations
              together to build a better Rwanda. Start your journey with us
              today.
            </p>
            <div className="inner-options">
              <Link to="/onmap" style={{ textDecoration: "none" }}>
                <p style={{ cursor: "pointer" }}>Browse Projects</p>
              </Link>
              <Link to="/projects" style={{ textDecoration: "none" }}>
                <p style={{ cursor: "pointer" }}>Project Dashboard</p>
              </Link>
              <Link to="/profile" style={{ textDecoration: "none" }}>
                <button className="btn">Sign Up</button>
              </Link>
            </div>
          </div>
          <div>
            <img
              src="/assets/old-main.svg"
              alt="volunteer"
              className="volunteer"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="content stats">
          <div className="stats-header">
            <div className="stats-header-inner">
              <h1>{mockStats.totalProjects}+</h1>
              <p>Active Projects</p>
              <p>
                Ongoing volunteer opportunities across Kigali's districts, from
                education to environmental conservation, making real impact in
                communities.
              </p>
            </div>
            <div className="stats-header-inner">
              <h1>{mockStats.totalVolunteers.toLocaleString()}</h1>
              <p>Volunteers</p>
              <p>
                Dedicated individuals from across Rwanda contributing their time
                and skills to build stronger, more resilient communities
                together.
              </p>
            </div>
            <div className="stats-header-inner">
              <h1>{mockStats.completedProjects}+</h1>
              <p>Completed Projects</p>
              <p>
                Successfully delivered initiatives that have transformed lives
                and strengthened communities throughout Rwanda's capital city.
              </p>
            </div>
            <div className="stats-header-inner">
              <h1>{mockStats.totalOrganizations}+</h1>
              <p>Organizations</p>
              <p>
                Registered NGOs, government agencies, and community groups
                working together to address Rwanda's development challenges.
              </p>
            </div>
          </div>
          <div className="stats-body">
            <div className="stats-mission">
              <h6>Our Mission</h6>
              <h1>Empowering Communities Through Volunteering</h1>
              <p>
                Our goal is to make it easy for individuals to find volunteering
                opportunities that match their skills and passion. Together,
                we're building a stronger Rwanda through community engagement,
                skills development, and collaborative problem-solving. Join
                thousands of Rwandans who are already making a difference in
                education, healthcare, environment, and economic development.
              </p>
            </div>
            <img src="/assets/main.svg" alt="mission" />
          </div>
          <div className="stats-footer">
            <h1>Latest Projects</h1>
            <div className="stats-footer-stats-main">
              {latestProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="stats-footer-stats">
                    <img src="/assets/pinish.svg" alt="" />
                    <div className="stats-footer-stats-inner">
                      <h1>{project.title}</h1>
                      <p>
                        {typeof project.location === "string"
                          ? project.location
                          : `${project.location.city}, ${project.location.state}`}{" "}
                        | {project.organization}
                      </p>
                      <p>{project.description}</p>
                      <div className="stats-footer-stats-inner-time">
                        <p>
                          {project.duration} [{project.startDate}]
                        </p>
                        <p>
                          {project.volunteersRegistered}/
                          {project.volunteersNeeded} Volunteers
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Benefits Section */}
      <section className="volunteer">
        <div className="content volunteer-main">
          <div className="volunteer-main-text">
            <div className="volunteer-main-text-header">
              <h6>Benefits of Volunteering</h6>
              <h1>Why Volunteer in Rwanda</h1>
            </div>
            <p>
              Volunteering provides valuable community services while
              contributing to Rwanda's Vision 2050. It's not just about the
              community, but also about personal growth. Connect with your
              neighbors, learn new skills, and help build the Rwanda we all
              envision - developed, united, and prosperous.
            </p>
            <Link to="/onmap" style={{ textDecoration: "none" }}>
              <button>Find Out More</button>
            </Link>
          </div>
          <div>
            <img src="/assets/video.svg" alt="video" />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="join">
        <div className="content join-main">
          <div className="join-main-text">
            <h1>Ready to make a difference?</h1>
            <h3>Get involved today and help us build a better Rwanda.</h3>
          </div>
          <Link to="/onmap" style={{ textDecoration: "none" }}>
            <button className="btn">Join Us</button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <section className="footer">
        <div className="content footer-main">
          <div className="footer-logo">
            <div className="logo">
              <img src="/assets/logo.svg" alt="" />
              <p>VolunteerSync</p>
            </div>
            <p className="footer-logo-text">
              Connecting passionate volunteers with meaningful opportunities
              across Rwanda. Together, we're building stronger communities and a
              brighter future for all Rwandans. Join our mission to create
              lasting positive impact through volunteerism.
            </p>
            <div className="social-media">
              <img src="/assets/youtube.svg" alt="YouTube" />
              <img src="/assets/linkedin.svg" alt="LinkedIn" />
              <img src="/assets/instagram.svg" alt="Instagram" />
              <img src="/assets/telegram.svg" alt="Telegram" />
            </div>
          </div>
          <div className="footer-links">
            <h1>Useful Links</h1>
            <div className="footer-links-inner">
              <p>About Us</p>
              <p>Contact Us</p>
              <p>Organizations</p>
              <p>Support</p>
              <p>Volunteers</p>
            </div>
          </div>
          <div className="footer-links">
            <h1>Contact Us</h1>
            <div className="footer-contact">
              <img src="/assets/location.svg" alt="" />
              <p>Kigali, Rwanda</p>
            </div>
            <div className="footer-contact">
              <img src="/assets/mail.svg" alt="" />
              <p>info@volunteersync.rw</p>
            </div>
            <div className="footer-contact">
              <img src="/assets/phone.svg" alt="" />
              <p>+250 788 123 456</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Bottom */}
      <section className="footer-bottom">
        <div className="footer-bottom">
          <p>© 2024 VolunteerSync. All rights reserved.</p>
          <div className="footer-bottom-links">
            <p>Terms of Service</p>
            <p>Privacy Policy</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
