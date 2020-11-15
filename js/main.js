// 익명 함수 화살표함수
// 전역 변수 사용을 피할려고
// 이름 충돌을 피하고 javaScript 에서는  전역벼수 사용이
// 바람직한 표현이 아니다
(() => {
  const sceneInfo = [
    // 처음에 있어야 할 정보 타임라인의 높이 스크롤 구간에 따라서
    // 스크롤 높이를 미리 잡아둘것
    // 0 으로 세팅한 이유는 여러 디바이스 에서 열 수 있기 때문에
    // 높이를 고정이 아닌 스크린 높이의 배수로 줄것이다
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우져 높이의 5배로 scrollHeight 설정
      scrollHeight: 0,
      objs:{
        container: document.querySelector('#scroll-section-0')
      }
    },
    {
      // 1
      type: "normal",
      heightNum: 5,
      scrollHeight: 0,
      objs:{
        container: document.querySelector('#scroll-section-1')
      }
    },
    {
      // 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs:{
        container: document.querySelector('#scroll-section-2')
      }
    },
    {
      // 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs:{
        container: document.querySelector('#scroll-section-3')
      }
    },
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height=`${sceneInfo[i].scrollHeight}px`;
    }
  }

  window.addEventListener('resize' ,setLayout);
  
  setLayout();
})();
