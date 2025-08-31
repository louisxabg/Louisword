const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let questions = [];
let current = 0;
let playing = false;
let time = 150;
let timerInterval;
let currentLang = "es";
let roscoRotation = 0;
let playerName="";
let gameHistory=[];

console.log("JS cargado");


document.getElementById("startBtn").addEventListener("click", () => { console.log("click en empezar");
  startGame();
});

document.getElementById("answerBtn").addEventListener("click", ()=> {
  console.log("click en responder");
checkAnswer();
});

document.getElementById("passBtn").addEventListener("click", ()=> {
  console.log("click en pasapalabra");
  pass();
});

const translations = {
  es: {
    title: "Juego Pasapalabra",
    start: "Empezar",
    submit: "Responder",
    pass: "Pasapalabra",
    time: "Tiempo",
    correct: "Correctas",
    historyTitle: "Historial de partidas",
    waiting: 'Presiona "Empezar" para comenzar',
    gameOver: (c, i) => `Juego terminado. ✅ Correctas: ${c} ❌ Incorrectas: ${i}`,
    correctLabel: count => `✅ ${count}`,
    languageLabel:"Idioma:",
    answerPlaceholder:"Tu respuesta",
    namePlaceholder: "Por favor, ingresa tu nombre antes de comenzar.",
  },
  en: {
    title: "Pasapalabra Game",
    start: "Start",
    submit: "Submit",
    pass: "Pass",
    time: "Time",
    correct: "Correct",
    historyTitle: "Game History",
    waiting: 'Press "Start" to begin',
    gameOver: (c, i) => `Game over. ✅ Correct: ${c} ❌ Incorrect: ${i}`,
    correctLabel: count => `✅ ${count}`,
    languageLabel:"Language:",
    answerPlaceholder:"Your answer",
    missingName:"Please enter your name before starting",
    namePlaceholder:"enter your name",
    nameLabel:"Name"
  }
};

