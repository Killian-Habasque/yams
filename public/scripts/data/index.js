
import { user } from "./user.js";
import { score } from "./score.js";
import { rule } from "./rule.js";

function displayUserError(errorMessage, className) {
  const errorSection = document.querySelector(className);
  errorSection.innerHTML = '<p id="userError" class="txt__label">' + errorMessage + '</p>';
}
function displayLoading(className) {
  const errorSection = document.querySelector(className);
  errorSection.innerHTML = '<p id="loading-indicator" class="txt__label"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" /></svg>Chargement</p>';
}
function removeAll(className) {
  const errorSection = document.querySelector(className);
  errorSection.innerHTML = '';
}

export function loadData() {
  const registerForm = document.getElementById("register-form");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const pseudoInput = document.getElementById("text");
    const passwordInput = document.getElementById("password");
    const verifPasswordInput = document.getElementById("verif-password");

    const errorCLass = '.register .form-message';

    if (pseudoInput.value.trim() === '' || passwordInput.value.trim() === '' || verifPasswordInput.value.trim() === '') {
      displayUserError("Veuillez remplir tous les champs.", errorCLass);
      return;
    }
    if (passwordInput.value.trim() !== verifPasswordInput.value.trim()) {
      displayUserError("Les mots de passe ne sont pas similaires.", errorCLass);
      return;
    }
    displayLoading(errorCLass)

    try {
      const response = await user.auth.register(pseudoInput.value, passwordInput.value, verifPasswordInput.value);
      if (response.error) {
        displayUserError("Échec de l'inscription: " + response.error, errorCLass);
      } else {
        console.log("Inscription réussie:", response);
        initUser()
        removeAll(errorCLass)
      }
    } catch (error) {
      console.error("Registration error:", error);
      displayUserError("Échec de l'inscription: " + error.message, errorCLass);
    }
  });

  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const pseudoInput = document.getElementById("login-text");
    const passwordInput = document.getElementById("login-password");

    const errorCLass = '.login .form-message';

    if (pseudoInput.value.trim() === '' || passwordInput.value.trim() === '') {
      displayUserError("Veuillez remplir tous les champs.", errorCLass);
      return;
    }

    displayLoading(errorCLass)
    try {
      const data = await user.auth.login(pseudoInput.value, passwordInput.value);
      if (data.error) {
        console.error('Login error:', data.error);
        displayUserError('Échec de la connexion: ' + data.error, errorCLass);
      } else {
        console.log('Utilisateur connecté:', data);
        initUser()
        removeAll(errorCLass)
      }
    } catch (error) {
      console.error('Erreur lors de la connexion utilisateur', error);
      displayUserError('Échec de la connexion: ' + error.message, errorCLass);
    }
  });

  const logout = document.getElementById("logout");
  logout.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const data = await user.auth.logout();
      if (data.error) {
        console.error('Logout error:', data.error);
      } else {
        console.log('Utilisateur déconnecté:', data);
        initUser()
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion utilisateur', error);
    }
  });

  initRule()
  initScore()
  initUser()
}

