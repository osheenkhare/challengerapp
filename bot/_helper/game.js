const rawGameStartCard = require("../adaptiveCards/gamestart.json");
const rawResponseCard = require("../adaptiveCards/response.json");
const rawThankyouCard = require("../adaptiveCards/thankyou.json");
const {CardFactory, MessageFactory, TurnContext} = require("botbuilder");
const cardTools = require("@microsoft/adaptivecards-tools");
const Database = require("../../database")

class Game {

    static async initGame(context, members){

        console.log("Creating a game")

        // Get GUID for game
        this.gameId = this.gameIdGenerator();

        let userset=""

        // Iterate for users, init Database and send cards
        members.forEach(async (teamMember) => {
            var memberInfo={"aadObjectId": teamMember["aadObjectId"], "name": teamMember["name"], "gameId":this.gameId, "reply":"none"}
            Database.initGame(memberInfo)

            userset+="\r - "+teamMember["name"]+" : none"

            const card = cardTools.AdaptiveCards.declare(rawGameStartCard).render(memberInfo);
    
            var ref = TurnContext.getConversationReference(context.activity);
            ref.user = teamMember;
    
            await context.adapter.createConversation(ref,
                async (t1) => {
                    const ref2 = TurnContext.getConversationReference(t1.activity);
                    await t1.adapter.continueConversation(ref2, async (t2) => {
                        await t2.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
                    });
                });
        });   

        var responsedata={"response_user":userset}
        const card = cardTools.AdaptiveCards.declare(rawResponseCard).render(responsedata);
        var cardId = await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });

        var resid = {"gameId":this.gameId, "cardId":cardId["id"]}
        Database.saveResponseId(resid)
    }

    static gameIdGenerator(){
       return (Math.random() + 1).toString(36).substring(7);
    }

    static async captureResponses(context,response){

        // Thank you card to responder
        const card = cardTools.AdaptiveCards.declareWithoutData(rawThankyouCard).render();
        await context.updateActivity({
            type: "message",
            id: context.activity.replyToId,
            attachments: [CardFactory.adaptiveCard(card)],
        });

        // Saving response in DB
        Database.updateGameResponses(response)

        // Get Adaptive card ID for maintaining Responses
        var r = await Database.getResponseId(response["gameId"])
        var resid = ("responses",r["cardId"]["_"])

        // Get Updated Responses from DB
        var userlist = await Database.getGameUserResponses(response["gameId"])
        let userset=""
        userlist.forEach(element=>{
            userset+="\r - "+element[0]+" : "+element[1]
        })

        // Update Response Card
        var responsedata={"response_user":userset}
        const updatecard = cardTools.AdaptiveCards.declare(rawResponseCard).render(responsedata);

        // Send Updated Response Card
        await context.updateActivity({
            type: "message",
            id: resid,
            attachments: [CardFactory.adaptiveCard(updatecard)],
        });
    }

    static isGameover(){
        console.log("Cheking if game is over")
    }

    static getScore(){
        console.log("Calculating Scores")
    }
}

module.exports = Game