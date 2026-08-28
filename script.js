/* =========================================================
ROUTIER 87 MUSIC HUB V9
FICHIER : script.js
========================================================= */

/* =========================================================

1. COMPTES DU SITE
   ========================================================= */

const USERS = {
"Routier 87": {
username: "Routier 87",
password: "2001",
displayName: "Routier 87",
role: "Créateur du site",
icon: "👑",
creator: true
},

```
"Benjamin": {
    username: "Benjamin",
    password: "2026",
    displayName: "Benjamin",
    role: "Membre",
    icon: "🎵"
},

"Samantha": {
    username: "Samantha",
    password: "2026",
    displayName: "Samantha",
    role: "Membre",
    icon: "🎵"
},

"Océane": {
    username: "Océane",
    password: "2026",
    displayName: "Océane",
    role: "Membre",
    icon: "🎵"
},

"Chico": {
    username: "Chico",
    password: "2026",
    displayName: "Chico",
    role: "Membre",
    icon: "🎵"
},

"Christian": {
    username: "Christian",
    password: "2026",
    displayName: "Christian",
    role: "Membre",
    icon: "🎵"
},

"Manu": {
    username: "Manu",
    password: "2026",
    displayName: "Manu",
    role: "Membre",
    icon: "🎵"
},

"Éric": {
    username: "Éric",
    password: "2026",
    displayName: "Éric",
    role: "Membre",
    icon: "🎵"
},

"Mr_Wolf": {
    username: "Mr_Wolf",
    password: "2026",
    displayName: "Mr_Wolf",
    role: "Membre",
    icon: "🐺"
},

"Tristan": {
    username: "Tristan",
    password: "2026",
    displayName: "Tristan",
    role: "Membre",
    icon: "🎵"
},

"Manon": {
    username: "Manon",
    password: "2026",
    displayName: "Manon",
    role: "Membre",
    icon: "🎵"
},

"FAR Motors Transport": {
    username: "FOT",
    password: "2025",
    displayName: "FAR Motors Transport",
    role: "Transport",
    icon: "🚛"
}
```

};

/* =========================================================
2. VARIABLES PRINCIPALES
========================================================= */

let currentUser = null;
let selectedProfile = "Routier 87";
let currentSongId = null;
let currentPlayingSong = null;

const audioPlayer = document.getElementById("audioPlayer");

const STORAGE_MUSIC = "routier87_music_v9";
const STORAGE_ACTIVITY = "routier87_activity_v9";

/* =========================================================
3. BASE DE DONNÉES LOCALE
========================================================= */

function getMusicDatabase() {

```
try {
    const data = localStorage.getItem(STORAGE_MUSIC);

    if (!data) {
        return {};
    }

    return JSON.parse(data);

} catch (error) {
    console.error("Erreur chargement musiques :", error);
    return {};
}
```

}

function saveMusicDatabase(database) {

```
try {
    localStorage.setItem(
        STORAGE_MUSIC,
        JSON.stringify(database)
    );

} catch (error) {

    console.error(
        "Erreur sauvegarde locale :",
        error
    );

    showToast(
        "❌",
        "Impossible de sauvegarder certaines données."
    );
}
```

}

function getActivityDatabase() {

```
try {
    const data = localStorage.getItem(STORAGE_ACTIVITY);

    if (!data) {
        return [];
    }

    return JSON.parse(data);

} catch (error) {
    console.error("Erreur chargement activité :", error);
    return [];
}
```

}

function saveActivityDatabase(activity) {

```
try {
    localStorage.setItem(
        STORAGE_ACTIVITY,
        JSON.stringify(activity)
    );

} catch (error) {
    console.error("Erreur sauvegarde activité :", error);
}
```

}

/* =========================================================
4. INITIALISATION
========================================================= */

