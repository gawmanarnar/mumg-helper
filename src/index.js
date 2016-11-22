'use strict';

var AlexaSkill = require('./AlexaSkill'),
    abilities = require('./keywords');

var APP_ID = '';

/**
 * Superhero Miniature Game Reference is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var RuleReference = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
RuleReference.prototype = Object.create(AlexaSkill.prototype);
RuleReference.prototype.constructor = RuleReference;

RuleReference.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the Unofficial Superhero Tabletop Assistant, a fan-made rules reference for the Marvel and DC Universe Miniature Game. You can ask a question like, what does the Mastermind ability do? ... Now, what would you like to know?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

RuleReference.prototype.intentHandlers = {
    "GetAbilityText": function (intent, session, response) {
        var itemSlot = intent.slots.AbilityName,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        var ability = abilities[itemName],
            speechOutput,
            repromptOutput;
        if (ability) {
            speechOutput = {
                speech: ability,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, itemName, ability);
        } else {
            var speech;
            if (itemName) {
                speech = "I'm sorry, I currently do not know the rules for " + itemName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know that rule. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions such as, what does the X ability do? where X is the ability name, or, you can say cancel... Now, what can I help you with?";
        var repromptText = "You can say things like, what does the X ability do? where X is the ability name, or you can say cancel... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var reference = new RuleReference();
    reference.execute(event, context);
};