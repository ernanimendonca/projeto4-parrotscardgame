/**
 * @param number
 * @returns {boolean}
 */
function isEven(number) {
  return number % 2 === 0;
}

/**
 * @param start
 * @param end
 * @param number
 * @returns {boolean}
 */
function isBetween(start, end, number) {
  return number >= start && number <= end;
}

/**
 * @returns {number}
 */
function getNumber() {
  const number = parseInt(
    prompt("Quantas cartas você deseja?\nPar no intervalo [4-14]:")
  );
  if (isEven(number) && isBetween(4, 14, number)) {
    return number;
  }
  return getNumber();
}

function playAgain() {
  if (prompt("Deseja jogar novamente? [s]im / [n]ão:") === "s") {
    game();
  }
}

function changeTimer() {
  time++;
  document.querySelector(".timer").innerHTML = time;
}

/**
 * @param possibleCards
 * @param number
 * @returns {array}
 */
function getCards(possibleCards, number) {
  const deck = [];
  for (let i = 0; i < number / 2; i++) {
    deck.push(possibleCards[i]);
    deck.push(possibleCards[i]);
  }

  deck.sort(() => {
    return Math.random() - 0.5;
  });

  return deck;
}

/**
 *
 * @returns {number}
 */
function genGameBoard() {
  const allParrots = [
    "bobrossparrot",
    "unicornparrot",
    "explodyparrot",
    "fiestaparrot",
    "revertitparrot",
    "metalparrot",
    "tripletsparrot"
  ];
  const cardCount = getNumber();
  const deck = getCards(allParrots, cardCount);

  const cardsObject = document.querySelector(".cards");
  cardsObject.innerHTML = "";
  for (const card of deck) {
    cardsObject.innerHTML += `
        <div class="card" data-identifier="card">
            <div class="front" data-identifier="front-face">
                <img src="imagens/front.png" alt="parrot" class="front-card">
            </div>
            <div class="back" data-identifier="back-face">
                <img src="gifs/${card}.gif" alt="${card}" class="back-card">
            </div>
        </div>
        `;
  }
  return cardCount / 2;
}

/**
 * @param cardObject
 * @returns {boolean}
 */
function isFlippable(cardObject) {
  const isPaired = cardObject.classList.contains("paired");
  const isSelected = cardObject.classList.contains("selected");

  return unableClick && !(isPaired || isSelected);
}

/**
 * @param cardObject
 */
function flip(cardObject) {
  cardObject.classList.toggle("selected");
  cardObject.querySelector(".front").classList.toggle("clicked");
  cardObject.querySelector(".back").classList.toggle("clicked");
}

/**
 * @param cardObjects
 */
function virtualFlip(cardObjects) {
  for (const cardObject of cardObjects) {
    flip(cardObject);
  }
  unableClick = true;
}

/**
 * @param cardObjects
 * @returns {boolean}
 */
function isMatch(cardObjects) {
  const alts = [];
  for (const cardObject of cardObjects) {
    alts.push(cardObject.querySelector(".back-card").alt);
  }
  return alts[0] === alts[1];
}

function game() {
  const maxPairCount = genGameBoard();

  time = 0;
  pairCount = 0;
  clickCount = 0;
  unableClick = true;

  const cardObjects = document.querySelectorAll(".card");
  for (const cardObject of cardObjects) {
    cardObject.onclick = onClick(cardObject, maxPairCount);
  }

  timeInterval = setInterval(changeTimer, 1000);
}

/**
 * @param cardObject
 * @param maxPairCount
 * @returns {(function(): void)|*}
 */
const onClick = (cardObject, maxPairCount) => {
  return () => {
    if (isFlippable(cardObject)) {
      flip(cardObject);

      clickCount++;
      const selected = document.querySelectorAll(".selected");
      if (selected.length === 2) {
        if (isMatch(selected)) {
          for (const selectedElement of selected) {
            selectedElement.classList.remove("selected");
            selectedElement.classList.add("paired");
          }
          pairCount++;
          if (pairCount === maxPairCount) {
            setTimeout(
              () =>
                alert(
                  `Você ganhou em ${clickCount} cliques e ${time} segundos.`
                ),
              500
            );
            setTimeout(playAgain, 500);
            clearInterval(timeInterval);
          }
        } else {
          unableClick = false;
          setTimeout(virtualFlip, 1000, selected);
        }
      }
    }
  };
};

let time;
let pairCount;
let clickCount;
let unableClick;
let timeInterval;

game();
