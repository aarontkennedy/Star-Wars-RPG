$(document).ready(function () {

    // start the music theme
    $('audio#starWarsTheme')[0].play();
    $('audio#starWarsTheme')[0].volume = 0.3;
    $('audio#starWarsTheme').hide();
    // sound button toggles visibility of the audio control
    $("#soundCtrlButton").click(function () {
        $('audio#starWarsTheme').toggle();
    });



    // End Game Dialog Modal Window Pop-up thing Class
    function MyModal() {
        this.id = "gameEndDialog";
        this.htmlElement = $("#" + this.id);
        this.htmlElement.hide();
        this.messageLocationId = $("#gameMessage");
    }

    MyModal.prototype.hide = function (isGoodMessage, message) {
        this.htmlElement.hide();
    }

    MyModal.prototype.show = function (isGoodMessage, message) {
        // this part controls the background of the modal
        // if you win, you get Yoda
        if (isGoodMessage) {
            this.htmlElement.css("background-image",
                "url(./assets/images/yodaBackground.png)");
        }
        else { // if you lose, you get the Emperor
            this.htmlElement.css("background-image",
                "url(./assets/images/palpatineBackdrop.jpg)");
        }
        this.messageLocationId.text(message); // display the message

        // This creates an event that listens for the clicking of
        // the dialog window.  Clicking the window closes it and 
        // resets the game.
        this.htmlElement.on('click', function () {
            resetGame();
            gameEndDialogModal.hide();
        });

        this.htmlElement.show();
    }

    var gameEndDialogModal = new MyModal();



    // base class for all the chacters
    function Character(id, name, health, attackPower, weapon) {
        this.kID = id; // should never change
        this.kElement = $("#" + this.kID);
        this.kWeapon = weapon;
        this.kName = name; // should never change
        this.kHealthPoints = health; // should never change
        this.kAttackPower = attackPower; // should never change

        this.reset();
    }

    // pass in a boolean to say if you want it to display with a click cursor
    Character.prototype.makeClickable = function (b) {
        if (b) {
            this.kElement.addClass("clickable");
        }
        else {
            this.kElement.removeClass("clickable");
        }
    };

    Character.prototype.reset = function () {
        this.currentAttackPower = this.kAttackPower;
        this.currentHealth = this.kHealthPoints;
        this.moveToInitialStaging();
        this.kElement.show();
        this.makeClickable(true);
        this.hideWeapon();
        this.damaged(0); // prints the current health
    };

    // the weapon is the button clicked to attack the enemy, show it
    Character.prototype.displayWeapon = function () {
        this.kElement.after("<img class='weapon' src='assets/images/" + this.kWeapon + ".png'>");
    }

    // we must not be battling, hide the weapon
    Character.prototype.hideWeapon = function () {
        $("img.weapon").hide();
    }

    // return the value of your attacking power
    // increment the attack power
    Character.prototype.attack = function () {
        var oldAttackPower = this.currentAttackPower;
        this.currentAttackPower += this.kAttackPower; // getting stronger!
        return oldAttackPower;
    };

    // return the counterattack value
    Character.prototype.counterAttack = function () {
        return this.kAttackPower;
    };

    Character.prototype.damaged = function (damage) {
        this.currentHealth -= damage;
        // ensure their health doesn't go negative
        if (this.currentHealth < 0) {
            this.currentHealth = 0;
        }
        // update the character's health
        $("#" + this.kID + " h4 span").text(this.currentHealth);
        return damage;
    };

    Character.prototype.moveToInitialStaging = function () {
        this.kElement.appendTo($(".yourCharacter"));
    };

    Character.prototype.moveToEnemies = function () {
        this.kElement.appendTo($(".enemies"));
    };

    Character.prototype.moveToDefender = function () {
        this.kElement.insertBefore($("#battleText"));
    };

    Character.prototype.dies = function () {
        this.kElement.hide();
    };

    Character.prototype.isDead = function () {
        if (this.currentHealth > 0) {
            return false;
        }
        return true;
    };



    // this is an array of the characters to be used by the game
    var characters = [
        new Character("obiwan", "Obi-Wan Kenobi", 104, 10, "saber"),
        new Character("luke", "Luke Skywalker", 100, 8, "saber"),
        new Character("han", "Han Solo", 120, 9, "blaster"),
        new Character("vader", "Darth Vader", 125, 17, "saber")
    ];
    var chosenCharacter = null;  // quick access to the character chosen
    var defendingCharacter = null; // quick access to the current enemy

    // checks if all the enemies are dead and the game is done
    function areAllEnemiesDead() {
        var allAreDead = true;
        for (var i = 0; i < characters.length; i++) {
            // don't check our character
            if (characters[i].kID != chosenCharacter.kID) {
                allAreDead = characters[i].isDead() && allAreDead;
            }
        }
        return allAreDead;
    }

    // make all enemies clickable
    function makeAllEnemiesClickable () {
        for (var i = 0; i < characters.length; i++) {
            if (characters[i].kID != chosenCharacter.kID) {
                characters[i].makeClickable(true);
            }
        }
    }

    // do some sort of reset, reset characters and go back to beginning of game
    function resetGame() {
        for (var i = 0; i < characters.length; i++) {
            characters[i].reset();
        }
        goToState1();
    }



    // object for displaying battle information
    function BattleDisplay() {
        this.element = $("#battleText");
        this.element.text("");
    }

    BattleDisplay.prototype.print = function (text) {
        $(".defender").append(this.element);
        this.element.html(text);
        this.element.show();
    };

    BattleDisplay.prototype.hide = function () {
        this.element.hide();
    };

    var battleDisplayText = new BattleDisplay();



    // this is the actual code to run the game
    // there are 4 states that control the steps of the game
    console.log("State 1: Wait for a character to be chosen");
    function goToState1() {
        battleDisplayText.print("Choose a player to start.");
        // set up an event to listen for a character to be chosen
        $('.card').on('click', function () {
            $('.card').off(); // turn off the event so they can't choose more than 1
            //console.log(this.id + " was chosen.");
            for (var i = 0; i < characters.length; i++) {
                if (this.id == characters[i].kID) {
                    chosenCharacter = characters[i];
                    chosenCharacter.makeClickable(false);
                }
                else {
                    characters[i].moveToEnemies();
                }
            }
            battleDisplayText.print("Choose an enemy to battle.");
            goToState2();
        });
    }
    goToState1(); // we first start at State 1

    console.log("State 2: Wait for a character to be chosen to fight");
    function goToState2() {
        makeAllEnemiesClickable();
        // set up an even to listen to the characters and specifically 
        // for one of the enemies to be chosen
        $('.card').on('click', function () {
            console.log(this.id + " was chosen to fight.");
            for (var i = 0; i < characters.length; i++) {
                // make all characters unclickable
                characters[i].makeClickable(false);

                if (this.id == chosenCharacter.kID) {
                    // do nothing since they clicked their own 
                    // character again
                }
                else if (this.id == characters[i].kID) {
                    $('.card').off();  // they chose an enemy, stop listening
                    defendingCharacter = characters[i];
                    // prepare for battle
                    defendingCharacter.moveToDefender();
                    chosenCharacter.displayWeapon();
                    goToState3();
                }
                else {
                    // these characters weren't clicked
                    // leave the other characters there
                    $('.card').off(); // don't listen for more
                }
            }
        });
    }

    console.log("State 3: Time to battle");
    function goToState3() {
        battleDisplayText.print("Attack!");

        // listen for your character's weapon being clicked
        $('img.weapon').on('click', function () {
            // actual battle
            var youInflicted = defendingCharacter.damaged(chosenCharacter.attack());
            var youTookDamage = chosenCharacter.damaged(defendingCharacter.counterAttack());
            // create string of battle results
            var battleResultsString = "<p>You attacked " + defendingCharacter.kName + " for " + youInflicted + " points damage.</p>";

            battleResultsString += "<p>" + defendingCharacter.kName + " counterattacked for " + youTookDamage + " points damage.</p>";

            battleDisplayText.print(battleResultsString);

            // did you die?
            if (chosenCharacter.isDead()) {
                goToState4(false);
            }
            else if (areAllEnemiesDead()) { // did you defeat all enemies?
                goToState4(true);
            }
            else if (defendingCharacter.isDead()) { // did you defeat this enemy?
                battleDisplayText.print("<p>You defeated " + defendingCharacter.kName + "!</p><p>Choose an enemy to battle.</p>");
                defendingCharacter.dies();
                chosenCharacter.hideWeapon();
                goToState2();
            }
        });
    }

    console.log("State 4: End Game");
    function goToState4(playerWon) {
        if (playerWon) {
            gameEndDialogModal.show(true, "Congratulations! You have brought balance to the force.  May the Force be with you!");
        }
        else {
            gameEndDialogModal.show(false, "Ha, ha, ha!  You have been defeated.  Now you know the real power of the dark side.");
        }
    }

});