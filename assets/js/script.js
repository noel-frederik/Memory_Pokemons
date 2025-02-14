document.addEventListener("DOMContentLoaded", () => {
  const btStart = document.getElementById("btStart");
  const gameBoard = document.getElementById("boardGame");
  let pokemonList = [];
  let flippedCards = [];
  let matchedPairs = 0;

  btStart.addEventListener("click", () => startGame());

  // Fonction pour récupérer 4 Pokémon aléatoires et doubler la liste pour le Memory
  async function fetchPokemon() {
    let response, data;
    let pokemons = [];

    for (let i = 0; i < 8; i++) {
      let id = Math.floor(Math.random() * 151) + 1; // Pokémon 1 à 151 (génération 1)
      response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      data = await response.json();
      pokemons.push({ name: data.name, img: data.sprites.front_default });
    }

    return [...pokemons, ...pokemons]; // Doubler la liste pour le Memory
  }

  // Mélanger un tableau (algorithme de Fisher-Yates)
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Fonction pour démarrer une nouvelle partie
  async function startGame() {
    gameBoard.innerHTML = "";
    flippedCards = [];
    matchedPairs = 0;

    // Récupérer et mélanger les Pokémon
    pokemonList = await fetchPokemon();
    shuffle(pokemonList);

    // Générer les cartes
    pokemonList.forEach((pokemon, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.name = pokemon.name;

      const img = document.createElement("img");
      img.src = pokemon.img;

      card.appendChild(img);
      card.addEventListener("click", () => flipCard(card));
      gameBoard.appendChild(card);
    });
  }

  // Fonction pour retourner une carte
  function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
      card.classList.add("flipped");
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        setTimeout(checkMatch, 800);
      }
    }
  }

  // Vérifier si les cartes forment une paire
  function checkMatch() {
    let [card1, card2] = flippedCards;

    if (card1.dataset.name === card2.dataset.name) {
      matchedPairs++;
      flippedCards = [];

      if (matchedPairs === pokemonList.length / 2) {
        alert("Bravo ! Tu as gagné !");
      }
    } else {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }
  }
});