document.addEventListener(
"DOMContentLoaded",
function () {

```
    setupLogin();

    setupLogout();

    setupProfileButtons();

    setupSearch();

    setupAudioPlayer();

    restoreSession();
}
```

);

/* =========================================================
5. CONNEXION
========================================================= */

function setupLogin() {

```
const loginForm =
    document.getElementById("loginForm");

if (!loginForm) {
    return;
}

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const usernameInput =
            document.getElementById("username");

        const passwordInput =
            document.getElementById("password");

        const loginMessage =
            document.getElementById("loginMessage");

        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value;

        let foundUser = null;

        Object.values(USERS).forEach(
            function (user) {

                if (
                    user.username.toLowerCase() ===
                    username.toLowerCase()
                ) {
                    foundUser = user;
                }
            }
        );


        if (!foundUser) {

            loginMessage.textContent =
                "❌ Identifiant incorrect.";

            return;
        }


        if (
            foundUser.password !== password
        ) {

            loginMessage.textContent =
                "❌ Mot de passe incorrect.";

            return;
        }


        currentUser = foundUser;

        selectedProfile =
            foundUser.displayName;

        loginMessage.textContent = "";

        localStorage.setItem(
            "routier87_current_user",
            foundUser.displayName
        );

        openApplication();
    }
);


const togglePassword =
    document.getElementById("togglePassword");

const passwordInput =
    document.getElementById("password");


if (
    togglePassword &&
    passwordInput
) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                togglePassword.textContent =
                    "🙈";

            } else {

                passwordInput.type =
                    "password";

                togglePassword.textContent =
                    "👁️";
            }
        }
    );
}
```

}

/* =========================================================
6. RESTAURATION SESSION
========================================================= */

function restoreSession() {

```
const savedUser =
    localStorage.getItem(
        "routier87_current_user"
    );

if (
    savedUser &&
    USERS[savedUser]
) {

    currentUser =
        USERS[savedUser];

    selectedProfile =
        currentUser.displayName;

    openApplication();
}
```

}

/* =========================================================
7. OUVRIR L'APPLICATION
========================================================= */

function openApplication() {

```
const loginScreen =
    document.getElementById("loginScreen");

const app =
    document.getElementById("app");

if (loginScreen) {
    loginScreen.style.display = "none";
}

if (app) {
    app.style.display = "grid";
}


updateCurrentUser();

renderProfiles();

selectProfile(selectedProfile);

setupCreatorPanel();

renderCreatorStatistics();

renderActivity();
```

}

/* =========================================================
8. UTILISATEUR CONNECTÉ
========================================================= */

function updateCurrentUser() {

```
const currentUserName =
    document.getElementById("currentUserName");

const currentUserRole =
    document.getElementById("currentUserRole");

if (!currentUser) {
    return;
}

if (currentUserName) {

    currentUserName.textContent =
        currentUser.displayName;
}

if (currentUserRole) {

    currentUserRole.textContent =
        currentUser.role;
}
```

}

/* =========================================================
9. DÉCONNEXION
========================================================= */

function setupLogout() {

```
const logoutButton =
    document.getElementById("logoutButton");

if (!logoutButton) {
    return;
}

logoutButton.addEventListener(
    "click",
    function () {

        if (audioPlayer) {

            audioPlayer.pause();

            audioPlayer.currentTime = 0;
        }

        currentUser = null;
        currentPlayingSong = null;

        localStorage.removeItem(
            "routier87_current_user"
        );

        const app =
            document.getElementById("app");

        const loginScreen =
            document.getElementById("loginScreen");

        if (app) {
            app.style.display = "none";
        }

        if (loginScreen) {
            loginScreen.style.display = "flex";
        }

        showToast(
            "👋",
            "Vous êtes déconnecté."
        );
    }
);
```

}

/* =========================================================
10. PROFILS
========================================================= */

function setupProfileButtons() {

```
const profilesList =
    document.getElementById("profilesList");

if (!profilesList) {
    return;
}

profilesList.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".profile-button"
            );

        if (!button) {
            return;
        }

        const profile =
            button.dataset.profile;

        selectProfile(profile);
    }
);
```

}

function renderProfiles() {

```
const profilesList =
    document.getElementById("profilesList");

if (!profilesList) {
    return;
}

profilesList.innerHTML = "";

Object.values(USERS).forEach(
    function (user) {

        const button =
            document.createElement("button");

        button.className =
            "profile-button";

        button.dataset.profile =
            user.displayName;

        if (
            user.displayName ===
            selectedProfile
        ) {

            button.classList.add("active");
        }

        button.innerHTML = `
            <span class="profile-button-icon">
                ${user.icon}
            </span>

            <span class="profile-button-text">
                <strong>
                    ${escapeHTML(user.displayName)}
                </strong>

                <span>
                    ${escapeHTML(user.role)}
                </span>
            </span>
        `;

        profilesList.appendChild(button);
    }
);
```

}

function selectProfile(profileName) {

```
if (!USERS[profileName]) {
    return;
}

selectedProfile = profileName;

renderProfiles();

updateProfileHero();

renderMusicGrid();

setupCreatorPanel();

if (
    currentUser &&
    currentUser.creator
) {
    setupMusicPublishPanel();
}
```

}

/* =========================================================
11. EN-TÊTE DU PROFIL
========================================================= */

function updateProfileHero() {

```
const profileTitle =
    document.getElementById("profileTitle");

const profileDescription =
    document.getElementById(
        "profileDescription"
    );

const user =
    USERS[selectedProfile];

if (!user) {
    return;
}

if (profileTitle) {

    profileTitle.textContent =
        `${user.icon} ${user.displayName}`;
}

if (profileDescription) {

    if (user.creator) {

        profileDescription.textContent =
            "Panneau principal du créateur du Music Hub.";

    } else {

        profileDescription.textContent =
            `Bibliothèque musicale de ${user.displayName}.`;
    }
}
```

}

/* =========================================================
12. PANNEAU AJOUT MUSIQUE DU CRÉATEUR
========================================================= */

function setupCreatorPanel() {

```
const creatorPanel =
    document.getElementById("creatorPanel");

if (!creatorPanel) {
    return;
}

if (
    currentUser &&
    currentUser.creator
) {

    creatorPanel.style.display =
        "block";

} else {

    creatorPanel.style.display =
        "none";
}
```

}

function setupMusicPublishPanel() {

```
const publishForm =
    document.getElementById(
        "publishMusicForm"
    );

if (!publishForm) {
    return;
}


if (
    publishForm.dataset.initialized ===
    "true"
) {
    return;
}

publishForm.dataset.initialized =
    "true";


const targetSelect =
    document.getElementById(
        "musicTargetProfile"
    );

if (targetSelect) {

    targetSelect.innerHTML = "";

    Object.values(USERS).forEach(
        function (user) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                user.displayName;

            option.textContent =
                `${user.icon} ${user.displayName}`;

            targetSelect.appendChild(
                option
            );
        }
    );

    targetSelect.value =
        selectedProfile;
}


publishForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        await publishMusic();
    }
);


const coverInput =
    document.getElementById(
        "musicCover"
    );

const audioInput =
    document.getElementById(
        "musicAudio"
    );


if (coverInput) {

    coverInput.addEventListener(
        "change",
        function () {

            updateFileName(
                coverInput,
                "coverFileName"
            );
        }
    );
}


if (audioInput) {

    audioInput.addEventListener(
        "change",
        function () {

            updateFileName(
                audioInput,
                "audioFileName"
            );
        }
    );
}
```

}

/* =========================================================
13. PUBLIER UNE MUSIQUE
========================================================= */

async function publishMusic() {

```
if (
    !currentUser ||
    !currentUser.creator
) {

    showToast(
        "❌",
        "Seul Routier 87 peut publier une musique."
    );

    return;
}


const titleInput =
    document.getElementById(
        "musicTitle"
    );

const targetInput =
    document.getElementById(
        "musicTargetProfile"
    );

const coverInput =
    document.getElementById(
        "musicCover"
    );

const audioInput =
    document.getElementById(
        "musicAudio"
    );


if (
    !titleInput ||
    !targetInput ||
    !audioInput
) {

    showToast(
        "❌",
        "Erreur : formulaire introuvable."
    );

    return;
}


const title =
    titleInput.value.trim();

const targetProfile =
    targetInput.value;

const coverFile =
    coverInput ?
    coverInput.files[0] :
    null;

const audioFile =
    audioInput.files[0];


if (!title) {

    showToast(
        "⚠️",
        "Veuillez indiquer le titre de la musique."
    );

    return;
}


if (!targetProfile) {

    showToast(
        "⚠️",
        "Veuillez sélectionner un profil."
    );

    return;
}


if (!audioFile) {

    showToast(
        "⚠️",
        "Veuillez sélectionner un fichier audio MP3."
    );

    return;
}


try {

    showToast(
        "⏳",
        "Préparation de la musique..."
    );


    const audioData =
        await fileToDataURL(audioFile);


    let coverData = "";

    if (coverFile) {

        coverData =
            await fileToDataURL(coverFile);
    }


    const database =
        getMusicDatabase();


    if (!database[targetProfile]) {

        database[targetProfile] = [];
    }


    const newMusic = {

        id:
            generateId(),

        title:
            title,

        artist:
            "Routier 87",

        profile:
            targetProfile,

        cover:
            coverData,

        audio:
            audioData,

        likes:
            0,

        dislikes:
            0,

        downloads:
            0,

        comments:
            [],

        createdAt:
            new Date().toISOString()
    };


    database[targetProfile].push(
        newMusic
    );


    saveMusicDatabase(database);


    addActivity(
        "music",
        currentUser.displayName,
        `a publié « ${title} » sur le profil ${targetProfile}.`
    );


    titleInput.value = "";

    if (coverInput) {
        coverInput.value = "";
    }

    audioInput.value = "";

    const coverFileName =
        document.getElementById(
            "coverFileName"
        );

    const audioFileName =
        document.getElementById(
            "audioFileName"
        );

    if (coverFileName) {
        coverFileName.textContent =
            "Aucune image sélectionnée";
    }

    if (audioFileName) {
        audioFileName.textContent =
            "Aucun fichier audio sélectionné";
    }


    renderCreatorStatistics();

    renderActivity();


    if (
        selectedProfile ===
        targetProfile
    ) {

        renderMusicGrid();
    }


    showToast(
        "✅",
        `La musique a été publiée sur ${targetProfile} !`
    );

} catch (error) {

    console.error(
        "Erreur publication :",
        error
    );

    showToast(
        "❌",
        "Impossible de publier cette musique."
    );
}
```

}

/* =========================================================
14. CONVERSION FICHIER EN DATA URL
========================================================= */

function fileToDataURL(file) {

```
return new Promise(
    function (resolve, reject) {

        const reader =
            new FileReader();

        reader.onload =
            function () {

                resolve(
                    reader.result
                );
            };

        reader.onerror =
            function () {

                reject(
                    new Error(
                        "Impossible de lire le fichier."
                    )
                );
            };

        reader.readAsDataURL(file);
    }
);
```

}

/* =========================================================
15. NOM DES FICHIERS
========================================================= */

function updateFileName(
input,
targetId
) {

```
const target =
    document.getElementById(targetId);

if (!target) {
    return;
}

if (
    input.files &&
    input.files.length > 0
) {

    target.textContent =
        input.files[0].name;

} else {

    target.textContent =
        targetId === "coverFileName"
        ? "Aucune image sélectionnée"
        : "Aucun fichier audio sélectionné";
}
```

}

/* =========================================================
16. AFFICHER LES MUSIQUES
========================================================= */

function renderMusicGrid() {

```
const musicGrid =
    document.getElementById("musicGrid");

const musicCounter =
    document.getElementById(
        "musicCounter"
    );

if (!musicGrid) {
    return;
}


const database =
    getMusicDatabase();

const musics =
    database[selectedProfile] || [];


if (musicCounter) {

    const count =
        musics.length;

    musicCounter.textContent =
        `${count} musique${count > 1 ? "s" : ""}`;
}


musicGrid.innerHTML = "";


if (musics.length === 0) {

    musicGrid.innerHTML = `
        <div class="empty-music">
            <div class="empty-icon">🎧</div>

            <h3>
                Aucune musique pour le moment
            </h3>

            <p>
                La bibliothèque de ${escapeHTML(selectedProfile)}
                est actuellement vide.
            </p>
        </div>
    `;

    return;
}


musics.forEach(
    function (music) {

        const card =
            createMusicCard(music);

        musicGrid.appendChild(card);
    }
);
```

}

/* =========================================================
17. CRÉER UNE CARTE MUSIQUE
========================================================= */

function createMusicCard(music) {

```
const card =
    document.createElement("article");

card.className =
    "music-card";

card.dataset.musicId =
    music.id;


const coverStyle =
    music.cover
    ? `background-image: url('${music.cover}')`
    : "";


card.innerHTML = `

    <div
        class="music-cover"
        style="${coverStyle}"
    >

        ${
            !music.cover
            ? `<span class="music-cover-icon">🎵</span>`
            : ""
        }

        <button
            class="music-play-overlay"
            type="button"
            title="Lire la musique"
            data-action="play"
        >
            ▶
        </button>

    </div>


    <div class="music-card-content">

        <h3 class="music-card-title">
            ${escapeHTML(music.title)}
        </h3>

        <p class="music-card-artist">
            ${escapeHTML(music.artist || "Routier 87")}
        </p>


        <div class="music-actions">

            <button
                class="music-action-button"
                type="button"
                data-action="play"
                title="Lire"
            >
                ▶
            </button>


            <button
                class="music-action-button"
                type="button"
                data-action="like"
                title="J'aime"
            >
                👍 ${music.likes || 0}
            </button>


            <button
                class="music-action-button"
                type="button"
                data-action="dislike"
                title="Je n'aime pas"
            >
                👎 ${music.dislikes || 0}
            </button>


            <button
                class="music-action-button"
                type="button"
                data-action="comment"
                title="Commentaires"
            >
                💬 ${
                    Array.isArray(music.comments)
                    ? music.comments.length
                    : 0
                }
            </button>


            <button
                class="music-action-button"
                type="button"
                data-action="download"
                title="Télécharger"
            >
                ⬇
            </button>


            ${
                currentUser &&
                currentUser.creator
                ? `
                    <button
                        class="music-action-button"
                        type="button"
                        data-action="edit"
                        title="Modifier"
                    >
                        ✏️
                    </button>

                    <button
                        class="music-action-button"
                        type="button"
                        data-action="delete"
                        title="Supprimer"
                    >
                        🗑️
                    </button>
                `
                : ""
            }

        </div>

    </div>
`;


card.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "[data-action]"
            );

        if (!button) {
            return;
        }

        const action =
            button.dataset.action;

        handleMusicAction(
            music.id,
            action
        );
    }
);


return card;
```

}

/* =========================================================
18. ACTIONS SUR UNE MUSIQUE
========================================================= */

function handleMusicAction(
musicId,
action
) {

```
const music =
    findMusicById(musicId);

if (!music) {

    showToast(
        "❌",
        "Musique introuvable."
    );

    return;
}


switch (action) {

    case "play":
        playMusic(music);
        break;

    case "like":
        likeMusic(music);
        break;

    case "dislike":
        dislikeMusic(music);
        break;

    case "comment":
        openComments(music);
        break;

    case "download":
        downloadMusic(music);
        break;

    case "edit":
        editMusic(music);
        break;

    case "delete":
        deleteMusic(music);
        break;
}
```

}

/* =========================================================
19. TROUVER UNE MUSIQUE
========================================================= */

function findMusicById(musicId) {

```
const database =
    getMusicDatabase();


for (
    const profileName in database
) {

    const musics =
        database[profileName];

    const found =
        musics.find(
            function (music) {

                return (
                    music.id ===
                    musicId
                );
            }
        );


    if (found) {

        return found;
    }
}


return null;
```

}

/* =========================================================
20. LECTURE DE LA MUSIQUE
========================================================= */

function playMusic(music) {

```
if (!audioPlayer) {

    showToast(
        "❌",
        "Lecteur audio introuvable."
    );

    return;
}


if (!music.audio) {

    showToast(
        "❌",
        "Cette musique ne contient aucun fichier audio."
    );

    return;
}


currentPlayingSong =
    music;


const playerTitle =
    document.getElementById(
        "playerTitle"
    );

const playerArtist =
    document.getElementById(
        "playerArtist"
    );

const playerCover =
    document.getElementById(
        "playerCover"
    );

const playerBar =
    document.getElementById(
        "playerBar"
    );


if (playerTitle) {

    playerTitle.textContent =
        music.title;
}

if (playerArtist) {

    playerArtist.textContent =
        `${music.artist || "Routier 87"} • ${music.profile}`;
}

if (playerCover) {

    if (music.cover) {

        playerCover.style.backgroundImage =
            `url('${music.cover}')`;

        playerCover.textContent = "";

    } else {

        playerCover.style.backgroundImage =
            "";

        playerCover.textContent = "🎵";
    }
}


if (playerBar) {

    playerBar.style.display =
        "grid";
}


const sameSong =
    audioPlayer.dataset.musicId ===
    music.id;


if (sameSong) {

    if (
        audioPlayer.paused
    ) {

        audioPlayer.play()
            .then(function () {

                updatePlayButton(true);

            })
            .catch(function (error) {

                console.error(error);

                showToast(
                    "❌",
                    "Impossible de lancer la musique."
                );
            });

    } else {

        audioPlayer.pause();

        updatePlayButton(false);
    }

    return;
}


audioPlayer.pause();

audioPlayer.src =
    music.audio;

audioPlayer.dataset.musicId =
    music.id;

audioPlayer.load();


audioPlayer.play()
    .then(function () {

        updatePlayButton(true);

        addActivity(
            "play",
            currentUser
                ? currentUser.displayName
                : "Un utilisateur",
            `écoute « ${music.title} ».`
        );

        renderActivity();

    })
    .catch(function (error) {

        console.error(
            "Erreur lecture :",
            error
        );

        showToast(
            "❌",
            "Le navigateur n'a pas pu lire ce fichier audio."
        );
    });
```

}

/* =========================================================
21. CONFIGURATION LECTEUR
========================================================= */

function setupAudioPlayer() {

```
if (!audioPlayer) {
    return;
}


const playPauseButton =
    document.getElementById(
        "playerPlayPause"
    );

const previousButton =
    document.getElementById(
        "playerPrevious"
    );

const nextButton =
    document.getElementById(
        "playerNext"
    );

const progress =
    document.getElementById(
        "playerProgress"
    );

const volume =
    document.getElementById(
        "playerVolume"
    );

const currentTime =
    document.getElementById(
        "playerCurrentTime"
    );

const duration =
    document.getElementById(
        "playerDuration"
    );


if (playPauseButton) {

    playPauseButton.addEventListener(
        "click",
        function () {

            if (!audioPlayer.src) {

                showToast(
                    "ℹ️",
                    "Sélectionnez une musique."
                );

                return;
            }


            if (audioPlayer.paused) {

                audioPlayer.play()
                    .then(function () {

                        updatePlayButton(true);

                    })
                    .catch(function (error) {

                        console.error(error);
                    });

            } else {

                audioPlayer.pause();

                updatePlayButton(false);
            }
        }
    );
}


if (previousButton) {

    previousButton.addEventListener(
        "click",
        function () {

            playPreviousMusic();
        }
    );
}


if (nextButton) {

    nextButton.addEventListener(
        "click",
        function () {

            playNextMusic();
        }
    );
}


if (progress) {

    progress.addEventListener(
        "input",
        function () {

            if (
                Number.isFinite(
                    audioPlayer.duration
                )
            ) {

                audioPlayer.currentTime =
                    (
                        progress.value / 100
                    ) *
                    audioPlayer.duration;
            }
        }
    );
}


if (volume) {

    audioPlayer.volume =
        volume.value;

    volume.addEventListener(
        "input",
        function () {

            audioPlayer.volume =
                volume.value;
        }
    );
}


audioPlayer.addEventListener(
    "loadedmetadata",
    function () {

        if (duration) {

            duration.textContent =
                formatTime(
                    audioPlayer.duration
                );
        }
    }
);


audioPlayer.addEventListener(
    "timeupdate",
    function () {

        if (
            !Number.isFinite(
                audioPlayer.duration
            )
        ) {
            return;
        }


        if (progress) {

            progress.value =
                (
                    audioPlayer.currentTime /
                    audioPlayer.duration
                ) *
                100;
        }


        if (currentTime) {

            currentTime.textContent =
                formatTime(
                    audioPlayer.currentTime
                );
        }
    }
);


audioPlayer.addEventListener(
    "play",
    function () {

        updatePlayButton(true);
    }
);


audioPlayer.addEventListener(
    "pause",
    function () {

        updatePlayButton(false);
    }
);


audioPlayer.addEventListener(
    "ended",
    function () {

        updatePlayButton(false);

        playNextMusic();
    }
);


audioPlayer.addEventListener(
    "error",
    function () {

        showToast(
            "❌",
            "Erreur pendant la lecture du fichier audio."
        );

        updatePlayButton(false);
    }
);
```

}

/* =========================================================
22. BOUTON PLAY / PAUSE
========================================================= */

function updatePlayButton(isPlaying) {

```
const button =
    document.getElementById(
        "playerPlayPause"
    );

if (!button) {
    return;
}

button.textContent =
    isPlaying ? "⏸" : "▶";
```

}

/* =========================================================
23. MUSIQUE SUIVANTE
========================================================= */

function playNextMusic() {

```
const database =
    getMusicDatabase();

const musics =
    database[selectedProfile] || [];


if (musics.length === 0) {
    return;
}


if (!currentPlayingSong) {

    playMusic(musics[0]);

    return;
}


const currentIndex =
    musics.findIndex(
        function (music) {

            return (
                music.id ===
                currentPlayingSong.id
            );
        }
    );


const nextIndex =
    currentIndex === -1
    ? 0
    : (
        currentIndex + 1
    ) % musics.length;


playMusic(
    musics[nextIndex]
);
```

}

/* =========================================================
24. MUSIQUE PRÉCÉDENTE
========================================================= */

function playPreviousMusic() {

```
const database =
    getMusicDatabase();

const musics =
    database[selectedProfile] || [];


if (musics.length === 0) {
    return;
}


if (!currentPlayingSong) {

    playMusic(musics[0]);

    return;
}


const currentIndex =
    musics.findIndex(
        function (music) {

            return (
                music.id ===
                currentPlayingSong.id
            );
        }
    );


const previousIndex =
    currentIndex <= 0
    ? musics.length - 1
    : currentIndex - 1;


playMusic(
    musics[previousIndex]
);
```

}

/* =========================================================
25. J'AIME
========================================================= */

function likeMusic(music) {

```
updateMusic(
    music.id,
    function (targetMusic) {

        targetMusic.likes =
            (targetMusic.likes || 0) + 1;
    }
);


addActivity(
    "like",
    currentUser
        ? currentUser.displayName
        : "Un utilisateur",
    `a aimé « ${music.title} ».`
);


renderMusicGrid();

renderCreatorStatistics();

renderActivity();

showToast(
    "👍",
    "Votre j'aime a été enregistré."
);
```

}

/* =========================================================
26. JE N'AIME PAS
========================================================= */

function dislikeMusic(music) {

```
updateMusic(
    music.id,
    function (targetMusic) {

        targetMusic.dislikes =
            (targetMusic.dislikes || 0) + 1;
    }
);


addActivity(
    "dislike",
    currentUser
        ? currentUser.displayName
        : "Un utilisateur",
    `n'a pas aimé « ${music.title} ».`
);


renderMusicGrid();

renderCreatorStatistics();

renderActivity();

showToast(
    "👎",
    "Votre avis a été enregistré."
);
```

}

/* =========================================================
27. METTRE À JOUR UNE MUSIQUE
========================================================= */

function updateMusic(
musicId,
callback
) {

```
const database =
    getMusicDatabase();


for (
    const profileName in database
) {

    const index =
        database[profileName].findIndex(
            function (music) {

                return (
                    music.id ===
                    musicId
                );
            }
        );


    if (index !== -1) {

        callback(
            database[profileName][index]
        );

        saveMusicDatabase(database);

        return true;
    }
}


return false;
```

}

/* =========================================================
28. TÉLÉCHARGER UNE MUSIQUE
========================================================= */

function downloadMusic(music) {

```
if (!music.audio) {

    showToast(
        "❌",
        "Fichier audio introuvable."
    );

    return;
}


const link =
    document.createElement("a");

link.href =
    music.audio;

link.download =
    `${sanitizeFileName(
        music.title
    )}.mp3`;

document.body.appendChild(link);

link.click();

link.remove();


updateMusic(
    music.id,
    function (targetMusic) {

        targetMusic.downloads =
            (targetMusic.downloads || 0) + 1;
    }
);


addActivity(
    "download",
    currentUser
        ? currentUser.displayName
        : "Un utilisateur",
    `a téléchargé « ${music.title} ».`
);


renderCreatorStatistics();

renderActivity();

showToast(
    "⬇️",
    "Téléchargement lancé."
);
```

}

/* =========================================================
29. COMMENTAIRES
========================================================= */

function openComments(music) {

```
currentSongId =
    music.id;


const modal =
    document.getElementById(
        "commentsModal"
    );

const title =
    document.getElementById(
        "commentsMusicTitle"
    );

if (!modal) {
    return;
}

if (title) {

    title.textContent =
        music.title;
}


renderComments(music);

modal.style.display =
    "flex";


setupCommentModal();
```

}

function closeComments() {

```
const modal =
    document.getElementById(
        "commentsModal"
    );

if (modal) {

    modal.style.display =
        "none";
}

currentSongId = null;
```

}

function setupCommentModal() {

```
const closeButton =
    document.getElementById(
        "closeCommentsModal"
    );

const sendButton =
    document.getElementById(
        "sendCommentButton"
    );

const modal =
    document.getElementById(
        "commentsModal"
    );


if (
    closeButton &&
    closeButton.dataset.initialized !==
    "true"
) {

    closeButton.dataset.initialized =
        "true";

    closeButton.addEventListener(
        "click",
        closeComments
    );
}


if (
    sendButton &&
    sendButton.dataset.initialized !==
    "true"
) {

    sendButton.dataset.initialized =
        "true";

    sendButton.addEventListener(
        "click",
        sendComment
    );
}


if (
    modal &&
    modal.dataset.initialized !==
    "true"
) {

    modal.dataset.initialized =
        "true";

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeComments();
            }
        }
    );
}
```

}

function renderComments(music) {

```
const commentsList =
    document.getElementById(
        "commentsList"
    );

