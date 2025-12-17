import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

interface ModuleCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, image, link }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <Link href={image} target="_blank">
          <img src={image} alt={title} />
        </Link>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
        <Link to={link} className={styles.cardButton}>
          Start Module
        </Link>
      </div>
    </div>
  );
};

export default ModuleCard;
