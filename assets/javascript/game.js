$(document).ready(function () {

    // base class for all the chacters
    function Character(id, name, health, attackPower) {
        this.kID = id; // should never change
        this.kElement = $("#"+this.kID);
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
        $("#"+this.kID+" h4 span").text(this.currentHealth);
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

    var luke = new Character("luke", "Luke Skywalker", 100, 6);
    var han = new Character("han", "Han Solo", 100, 6);
    var obiwan = new Character("obiwan", "Obi-Wan Kenobi", 100, 6);
    var vader = new Character("vader", "Darth Vader", 100, 6);


});