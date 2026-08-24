
const projects = [

  {
    number: "( 1 )",

    title: "JEONGWOL DAEBOREUM",

    description:
      "Jeongwol Daeboreum is a set of 12 vector illustrations exploring the food culture of Korea’s first full moon festival. Each dish carries a symbolic meaning or wish for the year ahead, such as health, prosperity, and good fortune. Inspired by the decorative qualities of Korean visual culture, the series combines symmetrical compositions and stylised geometric forms with bold accents of pink, green, and orange to create a festive, spring-like atmosphere.",

    software: [
      "Adobe Illustrator",
      "Adobe After Effects"
    ],

  media: [
    {
      src: "assets/project-1-preview.png",
      className: "modal-media-main"
    },

    {
      src: "assets/project-1-animation-1.GIF",
      className: "modal-media-half"
    },

    {
      src: "assets/project-1-animation-2.GIF",
      className: "modal-media-half"
    }
  ]
},


  {
    number: "( 2 )",

    title: "HEART THERAPY",

    description:
      "Heart Therapy is an interactive infographic exploring a relatable yet often difficult experience: moving on after the end of a relationship. Designed as a gentle, therapy-inspired journey, the experience guides users through seven practical steps in sequence, encouraging them to reflect, interact, and gradually move forward. A witch and card-reading concept, combined with a 1920s Art Deco-inspired visual style, transforms the topic into a mystical and comforting experience.",

    software: [
      "Adobe Illustrator",
      "Figma"
    ],

    media: [
  {
    type: "youtube",
    src: "https://www.youtube.com/embed/URC5tLKIwyE",
    className: "modal-media-main"
  },

  {
    type: "image",
    src: "assets/project-2-half-1.png",
    className: "modal-media-half"
  },

  {
    type: "image",
    src: "assets/project-2-half-2.png",
    className: "modal-media-half"
  },

  {
    type: "image",
    src: "assets/project-2-half-3.png",
    className: "modal-media-half"
  },

  {
    type: "image",
    src: "assets/project-2-half-4.png",
    className: "modal-media-half"
  }
]
  },


  {
    number: "( 3 )",

    title: "MOLÉCHÈ",

    description:
      "MoléChè is a conceptual event website that combines molecular gastronomy with chè, a familiar Vietnamese dessert. Through guided workshops and culinary experiences, the event transforms familiar flavours and ingredients into unexpected forms, celebrating and elevating the artistry of Vietnamese desserts and cuisine. Inspired by the elegance of afternoon tea, the website uses refined ornamental details and a complementary red and green palette to bring together a sense of tradition and elegance.",

    software: [
      "Adobe Illustrator",
      "Figma"
    ],

    media: [
  {
    type: "youtube",
    src: "https://www.youtube.com/embed/WDMoEsU-BJY",
    className: "modal-media-main"
  },

  {
    type: "image",
    src: "assets/project-3-half-1.png",
    className: "modal-media-half"
  },

  {
    type: "image",
    src: "assets/project-3-half-2.png",
    className: "modal-media-half"
  },

  {
    type: "image",
    src: "assets/project-3-half-3.png",
    className: "modal-media-half"
  },

  {
    type: "image",
    src: "assets/project-3-half-4.png",
    className: "modal-media-half"
  }
]
  },


  {
    number: "( 4 )",

    title: "THE LITTLE SNAIL",

    description:
      "The Little Snail is an interactive poetry website following a little mail snail on his journey through a whimsical garden. Through personified characters, children’s storybook-inspired illustrations and a soft, colourful palette, the project explores self-worth and the idea that everyone has something meaningful to contribute. Rather than presenting the message directly, the website uses gentle storytelling and interaction to communicate it in a playful and approachable way.",

    software: [
      "Procreate",
      "HTML / CSS / JavaScript"
    ],

    media: [
  {
    type: "youtube",
    src: "https://www.youtube.com/embed/hVNISEleK-s",
    className: "modal-media-main"
  },

  {
    type: "image",
    src: "assets/project-4-half-1.png",
    className: "modal-media-half"
  },

  {
    type: "image",
    src: "assets/project-4-half-2.png",
    className: "modal-media-half"
  },

  {
    type: "image",
    src: "assets/project-4-half-3.png",
    className: "modal-media-half"
  },

  {
    type: "image",
    src: "assets/project-4-half-4.png",
    className: "modal-media-half"
  }
]
  },


  {
    number: "( 5 )",

    title: "THE SUBMISSION",

    description:
      "The Submission is a comedy short film following a student whose laptop dies just minutes before an assignment deadline, sending him on a desperate race across campus to find a charger and submit his work on time. As my first independently produced short film, I developed the project from initial concept and storyboarding to filming, directing, and post-production. The film uses fast-paced editing, exaggerated situations, and playful sound design to turn a familiar student struggle into a chaotic and humorous race against the clock.",

    software: [
      "Adobe Premiere Pro",
    ],

    media: [
  {
    type: "youtube",
    src: "https://www.youtube.com/embed/b780GKQXBIE",
    className: "modal-media-main"
  },

  {
    type: "image",
    src: "assets/project-5-half-1.png",
    className: "modal-media-half"
  },

  {
    type: "image",
    src: "assets/project-5-half-2.png",
    className: "modal-media-half"
  }
]
  }

];


const projectRows =
  document.querySelectorAll(".project-row");

const projectPreview =
  document.getElementById("projectPreview");

const projectPreviewImage =
  document.getElementById("projectPreviewImage");


/* HOVER SOUND */

const projectHoverSound =
  new Audio("audio/hover-sound.mp3");

