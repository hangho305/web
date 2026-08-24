

const soundControl = document.getElementById("soundControl");
const bgMusic = document.getElementById("bgMusic");
const soundLabel = soundControl.querySelector(".sound-label");

bgMusic.volume = 0.4;

let isPlaying = false;



async function turnSoundOn() {

  try {

    await bgMusic.play();

    isPlaying = true;

    soundControl.classList.add("is-playing");
    soundControl.classList.remove("is-muted");

    soundLabel.textContent = "sound: on";

  } catch (error) {


    isPlaying = false;

    soundControl.classList.remove("is-playing");
    soundControl.classList.add("is-muted");

    soundLabel.textContent = "sound: off";

  }

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


window.addEventListener("load", () => {

  turnSoundOn();

});


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

  });
}


warpTargets.forEach(splitTextIntoChars);


const chars = heroTitle.querySelectorAll(".warp-char");


let radius = 120;
let strength = 18;


heroTitle.addEventListener("mousemove", (event) => {

  heroTitle.classList.remove("is-resetting");

  const mouseX = event.clientX;
  const mouseY = event.clientY;


  chars.forEach((char) => {

    const rect = char.getBoundingClientRect();

    const charX = rect.left + rect.width / 2;
    const charY = rect.top + rect.height / 2;


    const dx = mouseX - charX;
    const dy = mouseY - charY;

    const distance = Math.sqrt(
      dx * dx + dy * dy
    );


    if (distance > radius) {

      char.style.transform =
        "translate3d(0, 0, 0) scaleX(1) scaleY(1) rotate(0deg)";

      return;
    }


    let influence = 1 - distance / radius;

    influence = influence * influence;


    const moveX =
      dx * influence * 0.22;

    const moveY =
      dy * influence * 0.22;



    const stretchX =
      1 + Math.abs(dx / radius) * influence * 3;

    const stretchY =
      1 + Math.abs(dy / radius) * influence * 3;


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


heroTitle.addEventListener("mouseleave", () => {

  heroTitle.classList.add("is-resetting");

  chars.forEach((char) => {

    char.style.transform =
      "translate3d(0, 0, 0) scaleX(1) scaleY(1) rotate(0deg)";

  });

});


const introLoader = document.getElementById("introLoader");
const loadingDots = document.getElementById("loadingDots");



let dotCount = 1;

const dotAnimation = setInterval(() => {

  dotCount++;

  if (dotCount > 3) {
    dotCount = 1;
  }

  loadingDots.textContent = ".".repeat(dotCount);

}, 400);




window.addEventListener("load", () => {

  (window.scene3dReady || Promise.resolve()).then(() => {


  setTimeout(() => {

    clearInterval(dotAnimation);

    introLoader.classList.add("is-closing");



    setTimeout(() => {

      introLoader.remove();

    }, 1300);


  }, 1200);

  });

});


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


const pageTransition =
  document.getElementById("pageTransition");

const transitionSound =
  new Audio("audio/transition-sound.mp3");

transitionSound.volume = 0.5;


if (pageTransition) {
  pageTransition.style.display = "none";
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


pageTransition.style.display = "flex";

pageTransition.classList.remove("is-entering");
pageTransition.classList.add("is-hidden");


/* SOUND */

transitionSound.currentTime = 0;
transitionSound.play().catch(() => {});



requestAnimationFrame(() => {

  requestAnimationFrame(() => {

    pageTransition.classList.remove("is-hidden");
    pageTransition.classList.add("is-entering");

  });

});


    setTimeout(() => {

      window.location.href = destination;

    }, 850);

  });

});