const bancos = {
  es: {
    a: [
      { question: "Empieza por A: Tal vez si te sientes lejos de casa deberías ir ahí. ", answer: ["Afhf","Away from home festival"] },
      {question: "Empieza por A: Aunque la escuchamos en vivo, no la tuvimos en el live album.", answer: "Angels fly" },
      {question: "Empieza por A:las experiencias compartidas y el afecto son lo que hace que todo valga la pena .", answer: "All This Time" }
    ], 
    

    b: [{ question: "Empieza por B: Está en el live album pero no es la primera versión.", answer: ["Btm","bigger than me"] },
      { question: "Empieza por B: Revista británica de moda y cultura en la que Louis poso para un photoshoot en 2019.", answer: ["British Gq","British"] },
      { question: "Empieza por B: Las versiones originales siempre son la mejor, pero la version rock tambien a veces lo es", answer: ["Back to you","bty"] }
    ],

    c: [
      { question: "Empieza por C: Alguien?...alguien?", answer: "Cupcakes" },
      { question: "Empieza por C: En realidad es habit. ", answer: ["Copy of a copy of a copy", "Coacoac"]},
      { question: "Empieza por C: Palabra que suele decir que define lo que tiene con los fans", answer: ["Conexión", "Conexion"] },
      { question: "Empieza por C: si te sientes sola en Santiago tambien puedes llamarlo", answer: "Chicago" },
      { question: "Empieza por C: Ojala haber estado en Seattle escuchando a extraños cantar tu nombre.", answer: "Common People"}
    ],

    d: [{ question: "Empieza por D: Dicen que los sabados quitan... ", answer: ["el dolor","dolor"] },
      { question: "Empieza por D: Tiene una versión en piano aunque no muchos saben apreciarla. ", answer: ["Don't let it break your heart","dlibyh"] },
      { question: "Empieza por D: Expuesto y esperando ser amado", answer: "Defenceless"}
    ],

    e: [{ question: "Empieza por E: En twitter, en instagram, en omegle, donde sea habia alguien pidiendo que voten por KMM para que suene en Wembley", answer: ["Eurocopa","Uefa Euro","Euro" ]} ,
      { question: "Empieza por E: Puesto que ocupa Perfect Now en el tracklist del album Walls.", answer: "Decimo" },
      { question: "Empieza por E: Lugar donde fue la segunda edición del afhf ", answer: "España" }  
    ],

    f: [{ question: "Empieza por F: Le gusta pero si se trata de anotar un punto necesita intentarlo demasiaaaaaadas veces.", answer: "futbol" },
       { question: "Empieza por F: Si quisieras formar parte del live álbum con esta canción, deberías haber estado en rio de janeiro.", answer: "Fearless" },
       { question: "Empieza por F:Forma parte del live álbum, grabada en Nashville ", answer: ["Face the music","ftm"] }

    ],

    g: [{ question: "Empieza por G: Se presento en la edición del afhf en Mexico.", answer: "Gibby" }],

    h: [{ question: "Empieza por H: Si estuviste en Atlanta, Louis la cantó junto a Jack de The Snuts", answer: ["High in california","hic"]},
    { question: "Empieza por H: Dura 3 minutos con 30 segundos pero no es suficiente", answer: ["Holding on to heartache", "hoth"] },
    { question: "Empieza por H: Brighton fue titular", answer: "Headline" }
  ],

    i: [{ question: "Contiene I: No se puede romper", answer: "Habit" },
      { question: "Empieza por I: Lugar donde fue la tercera edición del afhf. ", answer: "Italia" }

    ],

    j: [{ question: "Empieza por J: Tengo una pregunta que hacerles, que la respuesta va a ser si. Se acuerdan de..", answer: ["Just Hold On","jho"] },
      { question: "Empieza por J: Lugar donde se presento con el fitfwt en Brasil.", answer: ["Jeunesse Arena","Jeunesse"]},
      { question: "Empieza por J: Una de las primeras canciones de su carrera de solista. ", answer: ["Just like you","jly"] }

    ],

    k: [{ question: "Empieza por K: Arriba y abajo.", answer: ["Kill my mind", "kmm"]}

    ],

    l: [{ question: "Empieza por L: Una? dos? la cantidad exacta", answer: "Lucky Again"},
      { question: "Empieza por L: Ciudad donde se grabó el videoclip de Kill My Mind.", answer: "Londres" }

    ],

    m: [{ question: "Empieza por M: Podemos cantar BTM con el live album o en algún lugar de Italia", answer: ["Milan", "Milán" ]},
    { question: "Empieza por M: País donde se grabo el videoclip de Walls", answer:"Marruecos" }
  ],

    n: [{ question: "Empieza por N: Mes es que se lanzó la cancion DLIBYH.", answer: "Noviembre" }

    ],

    o: [{ question: "Empieza por O: Shakespeare no podría haberla escrito", answer: ["Only the brave", "otb"] },
    { question: "Empieza por O: Helicóptero.", answer: ["Out of my system", "ooms"] },
    { question: "Empieza por O: Uno de los MEJORES photoshoot que hizo para una revista en 2017", answer: ["Observer","the observer"] }
  ],

    p: [{ question: "Empieza por P: Pueden seguir pidiendo todo lo que quieran.", answer: "Perfect now" },
      { question: "Empieza por P: Si estuviste en Łódź puede ser que sepas de que estoy hablando", answer: "Paradise" },
      { question: "Empieza por P: con Louis puede ser hoy, mañana, en una semana, meses o en un año. ", answer: "Pronto" },
      { question: "Empieza por P: Donde Louis cantó por primera vez en vivo el cover 'chemical' de post malone.", answer: "Panama" },
       { question: "Empieza por P: juego o desafio con la que anuncio las canciones del live album", answer: "Puzzle" }
    ],

    q: [{ question: "Empieza por Q: En headline dice “So …… to kill forever” ", answer: "Quick" }],

    r: [{ question: "Empieza por R: Ya sea en la era fitf o en la era de walls, él termino con el brazo asi. ", answer: "roto" },
      { question: "Empieza por R: = Nombre del equipo de futbol de la camiseta que Louis utilizo para promocionar KMM.", answer: "River" },
      { question: "Empieza por R: Color de la camiseta que utilizo Louis para promocionar KMM. ", answer: "red" }
    ],

    s: [{ question: "Empieza por S: Para algunos el dia de la independencia es el 4 de julio, para otros el 9 pero para nosotros es el 11", answer: "Sony Music"},
      { question: "Empieza por S: A veces vemos luces, a veces no", answer: ["She Is Beauty We Are World Class", "Sibwawc"] },
      { question: "Empieza por S: Mes de lanzamiento de Kill My Mind", answer: "Septiembre" },
      { question: "Empieza por S: Si comienza a sonar significa que el show esta por terminar", answer: "Silver Tongues" },
      { question: "Empieza por S: Solo puedes escucharla si primero escuchas Bigger Than Me", answer: "Saved by a stranger" },
      { question: "Empieza por S: Muchas cosas cambian pero esta canción en vivo no la cambiaria por nada.", answer: "Saturdays" }
    ],

    t: [{ question: "Empieza por T: Algunos nos desvelamos para verlo preparar un sandwich y cortar (no muy bien)... ", answer: "Tomates" },
      { question: "Empieza por T:Premios en los que se presento en noviembre del  2019. ", answer: "Telehit" },
      { question: "Empieza por T: Somos él y nosotros hasta el final.", answer: "The Greatest" },
      { question: "Empieza por T: Se tomo muy enserio el 'Here are the words I know that you don't wanna hear' porque no nos dio la bendición de escucharla en todo el tour.", answer: ["That's the way love goes","ttwlg" ]}

    ],

    u: [{ question: "Empieza por U: Donde Louis cantó por primera vez en vivo el cover 505 de arctic monkeys ", answer: "Uncasville" }

    ],

    v: [{ question: "Contiene V:Ciudad donde durante un show Louis hizo una revelación de género ", answer: "Irving" },
      { question: "Empieza por V: Banda que se presentó en el afhf en España. ", answer: "Voodoos" },
      { question: "Empieza por V: Banda que se presentó en el afhf en España. ", answer: "Vaccines" }

    ],

    w: [{ question: "Empieza por W: 'I remember those nights'", answer: ["We made it","wmi"] },
    {question: "Empieza por W: Él es nuestro porque.", answer: "Walls" },
    {question: "Empieza por W: Se podría decir que pertenece a Budapest", answer: ["Written all over your face","waoyf"]}
  ],

    x: [{ question: "Contiene X: fue jurado en este programa de talentos ", answer: ["the x factor","txf"] }],

    y: [{ question: "Contiene Y: Viajo por el mundo, buscó por varios lugares pero siempre supo a donde pertenecia.", answer: "Always you" },
      { question: "Contiene Y: Lo tuvo pero no lo entendió. Ahora lo sabe pero es tarde.", answer: "Too Young" },
      { question: "Contiene Y:Cantante y compositora británica que se presentó en el afhf en Mexico.", answer: "Dylan" }

    ],

    z: [{ question: "Empieza por Z: Personaje que interpreto en el musical de Grease.", answer: "Zuco" }]
  },
  en: {
    a: [
      { question: "Starts with A: Maybe if you're feeling far from home, you should go there.", answer: ["Afhf","Away from home festival"] },
      { question: "Starts with A: Even though we heard it live, it wasn't included on the live album.", answer: "Angels fly" },
      {question: "Shared experiences and affection are what make it all worthwhile.", answer: "All this time" }

    ],
    b: [{ question: "Starts with B: It's on the live album, but it's not the first version ", answer: ["Btm","bigger than me"] },
    { question: "Starts with B: Whether it's in the fitf era or walls era, he ended up with his arm like this. ", answer: "Broken" },
    { question: "Starts with B: British fashion and culture magazine in which Louis posed for a photoshoot in 2019", answer: ["British Gq","British"] },
    { question: "Starts with B: The original versions are always the best, but the rock version is great too", answer: ["Back To Your","bty"] }
  ],

    c: [
      { question: "Starts with C: Anyone?... anyone?", answer: "Cupcakes"},
      { question: "Starts with C: Actually it's habit.", answer: ["Copy of a copy of a copy", "Coacoac"]},
      { question: "Starts with C: A word he often says that defines what he has with the fans.", answer: "Connection"},
      { question: "Starts with C: If you feel lonely in Santiago, you cann call him too", answer: "Chicago"},
      { question: "Starts with C: I wish I had been in Seattle, hearing strangers sing your name.", answer: "Common People"} 
    ],

    d: [{ question: "Starts with D: There's a version where we can hear a piano, but not many people know how to appreciate it.", answer: ["Don't let it break your heart","dlibyh"] },
      { question: "Starts with D: Exposed and waiting to be loved ", answer: "Defenceless" }
    ],

    e: [{ question: "Starts with E: On twitter, on instagra,, on omegle, everywhere, there was someone asking people to vote for KMM to be played at Wembley.", answer: ["Eurocopa","Uefa Euro","Euro" ] },
      { question: "Contains E: Perfect Now's position on the Walls album tracklist  ", answer: "thent" }
    ],

    f: [{ question: "Starts with F: He likes it, but when it comes to scoring a point, he needs to try waaay too many times", answer: "Football" },
      { question: "Starts with F: If you wanted to be part of the live album with this song, you should have been in Rio de Janeiro ", answer: "Fearless" },
      { question: "Starts with F: It's part of the live album, recorded in Nashville", answer: ["Face The music","ftm"] },
    ],

    g: [{ question: "Starts with G: He performed at the AFHF edition in Mexico ", answer: "Gibby" }],

    h: [{ question: "Starts with H: If you were in Atlanta, Louis sang it with Jack from The Snuts", answer: ["High in california","hic"]},
      { question: "Starts with H: It lasts 3 minutes and 30 seconds, but it's not enough.", answer: ["Holding on to heartache", "hoth"] },
       {question: "Starts with H: Brighton was the headline", answer: "headline" } 

    ],

    i: [{ question: "Contains I: It can't be broken.", answer: "Habit" },
      { question: "Starts with I: Place where the third edition of the AFHF took place.", answer: "Italy" }

    ],

    j: [{ question: "Starts with J: I have  a question for you, and I know the answer is going to be yes. Do you remember...", answer: ["Just Hold On","jho"] },
      {question: "Starts with J: One of the first songs as a solo artist.", answer: ["Just like you", "Jly"] },
      {question: "Starts with J: Venue where he performed with the fitfwt in Brazil.", answer: ["Jeunesse arena","jeunesse"] }

    ],

    k: [{ question: "Starts with K: Up and down. ", answer: ["Kill my mind", "kmm"] }

    ],

    l: [{ question: "Starts with L: One? Two? The exct number.", answer: "Lucky Again" },
      { question: "Starts with L: City where the KMM music video was filmed", answer: "London" }

    ],

    m: [{ question: "Starts with M: We can sing BTM with the live album or somewhere in Italy", answer: "Milan" },
      { question: "Starts with M: Country where the Walls music video was filmed", answer: "Morocco" }
    ],

    n: [{ question: "Starts with N:Month when the song dlibyh was released. ", answer: "November" }

    ],

    o: [{ question: "Starts with O: Shakespeare couldn't have written it.", answer: ["Only the brave", "otb"] },
    { question: "Starts with O: Helicopter", answer: ["Out of my system", "ooms" ]},
    { question: "Starts with O:One of the BEST photoshoots he did for a magazine, and it was in 2017 ", answer: "Observer" }
  ],

    p: [{ question: "Starts with P: You can keep asking for whatever you want.", answer: "Perfect now" },
      { question: "Starts with P: If you were in Łódź, you might know what I'm talking about", answer: "Paradise" },
      { question: "Starts with P: They say that Saturdays they take away...", answer: ["Pain","The pain"] },
      { question: "Starts with P:Where Louis first performed the cover of 'chemical' by post malone live. ", answer: "Panama" },
      { question: "Starts with P: Game or challenge with which he announced the tracklist of the live album ", answer: "Puzzle" }
    ],

    q: [{ question: "Starts with Q: In headline it says 'so .....  to kill forever", answer: "Quick" }],

    r: [{ question: "Starts with R: Name of the football team on the jersey Louis wore to promote Kill My Mind. ", answer: "River" },
      { question: "Starts with R: Color of the jersey Louis wore to promote Kill My Mind ", answer: "Red" }

    ],

    s: [{ question: "Starts with S: with Louis it could be today,tomorrow, in a week, months or in a year.", answer: "soon" },
      { question: "Starts with S: For some independence day is july 4th, for others it's the9th, but for us it's te 11th", answer: "Sony Music" },
      { question: "Starts with S: Sometimes we see lights, sometimes we don't ", answer: ["She Is Beauty We Are World Class", "Sibwawc"] },
      { question: "Starts with S: Kill My Mind release month", answer: "September" },
      { question: "Starts with S: If it starts playing, it means the show is about to end", answer: "Silver tongues" },
      { question: "Starts with S: You can only listen to it if you Bigger Than Me", answer: "Saved by a stranger" },
      { question: "Starts with S: Many things change, but I wouldn't change this live song for anything", answer: "Saturdays" },
      { question: "Starts with S: Place where the second edition of the AFHF took place ", answer: "Spain" }
    ],

    t: [{ question: "Starts with T: Some of us stayed up late to watch him make a sandwich and (not very well) cut.. ", answer: "Tomatoes" },
      { question: "Starts with T: Awards shows where he performed in november 2019", answer: "Telehit" },
       { question: "Starts with T: It's him and us until the end", answer: "The Greatest" },
       { question: "Starts with T:He took 'Here are the words I know that you don't wanna hear' because he didn't bless us by playing it during the tour ", answer: ["That's the way love goes", "ttwlg"] }

    ],

    u: [{ question: "Starts with U:Where Louis first performed the cover of '505' by arctic monkeys ", answer: "Uncasville" }

    ],

    v: [{ question: "Contains V: City where Louis did a gender reveal during a show", answer: "Irving" },
      { question: "Starts with V: Band that performed at the AFHF in Spain", answer: ["Voodoos","Vaccines"] }

    ],

    w: [{ question: "Starts with W: 'I remember those nights'", answer: ["We made it","wmi"] },
    { question: "Starts with W: He is ours because", answer: "Walls" },
    { question: "Starts with W: You could say this song belongs to Budapest ", answer: ["Written all over your face", "waoyf"]}
  
  
  ],

    x: [{ question: "Contains X: He was judge on this show ", answer: ["The x factor","txf"] }],

    y: [{ question: "Contains Y: He traveled the worl, searched in many places,but he always knew where he belonged.", answer: "Always you" },
      { question: "Contains Y: He had it but didn'd understand it. Now he knows, but it's too late.", answer: "Too Young" },
      { question: "Contains Y: British singer and songwriter who performed at AFHF in Mexico.", answer: "Dylan" }

    ],

    z: [{ question: "Starts with Z: Character he played in the grease musical ", answer: "Zuco" }]
  }
};