if (!commentsList) {
    return;
}


const comments =
    Array.isArray(music.comments)
    ? music.comments
    : [];


if (comments.length === 0) {

    commentsList.innerHTML = `
        <p class="no-comments">
            Aucun commentaire pour le moment.
        </p>
    `;

    return;
}


commentsList.innerHTML =
    comments
        .slice()
        .reverse()
        .map(
            function (comment) {

                return `
                    <div class="comment-item">

                        <div class="comment-item-header">

                            <div class="comment-user">

                                <span class="comment-user-avatar">
                                    💬
                                </span>

                                ${escapeHTML(
                                    comment.user
                                )}

                            </div>

                            <span class="comment-date">
                                ${formatDate(
                                    comment.date
                                )}
                            </span>

                        </div>

                        <p class="comment-text">
                            ${escapeHTML(
                                comment.text
                            )}
                        </p>

                    </div>
                `;
            }
        )
        .join("");
```

}

function sendComment() {

```
if (!currentSongId) {
    return;
}


if (!currentUser) {

    showToast(
        "❌",
        "Vous devez être connecté."
    );

    return;
}


const input =
    document.getElementById(
        "commentInput"
    );

if (!input) {
    return;
}


const text =
    input.value.trim();


if (!text) {

    showToast(
        "⚠️",
        "Écrivez un commentaire."
    );

    return;
}


