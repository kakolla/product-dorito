import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './PlatformerGame.css';

const PlatformerGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAME_OVER
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game constants
  const GRAVITY = 0.4;
  const JUMP_FORCE = -10;
  const MOVEMENT_SPEED = 5;
  const PLATFORM_WIDTH = 85;
  const PLATFORM_HEIGHT = 25; // Approximate based on image
  const PLAYER_WIDTH = 50;
  const PLAYER_HEIGHT = 50;
  const BULLET_SPEED = 3;
  const BULLET_WIDTH = 30;
  const BULLET_HEIGHT = 30;

  // Assets
  const assetsRef = useRef({
    player: new Image(),
    playerRun: new Image(),
    platform: new Image(),
    bullet: new Image(),
    background: new Image() // Optional, using CSS for now
  });

  // Game state refs for loop
  const gameRef = useRef({
    player: { x: 0, y: 0, vx: 0, vy: 0, facingRight: true },
    platforms: [],
    bullets: [],
    cameraY: 0,
    score: 0,
    animationFrameId: null
  });

  useEffect(() => {
    // Load assets
    assetsRef.current.player.src = '/platformer_game_assets/ahri.png';
    assetsRef.current.playerRun.src = '/platformer_game_assets/ahri_run.png';
    assetsRef.current.platform.src = '/platformer_game_assets/platform.png';
    assetsRef.current.bullet.src = '/platformer_game_assets/blast.png';

    // Initialize high score from local storage
    const savedHighScore = localStorage.getItem('platformerHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    return () => {
      cancelAnimationFrame(gameRef.current.animationFrameId);
    };
  }, []);

  const initGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    // Reset game state
    gameRef.current = {
      player: {
        x: width / 2 - PLAYER_WIDTH / 2,
        y: height - 350,
        vx: 0,
        vy: JUMP_FORCE,
        facingRight: true
      },
      platforms: [],
      bullets: [],
      cameraY: 0,
      score: 0,
      animationFrameId: null
    };

    // Generate initial platforms
    generateInitialPlatforms(width, height);

    setGameState('PLAYING');
    setScore(0);
    gameLoop();
  };

  const generateInitialPlatforms = (width, height) => {
    // Base platform
    gameRef.current.platforms.push({
      x: width / 2 - PLATFORM_WIDTH / 2,
      y: height - 250
    });

    // Random platforms upwards
    let currentY = height - 350;
    while (currentY > -1000) { // Generate a buffer above screen
      const x = Math.random() * (width - PLATFORM_WIDTH);
      gameRef.current.platforms.push({ x, y: currentY });
      currentY -= 100 + Math.random() * 50; // Random gap
    }
  };

  const gameLoop = () => {
    if (gameState === 'GAME_OVER') return;

    update();
    draw();
    gameRef.current.animationFrameId = requestAnimationFrame(gameLoop);
  };

  const update = () => {
    const { player, platforms, bullets } = gameRef.current;
    const canvas = canvasRef.current;

    // Apply Gravity
    player.vy += GRAVITY;
    player.y += player.vy;

    // Movement
    player.isMoving = false;
    if (keysRef.current.ArrowLeft || keysRef.current.a) {
      player.x -= MOVEMENT_SPEED;
      player.facingRight = false;
      player.isMoving = true;
    }
    if (keysRef.current.ArrowRight || keysRef.current.d) {
      player.x += MOVEMENT_SPEED;
      player.facingRight = true;
      player.isMoving = true;
    }

    // Screen wrapping
    if (player.x < -PLAYER_WIDTH / 2) player.x = canvas.width - PLAYER_WIDTH / 2;
    if (player.x > canvas.width - PLAYER_WIDTH / 2) player.x = -PLAYER_WIDTH / 2;

    // Platform collisions
    let isGrounded = false;
    if (player.vy > 0) {
      platforms.forEach(platform => {
        if (
          player.x + PLAYER_WIDTH * 0.6 > platform.x && // Feet width check
          player.x + PLAYER_WIDTH * 0.4 < platform.x + PLATFORM_WIDTH &&
          player.y + PLAYER_HEIGHT > platform.y &&
          player.y + PLAYER_HEIGHT < platform.y + PLATFORM_HEIGHT + player.vy
        ) {
          player.y = platform.y - PLAYER_HEIGHT;
          player.vy = 0;
          isGrounded = true;
        }
      });
    }

    // Manual Jump
    if ((keysRef.current.ArrowUp || keysRef.current.w || keysRef.current[' ']) && isGrounded) {
      player.vy = JUMP_FORCE;
      isGrounded = false;
    }

    // Camera scrolling
    // 1. Auto-scroll (constant upward movement of camera = downward movement of world)
    // 2. Player push (if player goes too high, move camera up faster)

    let scrollSpeed = 0.75 + (gameRef.current.score / 5000); // Increase speed with score

    if (player.y < canvas.height / 2) {
      const pushSpeed = (canvas.height / 2 - player.y) * 0.1; // Smooth push
      if (pushSpeed > scrollSpeed) {
        scrollSpeed = pushSpeed;
      }
    }

    // Apply scroll to everything
    player.y += scrollSpeed;
    platforms.forEach(p => p.y += scrollSpeed);
    bullets.forEach(b => b.y += scrollSpeed);

    // Score increases based on survival/height (auto-scroll contributes to height)
    // Actually, score usually based on height climbed. 
    // If we just auto-scroll, the "height" increases.
    gameRef.current.score += Math.floor(scrollSpeed);
    setScore(gameRef.current.score);

    // Generate new platforms
    const lastPlatform = platforms[platforms.length - 1];
    if (lastPlatform.y > 100) { // If top platform moved down enough
      const x = Math.random() * (canvas.width - PLATFORM_WIDTH);
      platforms.push({ x, y: lastPlatform.y - (100 + Math.random() * 50) });
    }

    // Remove old platforms
    if (platforms[0].y > canvas.height) {
      platforms.shift();
    }

    // Bullet Spawning
    if (Math.random() < 0.005 + (gameRef.current.score / 100000)) { // Increase difficulty
      const fromLeft = Math.random() > 0.5;
      bullets.push({
        x: fromLeft ? -BULLET_WIDTH : canvas.width,
        y: Math.random() * (canvas.height / 2), // Spawn in top half
        vx: fromLeft ? BULLET_SPEED : -BULLET_SPEED
      });
    }

    // Bullet Update & Collision
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      b.x += b.vx;

      // Collision with player
      if (
        player.x < b.x + BULLET_WIDTH &&
        player.x + PLAYER_WIDTH > b.x &&
        player.y < b.y + BULLET_HEIGHT &&
        player.y + PLAYER_HEIGHT > b.y
      ) {
        gameOver();
      }

      // Remove off-screen bullets
      if (b.x < -100 || b.x > canvas.width + 100 || b.y > canvas.height) {
        bullets.splice(i, 1);
      }
    }

    // Game Over Condition (Fall)
    if (player.y > canvas.height) {
      gameOver();
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { player, platforms, bullets } = gameRef.current;
    const { player: playerImg, platform: platformImg, bullet: bulletImg } = assetsRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Platforms
    platforms.forEach(p => {
      ctx.drawImage(platformImg, p.x, p.y, PLATFORM_WIDTH, PLATFORM_HEIGHT);
    });

    // Draw Bullets
    bullets.forEach(b => {
      ctx.save();
      if (b.vx < 0) { // Flip if coming from right
        ctx.translate(b.x + BULLET_WIDTH, b.y);
        ctx.scale(-1, 1);
        ctx.drawImage(bulletImg, 0, 0, BULLET_WIDTH, BULLET_HEIGHT);
      } else {
        ctx.drawImage(bulletImg, b.x, b.y, BULLET_WIDTH, BULLET_HEIGHT);
      }
      ctx.restore();
    });

    // Draw Player
    const playerSprite = player.isMoving ? assetsRef.current.playerRun : assetsRef.current.player;

    ctx.save();
    if (!player.facingRight) {
      ctx.translate(player.x + PLAYER_WIDTH, player.y);
      ctx.scale(-1, 1);
      ctx.drawImage(playerSprite, 0, 0, PLAYER_WIDTH, PLAYER_HEIGHT);
    } else {
      ctx.drawImage(playerSprite, player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    }
    ctx.restore();
  };

  const gameOver = () => {
    setGameState('GAME_OVER');
    cancelAnimationFrame(gameRef.current.animationFrameId);
    if (gameRef.current.score > highScore) {
      setHighScore(gameRef.current.score);
      localStorage.setItem('platformerHighScore', gameRef.current.score);
    }
  };

  // Input handling
  const keysRef = useRef({});
  useEffect(() => {
    const handleKeyDown = (e) => { keysRef.current[e.key] = true; };
    const handleKeyUp = (e) => { keysRef.current[e.key] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);


  return (
    <div className="platformer-container">
      <div className="game-header">
        <Link to="/mini-games" className="back-button">← Back</Link>
        <div className="score-board">
          <span>Score: {score}</span>
          <span>High Score: {highScore}</span>
        </div>
      </div>

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={400}
          height={600}
          className="game-canvas"
        />

        {gameState === 'START' && (
          <div className="overlay start-screen">
            <h1>Climbing Summoner's Rift</h1>
            <p>Use Left/Right to move, Up to jump</p>
            <button onClick={initGame}>Start</button>
          </div>
        )}

        {gameState === 'GAME_OVER' && (
          <div className="overlay game-over-screen">
            <h2>Game Over</h2>
            <p>Score: {score}</p>
            <button onClick={initGame}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformerGame;