function setLanguage() {
  currentLang = document.getElementById("language").value;
  translateUI();
}

function translateUI() {
  const t = translations[currentLang];
  document.getElementById("answer").placeholder= t.answerPlaceholder;
  document.getElementById("language-label").textContent = t.languageLabel;
  document.getElementById("startBtn").textContent = t.start;
  document.getElementById("answerBtn").textContent = t.submit;
  document.getElementById("passBtn").textContent = t.pass;
  document.getElementById("question").textContent = t.waiting;
  document.getElementById("historyTitle").textContent = t.historyTitle;
  document.getElementById("timer").textContent = `${t.time}: ${time}`;
  const correct = questions.filter(q => q.status === "correct").length;
  document.getElementById("correctCounter").textContent = t.correctLabel(correct);
  document.getElementById("playerName").placeholder=t.namePlaceholder;
}

function loadQuestions() {
  
     const banco = bancos[currentLang] || {};
  questions = letters.map(letter => {
    const entry = banco[letter.toLowerCase()];
    if (entry && entry.length > 0) {
      const randomIndex = Math.floor(Math.random() * entry.length);
      return {
        letter,
        question: entry[randomIndex].question,
        answer: entry[randomIndex].answer,
        status: "pending",
        originalQuestion: entry[randomIndex].question // 🔹 guardamos la pregunta original
      };
    } else {
      return {
        letter,
        question: currentLang === "es"
          ? `Empieza por ${letter}: (sin pregunta)`
          : `Starts with ${letter}: (no question)`,
        answer: "respuesta",
        status: "pending",
        originalQuestion: currentLang === "es"
          ? `Empieza por ${letter}: (sin pregunta)`
          : `Starts with ${letter}: (no question)`
      };
    }
  });
}