updateMusic(
    currentSongId,
    function (music) {

        if (
            !Array.isArray(
                music.comments
            )
        ) {

            music.comments = [];
        }


        music.comments.push({
            id: generateId(),
            user:
                currentUser.displayName,
            text:
                text,
            date:
                new Date().toISOString()
        });
    }
);


const music =
    findMusicById(
        currentSongId
    );


addActivity(
    "comment",
    currentUser.displayName,
    `a commenté « ${music.title} » : ${text}`
);


input.value = "";


renderComments(music);

renderMusicGrid();

renderCreatorStatistics();

renderActivity();


showToast(
    "💬",
    "Commentaire envoyé au créateur."
);
```

}

/* =========================================================
30. MODIFIER UNE MUSIQUE
========================================================= */

function editMusic(music) {

```
if (
    !currentUser ||
    !currentUser.creator
) {
    return;
}


const newTitle =
    prompt(
        "Nouveau titre de la musique :",
        music.title
    );


if (
    newTitle === null
) {
    return;
}


const cleanedTitle =
    newTitle.trim();


if (!cleanedTitle) {

    showToast(
        "⚠️",
        "Le titre ne peut pas être vide."
    );

    return;
}


updateMusic(
    music.id,
    function (targetMusic) {

        targetMusic.title =
            cleanedTitle;
    }
);


