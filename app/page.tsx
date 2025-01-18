"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from "next/image";
import { PrayerTopic } from '../types';
import data from '../data/people.json';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PrayerTopic | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const people: PrayerTopic[] = data;

  useEffect(() => {
    if (name) {
      const person = people.find(p => p.name === name);
      setSelectedPerson(person || null);
      setIsPopupVisible(true);
    } else {
      setSelectedPerson(null);
      setIsPopupVisible(false);
    }
  }, [name, people]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (name: string) => {
    router.replace(`/?name=${encodeURIComponent(name)}`, { scroll: false });
  };

  const closePopup = () => {
    router.replace('/', { scroll: false });
  };

  const handleScrollClick = () => {
    const gridElement = document.querySelector(`.${styles.guideText}`);
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowScrollIndicator(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <Image
        src="/static/header.png"
        alt="Header Image"
        width={500}
        height={200}
        style={{ width: '100%', height: 'auto' }}
      />

      <p className={styles.guideText}>
        👆 사진을 클릭하면 각 선교팀원의 기도제목을 볼 수 있습니다
      </p>

      {showScrollIndicator && (
        <div
          className={styles.scrollIndicator}
          onClick={handleScrollClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleScrollClick();
            }
          }}
        >
          <span className={styles.scrollText}>아래로 스크롤하여<br />선교팀원들을 만나보세요</span>
          <div className={styles.scrollArrow}></div>
        </div>
      )}

      <div className={styles.grid}>
        {people.map((person, index) => (
          <div key={index} className={styles.card}
            onClick={() => handleClick(person.name)}
          >
            <div className={styles.imageContainer}>
              <Image
                src={`/static/people/${person.name}.png`}
                alt={person.name}
                fill
                className={styles.image}
              />
            </div>
            <p className={styles.name}>{person.name.replace('_', ' ')}</p>
          </div>
        ))}
      </div>

      {/* 팝업 렌더링 */}
      {isPopupVisible && selectedPerson && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            zIndex: 1000,
            maxWidth: '90%',
            width: '400px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            paddingBottom: '20px',
          }}>
            <div style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
            }}>
              <Image
                src={`/static/people/${selectedPerson.name}.png`}
                alt={selectedPerson.name}
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            </div>
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#333',
            }}>
              {selectedPerson.name.replace('_', ' ')}
            </h2>
          </div>

          <ol style={{
            paddingLeft: '24px',
            margin: '0',
            listStyleType: 'decimal',
            counterReset: 'item',
            fontSize: '0.95rem',
            lineHeight: '1.5',
          }}>
            {selectedPerson.prayerTopics.map((topic, index) => (
              <li
                key={index}
                style={{
                  marginBottom: '12px',
                  paddingLeft: '8px',
                  listStylePosition: 'outside',
                  color: '#444',
                  fontSize: '1.2rem',
                }}
              >
                {topic}
              </li>
            ))}
          </ol>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          }}>
            <button
              onClick={closePopup}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#000',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#333'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#000'}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 팝업 배경 */}
      {isPopupVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(2px)',
            zIndex: 999,
          }}
          onClick={closePopup}
        ></div>
      )}
    </div>
  );
}