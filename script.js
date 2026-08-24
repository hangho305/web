/* =========================================
   BACKGROUND MUSIC — HOME ONLY
========================================= */

const soundControl = document.getElementById("soundControl");
const bgMusic = document.getElementById("bgMusic");
const soundLabel = soundControl.querySelector(".sound-label");

bgMusic.volume = 0.4;

let isPlaying = false;


/* =========================
   SOUND ON
========================= */

async function turnSoundOn() {

  try {

    await bgMusic.play();

    isPlaying = true;

    soundControl.classList.add("is-playing");
    soundControl.classList.remove("is-muted");

    soundLabel.textContent = "sound: on";

  } catch (error) {

    /* browser blocked autoplay */

    isPlaying = false;

    soundControl.classList.remove("is-playing");
    soundControl.classList.add("is-muted");

    soundLabel.textContent = "sound: off";

  }

}


/* =========================
   SOUND OFF
========================= */

function turnSoundOff() {

  bgMusic.pause();

  isPlaying = false;

  soundControl.classList.remove("is-playing");
  soundControl.classList.add("is-muted");

  soundLabel.textContent = "sound: off";

}


/* =========================
   SOUND BUTTON
========================= */

soundControl.addEventListener("click", () => {

  if (isPlaying) {
    turnSoundOff();
  } else {
    turnSoundOn();
  }

});


/* =========================
   TRY AUTOPLAY ON HOME
========================= */

window.addEventListener("load", () => {

  turnSoundOn();

});

/* =========================
   HERO TEXT WARP
========================= */

const heroTitle = document.querySelector(".hero-title");

const warpTargets = heroTitle.querySelectorAll(
  ".hero-hello, " +
  ".hero-name, " +
  ".hero-multi, " +
  ".hero-designer, " +
  ".hero-welcome strong, " +
  ".hero-welcome span, " +
  ".hero-portfolio, " +
  ".hero-bracket, " +
  ".hero-year"
);


/* -------------------------
   SPLIT TEXT INTO CHARACTERS
------------------------- */

function splitTextIntoChars(element) {
  const nodes = Array.from(element.childNodes);

  nodes.forEach((node) => {

    /* only split actual text */
    if (node.nodeType === Node.TEXT_NODE) {

      const fragment = document.createDocumentFragment();

      [...node.textContent].forEach((character) => {

        const span = document.createElement("span");

        if (character === " ") {
          span.className = "warp-space";
          span.innerHTML = "&nbsp;";
        } else {
          span.className = "warp-char";
          span.textContent = character;
        }

        fragment.appendChild(span);
      });

      node.replaceWith(fragment);
    }

    /* keep things like <br> untouched */
  });
}


warpTargets.forEach(splitTextIntoChars);


const chars = heroTitle.querySelectorAll(".warp-char");


/* -------------------------
   SETTINGS
------------------------- */

/*
  radius = how large the affected area is
  strength = how far letters move
*/

let radius = 120;
let strength = 18;


/* -------------------------
   MOUSE MOVE
------------------------- */

heroTitle.addEventListener("mousemove", (event) => {

  heroTitle.classList.remove("is-resetting");

  const mouseX = event.clientX;
  const mouseY = event.clientY;


  chars.forEach((char) => {

    const rect = char.getBoundingClientRect();

    const charX = rect.left + rect.width / 2;
    const charY = rect.top + rect.height / 2;


    /* distance between mouse and character */
    const dx = mouseX - charX;
    const dy = mouseY - charY;

    const distance = Math.sqrt(
      dx * dx + dy * dy
    );


    /* outside warp radius = normal */
    if (distance > radius) {

      char.style.transform =
        "translate3d(0, 0, 0) scaleX(1) scaleY(1) rotate(0deg)";

      return;
    }


    /*
      influence:
      1 = directly under mouse
      0 = edge of radius
    */

    let influence = 1 - distance / radius;

    /* soften falloff */
    influence = influence * influence;


    /* pull letters toward cursor */
    const moveX =
      dx * influence * 0.22;

    const moveY =
      dy * influence * 0.22;


    /*
      stretch based on cursor direction
    */

    const stretchX =
      1 + Math.abs(dx / radius) * influence * 3;

    const stretchY =
      1 + Math.abs(dy / radius) * influence * 3;


    /* subtle rotation */
    const rotate =
      (dx / radius) * influence * 8;


    char.style.transform = `
      translate3d(
        ${moveX}px,
        ${moveY}px,
        0
      )
      scaleX(${stretchX})
      scaleY(${stretchY})
      rotate(${rotate}deg)
    `;
  });

});