function createRosco() {
  const rosco = document.getElementById("rosco");
  rosco.innerHTML = "";
  const total = questions.length;
  const radius = 140;

  questions.forEach((q, index) => {
    const angle = (360 / total) * index;
    const x = radius * Math.cos((angle - 90) * Math.PI / 180);
    const y = radius * Math.sin((angle - 90) * Math.PI / 180);

    const span = document.createElement("span");
    span.className = "letter";
    span.id = `letter-${index}`;
    span.textContent = q.letter;
    span.dataset.angle = angle;
    span.style.left = `${150 + x - 17}px`;
    span.style.top = `${150 + y - 17}px`;
    span.style.transform = `rotate(${-angle}deg)`;

    rosco.appendChild(span);
  });
}


function startGame() {
const inputEl = document.getElementById("playerName");
  const typedName = (inputEl?.value || "").trim();
  const errorEl = document.getElementById("nameError");

  if (!typedName) {
    // Mostrar mensaje dentro de la página
    errorEl.textContent = currentLang === "en" 
      ? "Please enter your name before starting."
      : "Por favor, ingresa tu nombre antes de comenzar.";
    errorEl.style.display = "block";
    inputEl.focus();
    return;
  } else {
    // Si escribió algo, ocultamos el mensaje
    errorEl.style.display = "none";
  }

  playerName = typedName;
  document.querySelector(".name-container").style.display = "none";
  document.getElementById("startBtn").classList.add("hidden");

  loadQuestions();
  createRosco();
  current = 0;
  playing = true;
  time = 150;

  const t = translations[currentLang];
  document.getElementById("timer").textContent = `${t.time}: ${time}`;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time--;
    document.getElementById("timer").textContent = `${t.time}: ${time}`;
    if (time <= 0) endGame();
  }, 1000);

  translateUI();
  showQuestion();
}

