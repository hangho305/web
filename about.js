

const aboutMobileScroll =
  document.querySelector(".about-mobile-scroll");


if (aboutMobileScroll) {

  function updateAboutMobile() {

    

    if (window.innerWidth > 800) {

      aboutMobileScroll.classList.remove("is-details");

      return;
    }


    const rect =
      aboutMobileScroll.getBoundingClientRect();



    const scrollDistance =
      aboutMobileScroll.offsetHeight -
      window.innerHeight;


    const progress =
      Math.min(
        Math.max(-rect.top / scrollDistance, 0),
        1
      );



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



const hoverSound = new Audio("audio/hover-sound.mp3");

hoverSound.volume = 0.25;

const hoverTargets = document.querySelectorAll(
  ".logo, .navigation a, .sound-control"
);

hoverTargets.forEach((item) => {
  item.addEventListener("mouseenter", () => {

    hoverSound.currentTime = 0;

    hoverSound.play().catch(() => {
    });

  });
});


const magneticLinks =
  document.querySelectorAll(".nav-magnetic");

magneticLinks.forEach((link) => {

  link.addEventListener("mousemove", (event) => {

    const rect = link.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;


    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;


    
    const strength = 0.18;

    const moveX = mouseX * strength;
    const moveY = mouseY * strength;


    link.style.transform =
      `translate3d(${moveX}px, ${moveY}px, 0)`;

  });



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


const resumeOverlay =
  document.getElementById("resumeOverlay");

const resumeImage =
  document.querySelector(".resume-full");

const computerButtons =
  document.querySelectorAll(".about-computer");


const resumeSound =
  new Audio("audio/resume-sound.mp3");

resumeSound.volume = 0.5;



computerButtons.forEach((computer) => {

  computer.style.cursor = "pointer";

  computer.addEventListener("click", () => {

    /* play paper sound */
    resumeSound.currentTime = 0;

    resumeSound.play().catch(() => {
    });


    resumeOverlay.classList.add("is-open");

  });

});


resumeOverlay.addEventListener("click", () => {

  resumeOverlay.classList.remove("is-open");

});



resumeImage.addEventListener("click", (event) => {

  event.stopPropagation();

});



document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {

    resumeOverlay.classList.remove("is-open");

  }

});


const computers =
  document.querySelectorAll(".about-computer");

const computerHoverSound =
  new Audio("audio/hover-sound.mp3");

computerHoverSound.volume = 0.25;


computers.forEach((computer) => {


  computer.addEventListener("mouseenter", () => {

    computerHoverSound.currentTime = 0;

    computerHoverSound.play().catch(() => {
    });

  });



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



    const strength = 0.12;

    const moveX = mouseX * strength;
    const moveY = mouseY * strength;


    computer.style.transform =
      `translate3d(${moveX}px, ${moveY}px, 0) scale(1.05)`;

  });



  computer.addEventListener("mouseleave", () => {

    computer.style.transform =
      "translate3d(0, 0, 0) scale(1)";

  });

});


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

    pageTransition.style.display = "none";

  }

}


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

    sessionStorage.setItem(
  "pageTransitionActive",
  "true"
);


    transitionSound.currentTime = 0;

    transitionSound.play().catch(() => {});



    pageTransition.classList.remove(
      "is-hidden"
    );

    pageTransition.classList.add(
      "is-entering"
    );



    setTimeout(() => {

      window.location.href = destination;

    }, 850);

  });

});


const draggableStatements =
  document.querySelectorAll(".about-statement > span");

draggableStatements.forEach((item) => {

  let isDragging = false;
  let startMouseX = 0;
  let startMouseY = 0;

  let startX = 0;
  let startY = 0;

  let x = 0;
  let y = 0;


  item.addEventListener("pointerdown", (event) => {

    /* desktop only */
    if (window.innerWidth <= 800) return;

    isDragging = true;

    startMouseX = event.clientX;
    startMouseY = event.clientY;

    startX = x;
    startY = y;

    item.classList.add("is-dragging");

    item.setPointerCapture(event.pointerId);

    event.preventDefault();

  });


  item.addEventListener("pointermove", (event) => {

    if (!isDragging) return;

    const deltaX =
      event.clientX - startMouseX;

    const deltaY =
      event.clientY - startMouseY;

    x = startX + deltaX;
    y = startY + deltaY;

    item.style.transform =
      `translate3d(${x}px, ${y}px, 0)`;

  });


  item.addEventListener("pointerup", (event) => {

    if (!isDragging) return;

    isDragging = false;

    item.classList.remove("is-dragging");

    item.releasePointerCapture(event.pointerId);

  });


  item.addEventListener("pointercancel", () => {

    isDragging = false;

    item.classList.remove("is-dragging");

  });

});