const start = () => {
  $("#start").hide();
  $("#backgroundGame").append(
    "<div class='player animationPlayer' id='player'></div>"
  );
  $("#backgroundGame").append(
    "<div class='enemyOne animationEnemyOne' id='enemyOne'></div>"
  );
  $("#backgroundGame").append("<div class='enemyTwo' id='enemyTwo'></div>");
  $("#backgroundGame").append(
    "<div class='ally animationAlly' id='ally'></div>"
  );
  $("#backgroundGame").append("<div class='score' id='score'></div>");
  $("#backgroundGame").append("<div class='energy' id='energy'></div>");

  var soundShooting = document.getElementById("soundShooting");
  var soundExplosion = document.getElementById("soundExplosion");
  var song = document.getElementById("song");
  var gameOverSound = document.getElementById("gameOverSound");
  var soundLost = document.getElementById("soundLost");
  var soundRescue = document.getElementById("soundRescue");

  song.addEventListener(
    "ended",
    () => {
      song.currentTime = 0;
      song.play();
    },
    false
  );
  song.play();

  var game = {};
  var keyboard = { W: 87, S: 83, D: 68 };
  var speed = 5;
  var canShoot = true;
  var timeShoot = null;
  var endGame = false;
  var points = 0;
  var savedAllies = 0;
  var lostAllies = 0;
  var currentEnergy = 3;

  game.press = [];

  $(document).keydown((e) => {
    game.press[e.which] = true;
  });

  $(document).keyup((e) => {
    game.press[e.which] = false;
  });

  const loop = () => {
    moveBackground();
    movePlayer();
    moveEnemyOne();
    moveEnemyTwo();
    moveAlly();
    collisions();
    score();
    energy();
  };

  const moveBackground = () => {
    var left = parseInt($("#backgroundGame").css("background-position"));
    $("#backgroundGame").css("background-position", left - 1);
  };

  const movePlayer = () => {
    if (game.press[keyboard.W]) {
      var top = parseInt($("#player").css("top"));
      $("#player").css("top", top - 10);

      if (top <= 0) {
        $("#player").css("top", top + 10);
      }
    }

    if (game.press[keyboard.S]) {
      var top = parseInt($("#player").css("top"));
      $("#player").css("top", top + 10);

      if (top >= 434) {
        $("#player").css("top", top - 10);
      }
    }

    if (game.press[keyboard.D]) {
      shoot();
    }
  };

  const moveEnemyOne = () => {
    var positionX = parseInt($("#enemyOne").css("left"));
    $("#enemyOne").css("left", positionX - speed);
    $("#enemyOne").css("top", positionY);

    if (positionX <= 0) {
      var positionY = parseInt(Math.random() * 334);
      $("#enemyOne").css("left", 694);
      $("#enemyOne").css("top", parseInt(positionY));
    }
  };

  const moveEnemyTwo = () => {
    var positionX = parseInt($("#enemyTwo").css("left"));
    $("#enemyTwo").css("left", positionX - 3);

    if (positionX <= 0) {
      $("#enemyTwo").css("left", 775);
    }
  };

  const moveAlly = () => {
    var positionX = parseInt($("#ally").css("left"));
    $("#ally").css("left", positionX + 1);

    if (positionX > 906) {
      $("#ally").css("left", 0);
    }
  };

  const makeShoot = () => {
    soundShooting.play();
    positionX = parseInt($("#shoot").css("left"));
    $("#shoot").css("left", positionX + 15);

    if (positionX > 900) {
      window.clearInterval(timeShoot);
      timeShoot = null;
      $("#shoot").remove();
      canShoot = true;
    }
  };

  const shoot = () => {
    if (canShoot == true) {
      canShoot = false;

      var top = parseInt($("#player").css("top"));
      var positionX = parseInt($("#player").css("left"));
      var shootX = positionX + 190;
      var topShot = top + 45;
      $("#backgroundGame").append("<div id='shoot' class='shoot'></div>");
      $("#shoot").css("top", topShot);
      $("#shoot").css("left", shootX);

      timeShoot = window.setInterval(makeShoot, 30);
    }
  };

  const collisions = () => {
    var collisionPlayerEnemyOne = $("#player").collision($("#enemyOne"));
    var collisionPlayerEnemyTwo = $("#player").collision($("#enemyTwo"));
    var collisionShotEnemyOne = $("#shoot").collision($("#enemyOne"));
    var collisionShotEnemyTwo = $("#shoot").collision($("#enemyTwo"));
    var collisionPlayerAlly = $("#player").collision($("#ally"));
    var collisionAllyEnemyTwo = $("#ally").collision($("#enemyTwo"));

    if (collisionPlayerEnemyOne.length > 0) {
      currentEnergy--;
      var enemyOneX = parseInt($("#enemyOne").css("left"));
      var enemyOneY = parseInt($("#enemyOne").css("top"));

      explosionPlayerEnemyOne(enemyOneX, enemyOneY);

      var positionY = parseInt(Math.random() * 334);
      $("#enemyOne").css("left", 694);
      $("#enemyOne").css("top", parseInt(positionY));
    }

    if (collisionPlayerEnemyTwo.length > 0) {
      currentEnergy--;
      var enemyTwoX = parseInt($("#enemyTwo").css("left"));
      var enemyTwoY = parseInt($("#enemyTwo").css("top"));

      explosionPlayerEnemyTwo(enemyTwoX, enemyTwoY);

      $("#enemyTwo").remove();

      replacementEnemyTwo();
    }

    if (collisionShotEnemyOne.length > 0) {
      speed += 0.3;
      points += 100;
      var enemyOneX = parseInt($("#enemyOne").css("left"));
      var enemyOneY = parseInt($("#enemyOne").css("top"));

      explosionPlayerEnemyOne(enemyOneX, enemyOneY);
      $("#shoot").css("left", 950);

      var positionY = parseInt(Math.random() * 334);
      $("#enemyOne").css("left", 694);
      $("#enemyOne").css("top", parseInt(positionY));
    }

    if (collisionShotEnemyTwo.length > 0) {
      points += 50;
      var enemyTwoX = parseInt($("#enemyTwo").css("left"));
      var enemyTwoY = parseInt($("#enemyTwo").css("top"));

      explosionPlayerEnemyTwo(enemyTwoX, enemyTwoY);
      $("#shoot").css("left", 950);

      $("#enemyTwo").remove();

      replacementEnemyTwo();
    }

    if (collisionPlayerAlly.length > 0) {
      soundRescue.play();
      savedAllies++;
      replacementAlly();
      $("#ally").remove();
    }

    if (collisionAllyEnemyTwo.length > 0) {
      lostAllies++;
      var allyX = parseInt($("#ally").css("left"));
      var allyY = parseInt($("#ally").css("top"));

      explosionAllyEnemyTwo(allyX, allyY);
      $("#ally").remove();

      replacementAlly();
    }
  };

  const replacementEnemyTwo = () => {
    const replacement = () => {
      window.clearInterval(timeCollisionPlayerEnemyTwo);
      timeCollisionPlayerEnemyTwo = null;

      if (endGame == false) {
        $("#backgroundGame").append(
          "<div class='enemyTwo' id='enemyTwo'></div>"
        );
      }
    };

    var timeCollisionPlayerEnemyTwo = window.setInterval(replacement, 5000);
  };

  const replacementAlly = () => {
    const replacement = () => {
      clearInterval(timeAlly);
      timeAlly = null;

      if (endGame === false) {
        $("#backgroundGame").append(
          "<div class='ally animationAlly' id='ally'></div>"
        );
      }
    };

    var timeAlly = setInterval(replacement, 6000);
  };

  const explosionPlayerEnemyOne = (enemyOneX, enemyOneY) => {
    soundExplosion.play();
    var timeExplosion;
    const removeExplosion = () => {
      div.remove();
      window.clearInterval(timeExplosion);
      timeExplosion = null;
    };

    $("#backgroundGame").append(
      "<div id='explosionPlayerEnemyOne' class='explosionPlayerEnemyOne'></div>"
    );
    $("#explosionPlayerEnemyOne").css(
      "background-image",
      "url('./assets/imgs/explosao.png')"
    );
    var div = $("#explosionPlayerEnemyOne");
    div.css("left", enemyOneX);
    div.css("top", enemyOneY);
    div.animate({ width: 200, opacity: 0 }, "slow");

    timeExplosion = window.setInterval(removeExplosion, 1000);
  };

  const explosionPlayerEnemyTwo = (enemyTwoX, enemyTwoY) => {
    soundExplosion.play();
    var timeExplosionTwo;
    const removeExplosion = () => {
      div.remove();
      window.clearInterval(timeExplosionTwo);
      timeExplosionTwo = null;
    };

    $("#backgroundGame").append(
      "<div id='explosionPlayerEnemyTwo' class='explosionPlayerEnemyTwo'></div>"
    );
    $("#explosionPlayerEnemyTwo").css(
      "background-image",
      "url('./assets/imgs/explosao.png')"
    );
    var div = $("#explosionPlayerEnemyTwo");
    div.css("left", enemyTwoX);
    div.css("top", enemyTwoY);
    div.animate({ width: 200, opacity: 0 }, "slow");

    timeExplosionTwo = window.setInterval(removeExplosion, 1000);
  };

  const explosionAllyEnemyTwo = (allyX, allyY) => {
    soundLost.play();
    var timeExplosionAllyEnemyTwo;
    const removeExplosion = () => {
      $("#explosionAllyEnemyTwo").remove();
      window.clearInterval(timeExplosionAllyEnemyTwo);
      timeExplosionAllyEnemyTwo = null;
    };

    $("#backgroundGame").append(
      "<div id='explosionAllyEnemyTwo' class='explosionAllyEnemyTwo animationAllyDead'></div>"
    );

    $("#explosionAllyEnemyTwo").css("left", allyX);
    $("#explosionAllyEnemyTwo").css("top", allyY);

    timeExplosionAllyEnemyTwo = window.setInterval(removeExplosion, 1000);
  };

  const score = () => {
    $("#score").html(
      "<h2> Pontos: " +
        points +
        "  Salvos: " +
        savedAllies +
        "  Perdidos: " +
        lostAllies +
        "</h2>"
    );
  };

  const energy = () => {
    switch (currentEnergy) {
      case 3:
        $("#energy").css("background-image", "url(./assets/imgs/energia3.png");
        break;
      case 2:
        $("#energy").css("background-image", "url(./assets/imgs/energia2.png");
        break;
      case 1:
        $("#energy").css("background-image", "url(./assets/imgs/energia1.png");
        break;
      case 0:
        $("#energy").css("background-image", "url(./assets/imgs/energia0.png");
        gameOver();
        break;
      default:
        break;
    }
  };

  const gameOver = () => {
    endGame = true;
    song.pause();
    gameOverSound.play();

    window.clearInterval(game.timer);
    game.timer = null;

    $("#player").remove();
    $("#enemyOne").remove();
    $("#enemyTwo").remove();
    $("#ally").remove();

    $("#backgroundGame").append("<div id='end' class='end'></div>");

    $("#end").html(
      "<h1>Game Over</h1><p>Sua pontuação foi:  " +
        points +
        "</p>" +
        "<div id='restart' onClick='restartGame()'><h3 id='buttonRestart'>Jogar Novamente</h3></div>"
    );
    $("#buttonRestart").css("cursor", "pointer");
  };

  game.timer = setInterval(loop, 30);
};

const restartGame = () => {
  gameOverSound.pause();
  $("#end").remove();
  start();
};