function showQuestion() {
   if (!playing) return;

  document.querySelectorAll(".letter").forEach(el => el.classList.remove("active"));

  const q = questions[current];
  const total = questions.length;
  const anglePerLetter = 360 / total;
  const angleToRotate = anglePerLetter * current;

  roscoRotation = -angleToRotate;
  document.getElementById("rosco").style.transform = `rotate(${roscoRotation}deg)`;

  // 🔹 siempre mostramos la pregunta original
  document.getElementById("question").textContent = q.originalQuestion;
  document.getElementById("answer").value = "";
  document.getElementById(`letter-${current}`).classList.add("active");
}

function checkAnswer() {
   const userAnswer = document.getElementById("answer").value.trim().toLowerCase();
  const q = questions[current];
  const circle = document.getElementById("letter-" + current);

  if (userAnswer === "") return;

  const isCorrect = Array.isArray(q.answer) 
    ? q.answer.some(a => a.toLowerCase() === userAnswer) 
    : userAnswer === q.answer.toLowerCase();

  if (isCorrect) {
    q.status = "correct";
    circle.classList.remove("pending", "skipped", "incorrect");
    circle.classList.add("correct");
  } else {
    q.status = "incorrect";
    circle.classList.remove("pending", "skipped", "correct");
    circle.classList.add("incorrect");
  }

  updateCorrectCounter();
  document.getElementById("answer").value = "";
  nextQuestion();
}

