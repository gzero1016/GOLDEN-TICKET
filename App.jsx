import React, { useEffect, useState, useRef, useCallback } from 'react';
import './App.css';

function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const wrapperRef = useRef(null);
  const startYRef = useRef(0);

  const handleDragStart = (clientY) => {
    if (isOpened) return;
    setIsDragging(true);
    startYRef.current = clientY; // Y 좌표로 변경
  };

  const handleDragMove = useCallback((clientY) => {
    if (!isDragging || isOpened) return;
    
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    
    const rect = wrapper.getBoundingClientRect();
    const startY = startYRef.current;
    const currentY = clientY;
    const dragDistance = currentY - startY; // 아래로 드래그하면 양수
    const maxDrag = rect.height * 0.4; // 최대 드래그 거리
    const progress = Math.min(Math.max(dragDistance / maxDrag, 0), 1);
    
    setDragProgress(progress);
    
    // 80% 이상 드래그하면 자동으로 열림
    if (progress >= 0.8) {
      handleOpen();
    }
  }, [isDragging, isOpened]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging || isOpened) return;
    
    setDragProgress(prev => {
      // 50% 이상 드래그했으면 열림, 아니면 원래대로
      if (prev >= 0.5) {
        handleOpen();
        return 1;
      } else {
        return 0;
      }
    });
    setIsDragging(false);
  }, [isDragging, isOpened]);

  const handleOpen = useCallback(() => {
    if (!isOpened) {
      setIsOpened(true);
      setDragProgress(1);
      setTimeout(() => {
        setIsVisible(true);
      }, 1100);
    }
  }, [isOpened]);

  // 마우스 이벤트
  useEffect(() => {
    if (!isDragging || isOpened) return;

    const handleMouseMove = (e) => {
      handleDragMove(e.clientY);
    };
    const handleMouseUp = () => {
      handleDragEnd();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isOpened, handleDragMove, handleDragEnd]);

  // 터치 이벤트
  const handleTouchStart = (e) => {
    e.preventDefault();
    handleDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleDragEnd();
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


  return (
    <div className="app-container">
      <div 
        ref={wrapperRef}
        className={`chocolate-wrapper ${isOpened ? 'opened' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{
          '--drag-progress': dragProgress,
        }}
      >
        {/* 좌측 톱니바퀴 절취선 */}
        <div 
          className={`tear-line-left ${isOpened ? 'torn' : ''}`}
          style={{
            '--drag-progress': dragProgress,
          }}
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="tear-line-gear">
            {!isOpened && <div className="drag-hint-left">↓ 드래그하여 열기</div>}
          </div>
        </div>
        
        {/* 절취선 위 드래그 힌트 */}
        {!isOpened && <div className="drag-hint-top">↓ 드래그하여 열기</div>}

        {/* 하랑 로고 마크 */}
        <div className="harang-logo">
          <img src="/GOLDEN-TICKET/harang.png" alt="하랑" className="harang-logo-image" />
          <div className="harang-chocolate-text">하랑</div>
        </div>

        {/* 포장지 본체 (찢어지는 효과) */}
        <div className={`wrapper-body ${isOpened ? 'torn' : ''}`}>
          <div className="wrapper-body-left-wrapper" style={{ '--drag-progress': dragProgress }}>
            <div className="wrapper-body-left">
              <div className="gear-teeth"></div>
            </div>
          </div>
          <div className="wrapper-body-right"></div>
        </div>
      </div>
      {/* 초콜릿 가운데에서 나오는 황금빛 */}
      {isOpened && <div className="chocolate-golden-glow"></div>}
      {isOpened && (
        <div className={`golden-ticket ${isVisible ? 'visible' : ''}`}>
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
              <div className="ticket-brand">초대장</div>
            </div>
          </div>
          {/* <h1 className="ticket-title">GOLDEN TICKET</h1> */}

          <div className="ticket-divider"></div>
          
          <div className="ticket-message">
            <div className="message-title">드디어 사고 쳤습니다!</div>
            <div className="message-content">
              "얘네 진짜 하나?" 하셨던 분들, 진짜 합니다!<br />
              두 친구가 만든 공간에서 정성껏 고사를 지내려 합니다.<br />
              돼지 입 찢어지게 기(氣) 넣어주실 귀빈 여러분을 모십니다. 
              {/* 오셔서 좋은 기운도 나눠 가지시고, 저희의 앞날도 축복해주세요! */}
            </div>
          </div>
          {/* <div className="ticket-bottom-text">THIS GOLDEN TICKET ENSURES ADMITTANCE</div> */}
        </div>

        {/* 티켓 테두리 효과 */}
        <div className="ticket-border"></div>
        <div className="ticket-glow"></div>
      </div>
      )}
      
      {/* 티켓 밖 정보 */}
      {isOpened && isVisible && (
        <div className="ticket-info-below">
          <div className="info-item">
            <div className="info-label">PLACE</div>
            <div className="info-value">하랑 음악줄넘기 율하점</div>
          </div>
          <div className="info-item">
            <div className="info-label">ADDRESS</div>
            <div className="info-value">경남 김해시 율하2로115번길 11<br />현대프라자 2층</div>
          </div>
          <div className="info-item">
            <div className="info-label">DATE</div>
            <div className="info-value">2026.01.11 (일) PM 17:00 ~ 21:00</div>
          </div>
          <div className="info-item">
            <div className="info-label">마음전하기</div>
            <div className="info-value">카카오 3333040317882 안주현</div>
            <div className="info-value">카카오 3333043982635 김현수</div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

