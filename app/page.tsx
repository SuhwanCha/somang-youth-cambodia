"use client";

import { useState, useEffect, Suspense } from 'react';
import Image from "next/image";
import { PrayerTopic } from '../types';
import data from '../data/people.json';
import styles from './page.module.css';

function ClientContent() {


  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PrayerTopic | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const people: PrayerTopic[] = data;

  useEffect(() => {
    // URL에서 초기 name 파라미터 읽기
    const urlParams = new URLSearchParams(window.location.search);
    const initialName = urlParams.get('name');
    if (initialName) {
      const person = people.find(p => p.name === initialName);
      setSelectedPerson(person || null);
      setIsPopupVisible(true);
    }
  }, [people]);

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
    const person = people.find(p => p.name === name);
    setSelectedPerson(person || null);
    setIsPopupVisible(true);
    // URL 업데이트 (history state 사용)
    const newUrl = `${window.location.pathname}?name=${encodeURIComponent(name)}`;
    window.history.pushState({}, '', newUrl);
  };

  const closePopup = () => {
    setSelectedPerson(null);
    setIsPopupVisible(false);
    // URL 업데이트 (history state 사용)
    window.history.pushState({}, '', window.location.pathname);
  };

  // popstate 이벤트 리스너 추가
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get('name');
      if (name) {
        const person = people.find(p => p.name === name);
        setSelectedPerson(person || null);
        setIsPopupVisible(true);
      } else {
        setSelectedPerson(null);
        setIsPopupVisible(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [people]);

  const handleScrollClick = () => {
    const gridElement = document.querySelector(`.${styles.guideText}`);
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowScrollIndicator(false);
    }
  };

  const handleShare = async () => {
    if (selectedPerson) {
      try {
        await navigator.share({
          title: `${selectedPerson.name.replace('_', ' ')}의 기도제목`,
          text: `${selectedPerson.name.replace('_', ' ')}의 기도제목:\n${selectedPerson.prayerTopics.join('\n')}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleGlobalShare = async () => {
    try {
      await navigator.share({
        title: '소망교회 청년부 캄보디아 단기선교',
        text: '소망교회 청년부 캄보디아 단기선교팀의 기도제목을 확인해보세요.',
        url: window.location.href
      });
    } catch (error) {
      console.log('Error sharing:', error);
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
            <div className={`${styles.imageContainer} ${index < 12 ? styles.fourThree : styles.oneOne}`}>
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

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <button
            onClick={handleGlobalShare}
            className={styles.shareButton}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            공유하기
          </button>
          <a
            href="https://github.com/SuhwanCha/somang-youth-cambodia"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
            </svg>
            View source on GitHub
          </a>
        </div>
      </footer>

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
            gap: '12px',
          }}>
            <button
              onClick={handleShare}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: '1px solid #000',
                backgroundColor: '#fff',
                color: '#000',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
                e.currentTarget.style.borderColor = '#333';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.borderColor = '#000';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              공유하기
            </button>
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

export default function Home() {
  return (
    <Suspense
      fallback={
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px'
        }}>
          <div>Loading...</div>
        </div>
      }
    >
      <ClientContent />
    </Suspense>
  );
}