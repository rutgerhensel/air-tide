// Game states
const STATE_MENU = 0;
const STATE_PLAYING = 1;
const STATE_GAMEOVER = 2;

let gameState = STATE_MENU;

// Player
let player;

// World
let scrollOffset = 0;
let scrollSpeed = 3;
let baseScrollSpeed = 3;
let clouds = [];
let birds = [];
let particles = [];
let frameScore = 0;
let score = 0;
let highScore = 0;
// (wipeout is handled by obstacle collision in obstacles.js)

// Input
let keys = {};

// Wave helpers
let waveTime = 0;