addActivity(
    "edit",
    currentUser.displayName,
    `a modifié le titre d'une musique en « ${cleanedTitle} ».`
);


if (
    currentPlayingSong &&
    currentPlayingSong.id ===
    music.id
) {

    currentPlayingSong.title =
        cleanedTitle;

    const playerTitle =
        document.getElementById(
            "playerTitle"
        );

    if (playerTitle) {

        playerTitle.textContent =
            cleanedTitle;
    }
}


renderMusicGrid();

renderCreatorStatistics();

renderActivity();

showToast(
    "✏️",
    "Musique modifiée avec succès."
);
```

}

/* =========================================================
31. SUPPRIMER UNE MUSIQUE
========================================================= */

function deleteMusic(music) {

```
if (
    !currentUser ||
    !currentUser.creator
) {
    return;
}


const confirmation =
    confirm(
        `Voulez-vous vraiment supprimer « ${music.title} » ?`
    );


if (!confirmation) {
    return;
}


const database =
    getMusicDatabase();


for (
    const profileName in database
) {

    const index =
        database[profileName].findIndex(
            function (item) {

                return (
                    item.id ===
                    music.id
                );
            }
        );


    if (index !== -1) {

        database[profileName].splice(
            index,
            1
        );

        saveMusicDatabase(database);

        break;
    }
}


