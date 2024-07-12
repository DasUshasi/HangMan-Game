let word;
let len;
let wordMap = new Map()
let wrongGuesses = 0
let guessed = []
let wrongGuessedLets = []
let food = []
let animal = []
let country = []

async function loadFile(fileName, array) {
    let response = await fetch(fileName)
    let text = await response.text()
    let strings = text.split('\r\n');
    for (let i = 0; i < strings.length; i++)
        array.push(strings[i].toLowerCase());
}

function start() {
    document.getElementById("hint").textContent = ""
    setTimeout(() => {
        let game = document.getElementById("game");
        let choice = Math.floor(Math.random() * 3)
        if (choice === 0) {
            let idx = Math.floor(Math.random() * food.length)
            word = food[idx]
            food.splice(idx, 1);
            document.getElementById("hint").textContent = "Hint: Food name"
        }
        else if (choice === 1) {
            let idx = Math.floor(Math.random() * animal.length)
            word = animal[idx]
            animal.splice(idx, 1);
            document.getElementById("hint").textContent = "Hint: Animal name"
        }
        else if (choice === 2) {
            let idx = Math.floor(Math.random() * country.length)
            word = country[idx]
            country.splice(idx, 1);
            document.getElementById("hint").textContent = "Hint: Country name"
        }
        len = word.length
        game.style.gridTemplateColumns = `repeat(${len},auto)`;
        createBoxes(game);
        createMap();
        keyFunctions();
    }, 3000)
}

function createBoxes(container) {
    for (let i = 0; i < len; i++) {
        let box = document.createElement("div");
        box.id = `box${i}`
        box.className = "box"
        container.appendChild(box);
    }
    return container;
}

function createMap() {
    for (let i = 0; i < len; i++) {
        let c = word.charAt(i);
        if (!wordMap.has(c))
            wordMap.set(c, []);
        wordMap.get(c).push(i);
    }
}

function playAgain() {
    for (let i = 0; i < len; i++) {
        let box = document.getElementById(`box${i}`)
        box.remove()
    }
    wordMap = new Map()
    wrongGuesses = 0
    guessed = []
    wrongGuessedLets = []
    document.getElementById("image").src = "hangman0.png"
    document.getElementById("guessed").textContent = "Wrong guesses: "
    document.getElementById("wrongGuesses").textContent = "Number of Wrong Guesses: 0 / 6"
    let obj = document.getElementById("popUp")
    while (obj.hasChildNodes())
        obj.removeChild(obj.firstChild)
    obj.style.display = "none"
    start()
}

function keyFunctions() {
    document.body.onkeydown = (e) => {
        let key = e.key;
        if (key.length === 1 && key.match(/[a-z]/i)) {
            if (guessed.includes(key)) {
                document.getElementById("notes").textContent = "Letter already guessed!"
                setTimeout(() => {
                    document.getElementById("notes").textContent = ""
                }, 2000)
            }
            else {
                guessed.push(key);
                if (wordMap.has(key)) {
                    let idxs = wordMap.get(key);
                    for (let i = 0; i < idxs.length; i++) {
                        let idx = idxs[i];
                        document.getElementById(`box${idx}`).textContent = key;
                    }
                    wordMap.delete(key);
                }
                else {
                    wrongGuesses++;
                    wrongGuessedLets.push(key)
                    if (wrongGuessedLets.length > 0) {
                        document.getElementById("guessed").textContent = `Wrong guesses: ${wrongGuessedLets}`
                    }
                    document.getElementById("wrongGuesses").textContent = `Number of Wrong Guesses: ${wrongGuesses} / 6`
                    document.getElementById("image").src = `hangman${wrongGuesses}.png`
                    if (wrongGuesses === 6) {
                        let obj = document.getElementById("popUp")
                        let text = document.createElement("div")
                        text.textContent = "You Loose!"
                        text.className = "text"
                        obj.appendChild(text)
                        let text2 = document.createElement("div")
                        text2.textContent = `Word: ${word}`
                        text2.className = "text"
                        text2.classList.add("textFont")
                        obj.appendChild(text2)
                        let loose = document.createElement("img")
                        loose.src = "looseGif.gif"
                        loose.className = "gif"
                        let looseCont = document.createElement("div")
                        looseCont.className = "imgCnt"
                        looseCont.appendChild(loose)
                        obj.appendChild(looseCont);
                        let btn = document.createElement("button")
                        btn.textContent = "Play again"
                        btn.addEventListener("click", playAgain);
                        btn.className = "btn"
                        let btncont = document.createElement("div")
                        btncont.className = "imgCnt"
                        btncont.appendChild(btn)
                        obj.appendChild(btncont)
                        setTimeout(() => obj.style.display = "block", 1500);
                    }
                }
                if (wordMap.size === 0) {
                    let obj = document.getElementById("popUp")
                    let text = document.createElement("div")
                    text.textContent = "You win!"
                    text.className = "text"
                    obj.appendChild(text)
                    let win = document.createElement("img")
                    win.src = "winGif.gif"
                    win.className = "gif"
                    let winCont = document.createElement("div")
                    winCont.className = "imgCnt"
                    winCont.appendChild(win)
                    obj.appendChild(winCont);
                    let btn = document.createElement("button")
                    btn.textContent = "Play again"
                    btn.addEventListener("click", playAgain);
                    btn.className = "btn"
                    let btncont = document.createElement("div")
                    btncont.className = "imgCnt"
                    btncont.appendChild(btn)
                    obj.appendChild(btncont)
                    setTimeout(() => obj.style.display = "block", 1500);
                }
            }
        }
    }
}

loadFile("food.txt", food)
loadFile("animal.txt", animal)
loadFile("country.txt", country)
start();