/* -------------------------
   RESET WHEN MOUSE LEAVES
------------------------- */

heroTitle.addEventListener("mouseleave", () => {

  heroTitle.classList.add("is-resetting");

  chars.forEach((char) => {

    char.style.transform =
      "translate3d(0, 0, 0) scaleX(1) scaleY(1) rotate(0deg)";

  });

});

/* =========================================
   INTRO LOADER
========================================= */

const introLoader = document.getElementById("introLoader");
const loadingDots = document.getElementById("loadingDots");


/* -------------------------
   LOADING DOTS
------------------------- */

let dotCount = 1;

const dotAnimation = setInterval(() => {

  dotCount++;

  if (dotCount > 3) {
    dotCount = 1;
  }

  loadingDots.textContent = ".".repeat(dotCount);

}, 400);



/* -------------------------
   CLOSE LOADER
------------------------- */

window.addEventListener("load", () => {

  (window.scene3dReady || Promise.resolve()).then(() => {

  /*
    Cho loader tồn tại tối thiểu một chút
    để animation không flash quá nhanh.
  */

  setTimeout(() => {

    clearInterval(dotAnimation);

    introLoader.classList.add("is-closing");


    /*
      Sau khi exit animation xong
      remove loader hoàn toàn
    */

    setTimeout(() => {

      introLoader.remove();

    }, 1300);


  }, 1200);

  });

});

/* =========================
   NAV HOVER SOUND
========================= */

const hoverSound = new Audio("audio/hover-sound.mp3");

hoverSound.volume = 0.25;

const hoverTargets = document.querySelectorAll(
  ".logo, .navigation a, .sound-control"
);

hoverTargets.forEach((item) => {
  item.addEventListener("mouseenter", () => {

    hoverSound.currentTime = 0;

    hoverSound.play().catch(() => {
      // Browser may block audio before first user interaction
    });

  });
});

/* =========================
   MAGNETIC NAVIGATION
========================= */

const magneticLinks =
  document.querySelectorAll(".nav-magnetic");

magneticLinks.forEach((link) => {

  link.addEventListener("mousemove", (event) => {

    const rect = link.getBoundingClientRect();

    /*
      vị trí tâm của button
    */
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;


    /*
      cursor cách tâm bao nhiêu
    */
    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;


    /*
      MAGNETIC STRENGTH

      0.12 = rất nhẹ
      0.18 = recommend
      0.25 = rõ hơn
    */
    const strength = 0.18;

    const moveX = mouseX * strength;
    const moveY = mouseY * strength;


    link.style.transform =
      `translate3d(${moveX}px, ${moveY}px, 0)`;

  });


  /* cursor rời button → trở về */

  link.addEventListener("mouseleave", () => {

    link.style.transform =
      "translate3d(0, 0, 0)";

  });

});

/* =========================================
   PAGE TRANSITION
========================================= */

const pageTransition =
  document.getElementById("pageTransition");

const transitionSound =
  new Audio("audio/transition-sound.mp3");

transitionSound.volume = 0.5;


/* HOME LOADS WITHOUT CIRCLE */

if (pageTransition) {
  pageTransition.style.display = "none";
}


/* =========================================
   ONLY ABOUT + PROJECTS
========================================= */

const transitionLinks =
  document.querySelectorAll(
    '.navigation a[href="about.html"], ' +
    '.navigation a[href="projects.html"]'
  );


transitionLinks.forEach((link) => {

  link.addEventListener("click", (event) => {

    const destination =
      link.getAttribute("href");

    if (!destination) return;

    event.preventDefault();


    /* Tell next page to play reveal */

    sessionStorage.setItem(
      "pageTransitionActive",
      "true"
    );


/* =========================================
   PREPARE CIRCLE
========================================= */

/* cho circle xuất hiện nhưng vẫn đang scale(0) */
pageTransition.style.display = "flex";

pageTransition.classList.remove("is-entering");
pageTransition.classList.add("is-hidden");


/* SOUND */

transitionSound.currentTime = 0;
transitionSound.play().catch(() => {});


/* =========================================
   NEXT FRAME → CIRCLE GROWS
========================================= */

requestAnimationFrame(() => {

  requestAnimationFrame(() => {

    pageTransition.classList.remove("is-hidden");
    pageTransition.classList.add("is-entering");

  });

});

    /* CHANGE PAGE */

    setTimeout(() => {

      window.location.href = destination;

    }, 850);

  });

});