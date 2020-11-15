// 익명 함수 화살표함수
// 전역 변수 사용을 피할려고
// 이름 충돌을 피하고 javaScript 에서는  전역벼수 사용이
// 바람직한 표현이 아니다
(() => {
  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현제 스크롤 위치(yOffset) 보다 이전에 위치한 스크롤 섹션들의 스크롤 높이 값의 합
  let currentScene = 0; // 현제 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let enterNewScene = false; //새로운 씬이 시작된 순간 true

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
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
      },
      values: {
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        // messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageA_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],

        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
      },
    },
    {
      // 1
      type: "normal",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
      },
    },
    {
      // 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
    },
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }

  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partSCrollEnd = values[2].end + scrollHeight;
      const partScrollHeight = partSCrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partSCrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partSCrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = (yOffset - prevScrollHeight) / scrollHeight;

    switch (currentScene) {
      case 0:
        // console.log('0 play')
        const messageA_opacity_in = calcValues(
          values.messageA_opacity_in,
          currentYOffset
        );

        const messageA_opacity_out = calcValues(
          values.messageA_opacity_out,
          currentYOffset
        );
        const messageA_translateY_in = calcValues(
          values.messageA_translateY_in,
          currentYOffset
        );

        const messageA_translateY_out = calcValues(
          values.messageA_translateY_out,
          currentYOffset
        );
        if (scrollRatio <= 0.22) {
          //in
          objs.messageA.style.opacity =calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
        } else {
          //out
          objs.messageA.style.opacity = messageA_opacity_out;
          objs.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
        }
        break;

      case 1:
        // console.log("1 play");
        break;

      case 2:
        // console.log("2 play");
        break;

      case 3:
        // console.log("3 play");
        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene == 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }
    //메뉴 때문에 크기가 생각 처럼 안맞음
    // 그래서 nav를 position를 absolute로 설정
    // 밖에다 하는 이유는 0번 쨰 를 보여줄떄 스크롤이 1로 가야 그떄 적용이 되는 이유 때문이다
    if (enterNewScene) return;

    playAnimation();
  }
  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });

  // window.addEventListener('DOMContentLoaded', setLayout);
  window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
})();
