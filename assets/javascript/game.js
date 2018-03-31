$(document).ready(function () {

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

    Character.prototype.reset = function () {
        this.currentAttackPower = this.kAttackPower;
        this.currentHealth = this.kHealthPoints;
        this.moveToInitialStaging();
        this.kElement.show();
        this.hideWeapon();
        this.damaged(0); // prints the current health
    };

    Character.prototype.displayWeapon = function () {
        this.kElement.after("<img class='weapon' src='assets/images/" + this.kWeapon + ".png'>");
    }

    Character.prototype.hideWeapon = function () {
        $("img.weapon").hide();
    }

    Character.prototype.attack = function () {
        var oldAttackPower = this.currentAttackPower;
        this.currentAttackPower += this.kAttackPower; // getting stronger!
        return oldAttackPower;
    };

    Character.prototype.counterAttack = function () {
        return this.kAttackPower;
    };

    Character.prototype.damaged = function (damage) {
        this.currentHealth -= damage;
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

    var characters = [
        new Character("luke", "Luke Skywalker", 100, 6, "saber"),
        new Character("han", "Han Solo", 100, 6, "blaster"),
        new Character("obiwan", "Obi-Wan Kenobi", 100, 6, "saber"),
        new Character("vader", "Darth Vader", 100, 6, "saber")
    ];
    var chosenCharacter = null;
    var defendingCharacter = null;

    function areAllEnemiesDead() {
        var allAreDead = true;
        for (var i = 0; i < characters.length; i++) {
            if (characters[i].kID != chosenCharacter.kID) {
                allAreDead = characters[i].isDead() && allAreDead;
            }
        }
        return allAreDead;
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


    console.log("State 1: Wait for a character to be chosen");
    function goToState1() {
        battleDisplayText.print("Choose a player to start.");
        $('.card').on('click', function () {
            $('.card').off();
            console.log(this.id + " was chosen.");
            for (var i = 0; i < characters.length; i++) {
                if (this.id == characters[i].kID) {
                    chosenCharacter = characters[i];
                }
                else {
                    characters[i].moveToEnemies();
                }
            }
            battleDisplayText.print("Choose an enemy to battle.");
            goToState2();
        });
    }
    goToState1();

    console.log("State 2: Wait for a character to chosen to fight");
    function goToState2() {
        $('.card').on('click', function () {
            console.log(this.id + " was chosen to fight.");
            for (var i = 0; i < characters.length; i++) {

                if (this.id == chosenCharacter.kID) {
                    // do nothing since they clicked their own 
                    // character again
                }
                else if (this.id == characters[i].kID) {
                    $('.card').off();
                    defendingCharacter = characters[i];
                    defendingCharacter.moveToDefender();
                    chosenCharacter.displayWeapon();
                    goToState3();
                }
                else {
                    // leave the other characters there
                    $('.card').off();
                }
            }

        });
    }

    console.log("State 3: Time to battle");
    function goToState3() {
        battleDisplayText.print("Attack!");
        $('img.weapon').on('click', function () {
            var youInflicted = defendingCharacter.damaged(chosenCharacter.attack());
            var youTookDamage = chosenCharacter.damaged(defendingCharacter.counterAttack());

            var battleResultsString = "<p>You attacked " + defendingCharacter.kName + " for " + youInflicted + " points damage.</p>";

            battleResultsString += "<p>" + defendingCharacter.kName + " counterattacked for " + youTookDamage + " points damage.</p>";

            battleDisplayText.print(battleResultsString);

            if (chosenCharacter.isDead()) {
                goToState4(false);
            }
            else if (areAllEnemiesDead()) {
                goToState4(true);
            }
            else if (defendingCharacter.isDead()) {
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
            alert("You Win!");
        }
        else {
            alert("Game Over!");
        }
        // do some sort of reset
        for (var i = 0; i < characters.length; i++) {
            characters[i].reset();
        }
        goToState1();
    }

});