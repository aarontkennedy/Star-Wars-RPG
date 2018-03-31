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
    };

    Character.prototype.moveToInitialStaging = function () {
        this.kElement.appendTo($(".yourCharacter"));
    };

    Character.prototype.moveToEnemies = function () {
        this.kElement.appendTo($(".enemies"));
    };

    Character.prototype.moveToDefender = function () {
        this.kElement.appendTo($(".defender"));
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
            if (this.id != chosenCharacter.kID) {
                allAreDead = this.isDead() && allAreDead;
            }
        }
        return allAreDead;
    }

    console.log("State 1: Wait for a character to be chosen");
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
        goToState2();
    });

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
        $('img.weapon').on('click', function () {
            defendingCharacter.damaged(chosenCharacter.attack());
            chosenCharacter.damaged(defendingCharacter.counterAttack());
            if (defendingCharacter.isDead()) {
                defendingCharacter.dies();
                chosenCharacter.hideWeapon();
                goToState2();
            }
            else if (chosenCharacter.isDead()) {
                goToState4(false);
            }
            else if (areAllEnemiesDead()) {
                goToState4(true);
            }

        });
    }

    console.log("State 4: End Game");
    function goToState4(playerWon) {
        if (playerWon) {
            alert("You Win!");
        }
        alert("Game Over!");
    }





});