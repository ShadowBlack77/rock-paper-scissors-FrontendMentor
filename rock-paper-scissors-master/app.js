const rules = document.querySelector('.rules');
const wrapper = document.querySelector('.wrapper');
const wrapperRules = document.querySelector('.wrapperRules');
const closeBtn = document.querySelector('.close');
const pickAi = document.querySelector('.pick--ai');
const pickContainerAi = document.querySelector('.pick__container--ai');
const pickContainerPlayer = document.querySelector('.pick__container--player');
const pickPlaceholder = document.querySelector('.pick__placeholder');
const pickContainerElement = document.querySelector('.pick__container--ai');
const body = document.querySelector('body');

window.onload = () => {
  body.style.overflow = 'hidden';
};

const playerWinsLSKey = 'playerwins';
const AiWinsLSKey = 'AIWins';

const winningResultsMap = {
  scissors: ['paper', 'lizard'],
  paper: ['rock', 'spock'],
  rock: ['lizard', 'scissors'],
  lizard: ['spock', 'paper'],
  spock: ['scissors', 'rock']
};

let state = {
  playerWins: Number(localStorage.getItem(playerWinsLSKey)) || 0,
  AiWins: Number(localStorage.getItem(AiWinsLSKey)) || 0,
  playerPick: null,
  AiPick: null
};

const renderScore = () => {
  const points = document.querySelector('.points');
  points.innerText = state.playerWins - state.AiWins;
};

const bindPickEvents = () => {
  document.querySelectorAll('.options button').forEach((btn) => {
    btn.addEventListener('click', pick);
  });

  document.querySelector('.result__button').addEventListener('click', reset);
};

const pick = (e) => {
  pickByPlayer(e.currentTarget.dataset.pick);
  pickByAi();
  hideOptions();
  showFight();
};

const pickByPlayer = (pickedOptions) => {
  state = {
    ...state,
    playerPick: pickedOptions,
  };
};

const pickByAi = () => {
  const options = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  const AiPick = options[Math.floor(Math.random() * options.length)];

  state = {
    ...state,
    AiPick,
  };
};

const hideOptions = () => {
  const optionsElement = document.querySelector('.options');
  optionsElement.classList.add('slide-left');
};

const showFight = () => {
  const fightElement = document.querySelector('.fight');
  fightElement.classList.add('slide-left');
  createElementPickByPlayer();

  document.querySelectorAll('.options button').forEach((btn) => {
    btn.setAttribute('tabindex', -1);
  });

  document.querySelector('.result__button').setAttribute('tabindex', 0);

  setTimeout(showWResult, 1000);
};

const showWResult = () => {
  const resultTextElement = document.querySelector('.result__text');
  if (state.AiPick === state.playerPick) {
    resultTextElement.innerText = 'DRAW';
  } else if (winningResultsMap[state.playerPick].includes(state.AiPick)) {
    resultTextElement.innerText = 'YOU WIN';
    localStorage.setItem(playerWinsLSKey, state.playerWins + 1);
    state = {
      ...state,
      playerWins: state.playerWins + 1,
    }
    pickContainerPlayer.classList.add('winner');
  } else {
    resultTextElement.innerHTML = 'YOU LOSE';
    localStorage.setItem(AiWinsLSKey, state.AiWins + 1);
    state = {
      ...state,
      AiWins: state.AiWins + 1,
    }
    pickContainerAi.classList.add('winner');
  }

  createElementPickByAi();
  renderResult();
  renderScore();
};

const renderResult = () => {
  document.querySelector('.result').classList.add('show');
  document.querySelector('.pick--player').classList.add('moved');
  pickAi.classList.add('moved');
};

const createElementPickByPlayer = () => {
  const playerPick = state.playerPick;

  const pickContainerElement = document.querySelector('.pick__container--player');
  pickContainerElement.innerHTML = '';
  pickContainerElement.appendChild(createPickElement(playerPick));
};

const createElementPickByAi = () => {
  pickPlaceholder.classList.add('hidden');

  const AiPick = state.AiPick;

  pickContainerElement.classList.remove('hidden');
  pickContainerElement.innerHTML = '';
  pickContainerElement.appendChild(createPickElement(AiPick));
}

const createPickElement = (option) => {
  const pickElement = document.createElement('div');
  pickElement.classList.add('button', `button--${option}`);

  const imgContainerElement = document.createElement('div');
  imgContainerElement.classList.add('button_image-container');

  const imgElement = document.createElement('img');
  imgElement.src = `./images/icon-${option}.svg`;
  imgElement.alt = option;

  imgContainerElement.appendChild(imgElement);

  pickElement.appendChild(imgContainerElement);

  return pickElement;
};

const reset = () => {
  const fightElement = document.querySelector('.fight');
  fightElement.classList.remove('slide-left');

  const optionsElement = document.querySelector('.options');
  optionsElement.classList.remove('slide-left');

  document.querySelector('.result').classList.remove('show');
  document.querySelector('.pick--player').classList.remove('moved');
  pickAi.classList.remove('moved');

  document.querySelectorAll('.options button').forEach((btn) => {
    btn.setAttribute('tabindex', 0);
  });
  document.querySelector('.result__button').setAttribute('tabindex', -1);

  pickContainerPlayer.classList.remove('winner');
  pickContainerAi.classList.remove('winner');
  pickPlaceholder.classList.remove('hidden');
  pickContainerElement.classList.add('hidden');
};

rules.addEventListener('click', () => {
  wrapperRules.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  wrapperRules.classList.remove('active');
});

const init = () => {
  renderScore();
  bindPickEvents();
};

init();