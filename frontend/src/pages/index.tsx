import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './index.module.css';

const Home = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    gallery: false,
    stats: false
  });

  useEffect(() => {
    // Simple animation trigger on component mount
    setIsVisible({
      hero: true,
      features: true,
      gallery: true,
      stats: true
    });
  }, []);

  // Features data
  const features = [
    {
      title: "Advanced AI Models",
      description: "Cutting-edge AI algorithms for robotics and autonomous systems.",
      icon: "🤖"
    },
    {
      title: "ROS Integration",
      description: "Seamless integration with Robot Operating System for development.",
      icon: "⚙️"
    },
    {
      title: "NVIDIA Isaac",
      description: "Powerful platform for developing and testing AI robotics applications.",
      icon: "🚀"
    }
  ];

  // Gallery images from Unsplash
  const galleryItems = [
    {
      image: "https://images.unsplash.com/photo-1677442135722-5f11e06a4e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "AI Robotics",
      description: "Advanced AI-powered robots in action"
    },
    {
      image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Machine Learning",
      description: "Neural networks and deep learning applications"
    },
    {
      image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Humanoid Design",
      description: "Sophisticated humanoid robot designs"
    },
    {
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Autonomous Systems",
      description: "Self-navigating and decision-making robots"
    },
    {
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "Industrial Automation",
      description: "Robotic solutions for manufacturing"
    },
    {
      image: "https://images.unsplash.com/photo-1629927833316-9b322a0737b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      title: "AI Research",
      description: "Latest innovations in artificial intelligence"
    }
  ];

  // Stats data
  const stats = [
    { value: "500+", label: "Active Contributors" },
    { value: "12", label: "AI Projects" },
    { value: "5", label: "Hackathons" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="Master the Future of Embodied Intelligence - From ROS 2 to NVIDIA Isaac"
    >
      <main className={styles.mainContent}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroBackground}></div>
          <div className={`${styles.heroContent} ${isVisible.hero ? styles.fadeInUp : ''}`}>
            <div className={styles.heroContainer}>
              <div className={styles.heroHeader}>
                <h1 className={styles.heroTitle}>
                  Physical AI & Humanoid Robotics
                </h1>
                <p className={styles.heroSubtitle}>
                  Master the Future of Embodied Intelligence - From ROS 2 to NVIDIA Isaac
                </p>
                <div className={styles.heroButtons}>
                  <Link
                    to="docs/intro"
                    className={`${styles.heroButton} ${styles.primary}`}
                  >
                    Get Started
                  </Link>
                  <Link
                    to="https://github.com/AatfaSiddiqui786/hackathon-book"
                    className={`${styles.heroButton} ${styles.outline}`}
                  >
                    View on GitHub
                  </Link>
                </div>
              </div>
              <div className={styles.robotContainer}>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={styles.robotVideo}
                >
                  <source
                    src="/robort.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <h2 className={`${styles.sectionTitle} ${isVisible.features ? styles.fadeInUp : ''}`}>
              Advanced AI Capabilities
            </h2>
            <p className={`${styles.sectionSubtitle} ${isVisible.features ? `${styles.fadeInUp} ${styles.delay_1}` : ''}`}>
              Cutting-edge technology and methodologies for the next generation of robotics
            </p>
            <div className={`${styles.featuresGrid} ${isVisible.features ? `${styles.fadeInUp} ${styles.delay_2}` : ''}`}>
              {features.map((feature, index) => (
                <div key={index} className={styles.featureCard}>
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.statsContainer}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section className={styles.gallerySection}>
          <div className={styles.galleryContainer}>
            <h2 className={`${styles.sectionTitle} ${isVisible.gallery ? styles.fadeInUp : ''}`}>
              Robotics in Action
            </h2>
            <p className={`${styles.sectionSubtitle} ${isVisible.gallery ? `${styles.fadeInUp} ${styles.delay_1}` : ''}`}>
              Cutting-edge robotics and AI implementations
            </p>
            <div className={`${styles.galleryGrid} ${isVisible.gallery ? `${styles.fadeInUp} ${styles.delay_2}` : ''}`}>
              {galleryItems.map((item, index) => (
                <div key={index} className={styles.galleryItem}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.galleryImage}
                    loading="lazy"
                  />
                  <div className={styles.galleryCaption}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;