if (
    currentPlayingSong &&
    currentPlayingSong.id ===
    music.id
) {

    audioPlayer.pause();

    audioPlayer.src = "";

    audioPlayer.dataset.musicId = "";

    currentPlayingSong = null;

    updatePlayButton(false);
}


addActivity(
    "delete",
    currentUser.displayName,
    `a supprimé « ${music.title} ».`
);


renderMusicGrid();

renderCreatorStatistics();

renderActivity();

showToast(
    "🗑️",
    "Musique supprimée."
);
```

}

/* =========================================================
32. STATISTIQUES DU CRÉATEUR
========================================================= */

function renderCreatorStatistics() {

```
const database =
    getMusicDatabase();

let totalMusics = 0;
let totalLikes = 0;
let totalDownloads = 0;
let totalComments = 0;


Object.values(database).forEach(
    function (musics) {

        musics.forEach(
            function (music) {

                totalMusics++;

                totalLikes +=
                    music.likes || 0;

                totalDownloads +=
                    music.downloads || 0;

                totalComments +=
                    Array.isArray(
                        music.comments
                    )
                    ? music.comments.length
                    : 0;
            }
        );
    }
);


setText(
    "statMusics",
    totalMusics
);

setText(
    "statLikes",
    totalLikes
);

setText(
    "statDownloads",
    totalDownloads
);

