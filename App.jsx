import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  const handleOpenEnvelope = () => {
    if (!isOpened) {
      setIsOpened(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 1100);
    }
  };

  useEffect(() => {
    if (isOpened) {
      // 반짝이는 효과를 위한 스파클 생성
      const sparkleInterval = setInterval(() => {
        setSparkles(prev => {
          const newSparkles = Array.from({ length: 5 }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 0.5,
          }));
          return [...prev.slice(-10), ...newSparkles];
        });
      }, 2000);

      return () => clearInterval(sparkleInterval);
    }
  }, [isOpened]);

  // 3행 6열 = 18개 조각 생성
  const chocolatePieces = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    row: Math.floor(i / 6),
    col: i % 6,
    breakX: (Math.random() - 0.5) * 2,
    breakY: (Math.random() - 0.5) * 2,
    breakRotate: (Math.random() - 0.5) * 720,
  }));

  return (
    <div className="app-container">
      <div 
        className={`chocolate-bar ${isOpened ? 'broken' : ''}`} 
        onClick={handleOpenEnvelope}
      >
        <div className="chocolate-grid">
          {chocolatePieces.map((piece) => (
            <div
              key={piece.id}
              className={`chocolate-piece piece-${piece.id} ${isOpened ? 'broken' : ''}`}
              style={{
                gridRow: piece.row + 1,
                gridColumn: piece.col + 1,
                '--break-x': piece.breakX,
                '--break-y': piece.breakY,
                '--break-rotate': `${piece.breakRotate}deg`,
                animationDelay: `${piece.id * 0.02}s`,
              }}
            />
          ))}
        </div>
        {!isOpened && <div className="click-hint">클릭하여 열기</div>}
      </div>
      {/* 초콜릿 가운데에서 나오는 황금빛 */}
      {isOpened && <div className="chocolate-golden-glow"></div>}
      {isOpened && (
        <div className={`golden-ticket ${isVisible ? 'visible' : ''}`}>
        {/* 톱니 모양 가장자리 (좌우만) */}
        <div className="ticket-perforation left"></div>
        <div className="ticket-perforation right"></div>
        {/* 배경 반짝임 효과 */}
        <div className="sparkle-container">
          {sparkles.map(sparkle => (
            <div
              key={sparkle.id}
              className="sparkle"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                animationDelay: `${sparkle.delay}s`,
              }}
            />
          ))}
        </div>


        {/* 메인 콘텐츠 */}
        <div className="ticket-content">
          <div className="ticket-header">
            <div className="ticket-stamp">
              <div className="stamp-date">2026</div>
              <div className="stamp-month">JAN</div>
              <div className="stamp-day">11</div>
            </div>
            <div className="ticket-header-content">
              <div className="ticket-brand">개관식 초대장</div>
            </div>
          </div>
          <h1 className="ticket-title">GOLDEN TICKET</h1>

          <div className="ticket-divider"></div>
          <div className="ticket-footer">
            <div className="footer-left">
              <div className="footer-label">PLACE</div>
              <div className="footer-value">하랑 음악줄넘기 율하점</div>
            </div>
            <div className="footer-center">
              <div className="footer-label">DATE</div>
              <div className="footer-value">2026.01.11</div>
            </div>
            <div className="footer-right">
            <div className="footer-label">Address</div>
            <div className="footer-value">경남 김해시 율하2로115번길 11</div>
            </div>
          </div>
          {/* <div className="ticket-bottom-text">THIS GOLDEN TICKET ENSURES ADMITTANCE</div> */}
        </div>

        {/* 티켓 테두리 효과 */}
        <div className="ticket-border"></div>
        <div className="ticket-glow"></div>
      </div>
      )}
    </div>
  );
}

export default App;