export async function initRule() {
  const swiper = document.getElementById("data-rule");
  displayLoading("#data-rule");

  try {
    const data = await rule.getRules();

    if (data.error) {
      console.error('Rules error:', data.error);
    }

    swiper.innerHTML = '';

    const ruleElements = [];

    data.forEach((rule) => {
      const listItem = document.createElement('div');
      listItem.classList.add('rule-item');

      let examplesHTML = '';

      if (rule.exemple && (Array.isArray(rule.exemple) && rule.exemple.length > 0)) {
        examplesHTML = '<div class="examples">';
        rule.exemple.forEach(dice => {
          examplesHTML += `<img src="assets/images/icons/${dice}.svg" alt="${dice}" />`;
        });
        examplesHTML += '</div>';
      }

      let pointsHTML = '';
      if (rule.points && rule.points.length > 0) {
        pointsHTML += `<p class="txt__label"><b>Points: </b>${rule.points}</p>`;
      }

      listItem.innerHTML = `
        ${examplesHTML}
        <p class="txt__number">${rule.name ?? ''}</p>
        <p class="txt__label">${rule.description ?? ''}</p>
          ${pointsHTML}
      `;

      if (rule.name || rule.description) {
        ruleElements.push(listItem);
      }
    });

    let currentIndex = 0;

    const updateSwiper = (index) => {
      swiper.innerHTML = '';
      swiper.appendChild(ruleElements[index]);

      const arrows = document.createElement('div');
      arrows.classList.add('arrow-item');

      arrows.innerHTML = `
        <button id="before" class="" ${index === 0 ? 'disabled' : ''}>
          <svg width="31" height="24" viewBox="0 0 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.04883 10.5C1.2204 10.5 0.548828 11.1716 0.548828 12C0.548828 12.8284 1.2204 13.5 2.04883 13.5V10.5ZM29.6371 13.0607C30.2229 12.4749 30.2229 11.5251 29.6371 10.9393L20.0912 1.3934C19.5054 0.807612 18.5556 0.807612 17.9699 1.3934C17.3841 1.97918 17.3841 2.92893 17.9699 3.51472L26.4551 12L17.9699 20.4853C17.3841 21.0711 17.3841 22.0208 17.9699 22.6066C18.5556 23.1924 19.5054 23.1924 20.0912 22.6066L29.6371 13.0607ZM2.04883 13.5H28.5765V10.5H2.04883V13.5Z" fill="black"/>
          </svg>
        </button>
        <button id="after" class="" ${index === ruleElements.length - 1 ? 'disabled' : ''}>
          <svg width="31" height="24" viewBox="0 0 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.04883 10.5C1.2204 10.5 0.548828 11.1716 0.548828 12C0.548828 12.8284 1.2204 13.5 2.04883 13.5V10.5ZM29.6371 13.0607C30.2229 12.4749 30.2229 11.5251 29.6371 10.9393L20.0912 1.3934C19.5054 0.807612 18.5556 0.807612 17.9699 1.3934C17.3841 1.97918 17.3841 2.92893 17.9699 3.51472L26.4551 12L17.9699 20.4853C17.3841 21.0711 17.3841 22.0208 17.9699 22.6066C18.5556 23.1924 19.5054 23.1924 20.0912 22.6066L29.6371 13.0607ZM2.04883 13.5H28.5765V10.5H2.04883V13.5Z" fill="black"/>
          </svg>
        </button>
      `;
      swiper.appendChild(arrows);

      document.getElementById("before").addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateSwiper(currentIndex);
        }
      });

      document.getElementById("after").addEventListener('click', () => {
        if (currentIndex < ruleElements.length - 1) {
          currentIndex++;
          updateSwiper(currentIndex);
        }
      });
    };

    updateSwiper(currentIndex);

  } catch (error) {
    console.error('Erreur lors de la récupération des règles', error);
  }
}


export async function initScore() {
  const board = document.getElementById("data-score");
  displayLoading("#data-score")

  try {
    const data = await score.board.getScores();

    if (data.error) {
      console.error('Scores error:', data.error);
    }

    board.innerHTML = '';

    data.forEach((user, index) => {
      const listItem = document.createElement('tr');
      listItem.classList.add('score-item');

      let emoji = '';
      if (index === 0) {
        emoji = '🥇';
      } else if (index === 1) {
        emoji = '🥈';
      } else if (index === 2) {
        emoji = '🥉';
      }

      listItem.innerHTML = `
                <td class="txt__label">${emoji}${index + 1} - ${user.pseudo}</td>
                <td class="txt__number">${user.bestscore}</td>
            `;
      board.appendChild(listItem);
    });


  } catch (error) {
    console.error('Erreur lors de la récupération des scores', error);
  }
}

async function initUser() {
  const profil = document.getElementById("data-user");

  try {
    const data = await user.auth.getUser();
    if (data) {
      profil.innerHTML = `
                  <li class="position"><span class="txt__label">Pseudo:</span> <span class="txt__number">${data.pseudo}</span></li>
                  <li class="username"><span class="txt__label">Meilleur score:</span>  <span class="txt__number">${data.bestscore}</span></li>
              `;
      showUserProfile()
    }
  } catch (error) {
    profil.innerHTML = '';
    showUserForm()
  }
}




function showUserForm() {
  const userForm = document.querySelector('.header--userForm');
  const userProfile = document.querySelector('.header--userProfile');
  if (!userForm.classList.contains('active')) {
    userForm.classList.add('active');
    userProfile.classList.remove('active');
  }
}
function showUserProfile() {
  const userForm = document.querySelector('.header--userForm');
  const userProfile = document.querySelector('.header--userProfile');
  if (!userProfile.classList.contains('active')) {
    userProfile.classList.add('active');
    userForm.classList.remove('active');
  }
}


export async function setScore(newScore) {
  try {
    const data = await score.board.setScore(newScore);
    if (data.error) {
      console.error('Update score error:', data.error);
    } else {
      console.log('Score modifié:', data);
      initUser()
    }
  } catch (error) {
    console.error('Échec de la modification du score', error);
  }
}