projectHoverSound.volume = 0.25;



projectRows.forEach((row) => {



  row.addEventListener("mouseenter", () => {

    /* SOUND */

    projectHoverSound.currentTime = 0;

    projectHoverSound
      .play()
      .catch(() => {});



    const preview =
      row.dataset.preview;


    if (preview) {

      projectPreviewImage.src =
        preview;

      projectPreview.classList.add(
        "is-visible"
      );

    }

  });




  row.addEventListener("mousemove", (event) => {

    projectPreview.style.left =
      `${event.clientX}px`;

    projectPreview.style.top =
      `${event.clientY}px`;

  });




  row.addEventListener("mouseleave", () => {

    projectPreview.classList.remove(
      "is-visible"
    );

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

    hoverSound
      .play()
      .catch(() => {});

  });

});




const magneticLinks =
  document.querySelectorAll(".nav-magnetic");


magneticLinks.forEach((link) => {

  link.addEventListener("mousemove", (event) => {

    const rect =
      link.getBoundingClientRect();

    const centerX =
      rect.left + rect.width / 2;

    const centerY =
      rect.top + rect.height / 2;


    const mouseX =
      event.clientX - centerX;

    const mouseY =
      event.clientY - centerY;


    const strength = 0.18;


    const moveX =
      mouseX * strength;

    const moveY =
      mouseY * strength;


    link.style.transform =
      `translate3d(${moveX}px, ${moveY}px, 0)`;

  });


  link.addEventListener("mouseleave", () => {

    link.style.transform =
      "translate3d(0, 0, 0)";

  });

});




const soundControl =
  document.getElementById("soundControl");

const bgMusic =
  document.getElementById("bgMusic");

const soundLabel =
  soundControl.querySelector(".sound-label");


bgMusic.volume = 0.4;


let isPlaying = false;



function turnSoundOn() {

  bgMusic
    .play()
    .catch(() => {});


  isPlaying = true;


  soundControl.classList.add(
    "is-playing"
  );

  soundControl.classList.remove(
    "is-muted"
  );


  soundLabel.textContent =
    "sound: on";

}



function turnSoundOff() {

  bgMusic.pause();


  isPlaying = false;


  soundControl.classList.remove(
    "is-playing"
  );

  soundControl.classList.add(
    "is-muted"
  );


  soundLabel.textContent =
    "sound: off";

}



soundControl.addEventListener("click", () => {

  if (isPlaying) {

    turnSoundOff();

  } else {

    turnSoundOn();

  }

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

    transitionSound
      .play()
      .catch(() => {});



    pageTransition.style.display = "flex";

    pageTransition.classList.remove(
      "is-hidden"
    );

    pageTransition.classList.add(
      "is-entering"
    );



    setTimeout(() => {

      window.location.href =
        destination;

    }, 850);

  });



const projectModal =
  document.getElementById("projectModal");

const modalBackdrop =
  document.querySelector(".project-modal-backdrop");

const modalNumber =
  document.getElementById("modalNumber");

const modalTitle =
  document.getElementById("modalTitle");

const modalDescription =
  document.getElementById("modalDescription");

const modalSoftware =
  document.getElementById("modalSoftware");

const modalMedia =
  document.getElementById("modalMedia");

const modalPrevious =
  document.getElementById("modalPrevious");

const modalNext =
  document.getElementById("modalNext");


let currentProjectIndex = 0;



function showProject(index) {

  currentProjectIndex = index;

  const project = projects[index];


  modalNumber.textContent =
    project.number;

  modalTitle.textContent =
    project.title;

  modalDescription.textContent =
    project.description;


modalMedia.innerHTML = "";

project.media.forEach((media) => {


  if (media.type === "youtube") {

    const videoWrap =
      document.createElement("div");

    videoWrap.classList.add(
      "modal-video-wrap",
      media.className
    );

    const iframe =
      document.createElement("iframe");

    iframe.src = media.src;
    iframe.title = project.title;

    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    );

    iframe.setAttribute(
      "allowfullscreen",
      ""
    );

    videoWrap.appendChild(iframe);
    modalMedia.appendChild(videoWrap);

  }



  else {

    const img =
      document.createElement("img");

    img.src = media.src;
    img.alt = project.title;

    img.classList.add(
      "modal-media-item",
      media.className
    );

    modalMedia.appendChild(img);

  }

});



  modalSoftware.innerHTML =
    project.software
      .map(item => `<span>${item}</span>`)
      .join('<span class="software-dot">•</span>');



  projectModal.classList.add("is-open");

  document.body.classList.add(
    "modal-open"
  );

}



projectRows.forEach((row, index) => {

  row.addEventListener("click", event => {

    event.preventDefault();

    showProject(index);

  });

});



modalNext.addEventListener("click", () => {

  let nextIndex =
    currentProjectIndex + 1;

  if (nextIndex >= projects.length) {
    nextIndex = 0;
  }

  showProject(nextIndex);

});



modalPrevious.addEventListener("click", () => {

  let previousIndex =
    currentProjectIndex - 1;

  if (previousIndex < 0) {
    previousIndex =
      projects.length - 1;
  }

  showProject(previousIndex);

});



modalBackdrop.addEventListener(
  "click",
  closeProjectModal
);


function closeProjectModal() {

  projectModal.classList.remove(
    "is-open"
  );

  document.body.classList.remove(
    "modal-open"
  );

}



document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeProjectModal();
  }

});
});

const projectMedia = document.querySelector(".modal-media");

projectMedia.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

projectMedia.addEventListener("dragstart", (event) => {
  event.preventDefault();
});