function pass() {
 const q = questions[current];
  const circle = document.getElementById(`letter-${current}`);

  q.status = "skipped"; // estado temporal
  circle.classList.remove("correct", "incorrect", "pending");
  circle.classList.add("skipped");

  document.getElementById("answer").value = "";
  nextQuestion();
}

function updateCorrectCounter() {
  const correct = questions.filter(q => q.status === "correct").length;
  const t = translations[currentLang];
  document.getElementById("correctCounter").textContent = t.correctLabel(correct);
}

function nextQuestion() {
   
   
   let found = false;

  for (let i = 1; i <= questions.length; i++) {
    const next = (current + i) % questions.length;

    if (questions[next].status === "pending" || questions[next].status === "skipped") {
      current = next;
      found = true;

      const circle = document.getElementById(`letter-${current}`);

      // si la letra estaba skipped, vuelve a pending temporalmente
      if (circle && questions[current].status === "skipped") {
        circle.classList.remove("skipped", "correct", "incorrect");
        circle.classList.add("pending");
      }

      showQuestion();
      break;
    }
  }

  if (!found) endGame();
}

async function endGame() {
  
playing = false;
  clearInterval(timerInterval);

  const correct = questions.filter(q => q.status === "correct").length;
  const incorrect = questions.filter(q => q.status === "incorrect").length;
  const t = translations[currentLang];

  document.getElementById("question").textContent = t.gameOver(correct, incorrect);
  document.getElementById("correctCounter").textContent = t.correctLabel(correct);

  const startBtn = document.getElementById("startBtn");
  startBtn.classList.remove("hidden");
  startBtn.textContent = currentLang === "en" ? "Play Again" : "Jugar otra vez";

  const record = {
    jugador: playerName, // 👈 aquí se guarda el nombre que ingresó el jugador
    correct,
    incorrect,
    idioma: currentLang,
    fecha: new Date().toISOString()
  };

  // Guardar en Firebase usando la versión global
  const newRef = firebase.database().ref("historial").push();
  await newRef.set(record);

  // Mostrar historial actualizado
  showHistory();
}

async function showHistory() {

const historyList = document.getElementById("historyList");
  historyList.innerHTML = ""; //limpir historial previo

  const snapshot = await firebase.database().ref("historial").once("value");
  const history = [];

  snapshot.forEach(child => {
    history.push(child.val());
  });

  // Ordenar por fecha (la última arriba)
  history.reverse();

  // Mostrar solo las últimas 10
  history.slice(0, 10).forEach(record => {
    const li = document.createElement("li");
    li.textContent = `${record.jugador} - ${record.correct} ✅, ${record.incorrect} ❌ (${record.idioma})`;
    historyList.appendChild(li);
  });
}



setLanguage();
showHistory();