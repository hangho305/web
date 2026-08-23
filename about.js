
/* =========================================
   ABOUT MOBILE SCROLL TRANSITION
========================================= */

const aboutMobileScroll =
  document.querySelector(".about-mobile-scroll");


if (aboutMobileScroll) {

  function updateAboutMobile() {

    /*
      Only run mobile behaviour
    */

    if (window.innerWidth > 800) {

      aboutMobileScroll.classList.remove("is-details");

      return;
    }


    const rect =
      aboutMobileScroll.getBoundingClientRect();


    /*
      total scrollable distance inside
      the 200vh about section
    */

    const scrollDistance =
      aboutMobileScroll.offsetHeight -
      window.innerHeight;


    /*
      how far through the about mobile
      section we have scrolled

      0 = intro
      1 = details
    */

    const progress =
      Math.min(
        Math.max(-rect.top / scrollDistance, 0),
        1
      );


    /*
      halfway → switch panels
    */

    if (progress > 0.15) {

      aboutMobileScroll.classList.add(
        "is-details"
      );

    } else {

      aboutMobileScroll.classList.remove(
        "is-details"
      );

    }

  }


  window.addEventListener(
    "scroll",
    updateAboutMobile,
    { passive: true }
  );


  window.addEventListener(
    "resize",
    updateAboutMobile
  );


  updateAboutMobile();

}

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

const soundControl = document.getElementById("soundControl");
const bgMusic = document.getElementById("bgMusic");
const soundLabel = soundControl.querySelector(".sound-label");
bgMusic.volume = 0.4;

let isPlaying = false;

function turnSoundOn() {
  bgMusic.play();

  isPlaying = true;

  soundControl.classList.add("is-playing");
  soundControl.classList.remove("is-muted");

  soundLabel.textContent = "sound: on";
}

function turnSoundOff() {
  bgMusic.pause();

  isPlaying = false;

  soundControl.classList.remove("is-playing");
  soundControl.classList.add("is-muted");

  soundLabel.textContent = "sound: off";
}

soundControl.addEventListener("click", () => {
  if (isPlaying) {
    turnSoundOff();
  } else {
    turnSoundOn();
  }
});

/* =========================================
   RESUME OVERLAY
========================================= */

const resumeOverlay =
  document.getElementById("resumeOverlay");

const resumeImage =
  document.querySelector(".resume-full");

const computerButtons =
  document.querySelectorAll(".about-computer");


/* PAPER SOUND */

const resumeSound =
  new Audio("audio/resume-sound.mp3");

resumeSound.volume = 0.5;


/* OPEN */

computerButtons.forEach((computer) => {

  computer.style.cursor = "pointer";

  computer.addEventListener("click", () => {

    /* play paper sound */
    resumeSound.currentTime = 0;

    resumeSound.play().catch(() => {
      // browser may block audio
    });


    /* open resume */
    resumeOverlay.classList.add("is-open");

  });

});


/* CLICK OUTSIDE → CLOSE */

resumeOverlay.addEventListener("click", () => {

  resumeOverlay.classList.remove("is-open");

});


/* CLICK RESUME → DON'T CLOSE */

resumeImage.addEventListener("click", (event) => {

  event.stopPropagation();

});


/* ESC → CLOSE */

document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {

    resumeOverlay.classList.remove("is-open");

  }

});

/* =========================================
   COMPUTER HOVER + MAGNETIC
========================================= */

const computers =
  document.querySelectorAll(".about-computer");

/* reuse hover sound */
const computerHoverSound =
  new Audio("audio/hover-sound.mp3");

computerHoverSound.volume = 0.25;


computers.forEach((computer) => {

  /* -------------------------
     HOVER SOUND
  ------------------------- */

  computer.addEventListener("mouseenter", () => {

    computerHoverSound.currentTime = 0;

    computerHoverSound.play().catch(() => {
      // browser may block audio before interaction
    });

  });


  /* -------------------------
     FOLLOW CURSOR
  ------------------------- */

  computer.addEventListener("mousemove", (event) => {

    const rect = computer.getBoundingClientRect();

    const centerX =
      rect.left + rect.width / 2;

    const centerY =
      rect.top + rect.height / 2;


    const mouseX =
      event.clientX - centerX;

    const mouseY =
      event.clientY - centerY;


    /*
      nhỏ hơn navbar một chút
      0.08 = subtle
      0.12 = recommend
      0.18 = rõ
    */

    const strength = 0.12;

    const moveX = mouseX * strength;
    const moveY = mouseY * strength;


    computer.style.transform =
      `translate3d(${moveX}px, ${moveY}px, 0) scale(1.05)`;

  });


  /* -------------------------
     RESET
  ------------------------- */

  computer.addEventListener("mouseleave", () => {

    computer.style.transform =
      "translate3d(0, 0, 0) scale(1)";

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


if (pageTransition) {

  const shouldPlayTransition =
    sessionStorage.getItem(
      "pageTransitionActive"
    );

  if (shouldPlayTransition === "true") {

    /* dùng flag xong thì xoá ngay */
    sessionStorage.removeItem(
      "pageTransitionActive"
    );

    window.addEventListener("load", () => {

      requestAnimationFrame(() => {

        requestAnimationFrame(() => {

          pageTransition.classList.add(
            "is-hidden"
          );

        });

      });

    });

  } else {

    /* page không đến từ circle transition */
    pageTransition.style.display = "none";

  }

}

/* =========================================
   CLICK NAVIGATION
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


    /*
      Không có href thì bỏ qua
    */

    if (!destination) return;


    /*
      Ngăn browser chuyển page ngay lập tức
    */

    event.preventDefault();

    sessionStorage.setItem(
  "pageTransitionActive",
  "true"
);


    /* SOUND */

    transitionSound.currentTime = 0;

    transitionSound.play().catch(() => {});


    /* SHOW TRANSITION */

    pageTransition.classList.remove(
      "is-hidden"
    );

    pageTransition.classList.add(
      "is-entering"
    );


    /*
      Chờ vòng tròn cover screen
      rồi mới chuyển page
    */

    setTimeout(() => {

      window.location.href = destination;

    }, 850);

  });

});