setText(
    "statComments",
    totalComments
);
```

}

/* =========================================================
33. ACTIVITÉ
========================================================= */

function addActivity(
type,
user,
message
) {

```
const activity =
    getActivityDatabase();


activity.push({
    id: generateId(),
    type: type,
    user: user,
    message: message,
    date:
        new Date().toISOString()
});


const limitedActivity =
    activity.slice(-100);


saveActivityDatabase(
    limitedActivity
);
```

}

function renderActivity() {

```
const activityList =
    document.getElementById(
        "activityList"
    );

if (!activityList) {
    return;
}


const activity =
    getActivityDatabase();


if (activity.length === 0) {

    activityList.innerHTML = `
        <p class="no-activity">
            Aucune activité pour le moment.
        </p>
    `;

    return;
}


activityList.innerHTML =
    activity
        .slice()
        .reverse()
        .slice(0, 30)
        .map(
            function (item) {

                return `
                    <div class="activity-item">

                        <div class="activity-avatar">
                            ${getActivityIcon(item.type)}
                        </div>

                        <div class="activity-content">

                            <p>
                                <strong>
                                    ${escapeHTML(
                                        item.user
                                    )}
                                </strong>

                                ${escapeHTML(
                                    item.message
                                )}
                            </p>

                            <small>
                                ${formatDate(
                                    item.date
                                )}
                            </small>

                        </div>

                    </div>
                `;
            }
        )
        .join("");
```

}

function getActivityIcon(type) {

```
const icons = {
    music: "🎵",
    play: "▶️",
    like: "👍",
    dislike: "👎",
    comment: "💬",
    download: "⬇️",
    edit: "✏️",
    delete: "🗑️"
};

return icons[type] || "🔔";
```

}

/* =========================================================
34. RECHERCHE
========================================================= */

function setupSearch() {

```
const searchInput =
    document.getElementById(
        "musicSearch"
    );

if (!searchInput) {
    return;
}


searchInput.addEventListener(
    "input",
    function () {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();

        filterMusic(search);
    }
);
```

}

function filterMusic(search) {

```
const cards =
    document.querySelectorAll(
        ".music-card"
    );


cards.forEach(
    function (card) {

        const title =
            card
                .querySelector(
                    ".music-card-title"
                )
                .textContent
                .toLowerCase();

        const artist =
            card
                .querySelector(
                    ".music-card-artist"
                )
                .textContent
                .toLowerCase();


        const visible =
            title.includes(search) ||
            artist.includes(search);


        card.style.display =
            visible ? "" : "none";
    }
);
```

}

/* =========================================================
35. UTILITAIRES
========================================================= */

function generateId() {

```
return (
    Date.now().toString(36) +
    Math.random()
        .toString(36)
        .substring(2, 10)
);
```

}

function setText(
elementId,
value
) {

```
const element =
    document.getElementById(
        elementId
    );

if (element) {

    element.textContent =
        value;
}
```

}

function formatTime(seconds) {

```
if (
    !Number.isFinite(seconds)
) {
    return "0:00";
}


const minutes =
    Math.floor(seconds / 60);

const remainingSeconds =
    Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");


return (
    `${minutes}:${remainingSeconds}`
);
```

}

function formatDate(dateString) {

```
try {

    return new Date(
        dateString
    ).toLocaleString(
        "fr-FR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );

} catch (error) {

    return "";
}
```

}

function sanitizeFileName(name) {

```
return name.replace(
    /[\\/:*?"<>|]/g,
    "_"
);
```

}

function escapeHTML(value) {

```
const div =
    document.createElement("div");

div.textContent =
    value === undefined ||
    value === null
    ? ""
    : String(value);

return div.innerHTML;
```

}

/* =========================================================
36. NOTIFICATIONS
========================================================= */

function showToast(
icon,
message
) {

```
const container =
    document.getElementById(
        "toastContainer"
    );

if (!container) {

    console.log(
        `${icon} ${message}`
    );

    return;
}


const toast =
    document.createElement("div");

toast.className =
    "toast info";


if (
    icon === "❌"
) {

    toast.className =
        "toast error";

} else if (
    icon === "✅"
) {

    toast.className =
        "toast success";
}


toast.innerHTML = `
    <span>${icon}</span>
    <p>${escapeHTML(message)}</p>
`;


container.appendChild(toast);


setTimeout(
    function () {

        toast.style.opacity =
            "0";

        toast.style.transform =
            "translateX(30px)";


        setTimeout(
            function () {

                toast.remove();

            },
            300
        );

    },
    3500
);
```

}

/* =========================================================
FIN DU FICHIER SCRIPT.JS
========================================================= */
