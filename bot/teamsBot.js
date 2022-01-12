const { TeamsActivityHandler, CardFactory, TurnContext, TeamsInfo} = require("botbuilder");
const rawWelcomeCard = require("./adaptiveCards/welcome.json");
const rawLearnCard = require("./adaptiveCards/learn.json");
const rawThankyouCard = require("./adaptiveCards/thankyou.json");
const cardTools = require("@microsoft/adaptivecards-tools");
const Greetings = require("./_helper/greetings")
const Game = require("./_helper/game")

class TeamsBot extends TeamsActivityHandler {
  constructor() { 
    super();

    // record the likeCount
    this.likeCountObj = { likeCount: 0 };

    this.onMessage(async (context, next) => {

      console.log("Running with Message Activity.");
      let txt = context.activity.text;
      const removedMentionText = TurnContext.removeRecipientMention(
        context.activity
      );
      if (removedMentionText) {
        // Remove the line break
        txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
      }

      // Trigger command by IM text
      switch (txt) {
        case "welcome": {
          const card = cardTools.AdaptiveCards.declareWithoutData(rawWelcomeCard).render();
          await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
          break;
        }
        case "learn": {
          this.likeCountObj.likeCount = 0;
          const card = cardTools.AdaptiveCards.declare(rawLearnCard).render(this.likeCountObj);
          await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
          break;
        }
        case "greet" : {
          await context.sendActivity({text:"Greeting everyone in chat"})
          var members = await this.getConverationThreadMembers(context)
          Greetings.addToDataBase(members)
          Greetings.greetEveryone(members,context)
          break;
        }
        case "game": {
          var members = await this.getConverationThreadMembers(context)
          await Game.initGame(context,members)
          //await context.sendActivity({text:"Starting Game!"})
          break;
        }
        default:{          
          await context.sendActivity({text:"Hello!"})
        }
      }
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    // Listen to MembersAdded event, view https://docs.microsoft.com/en-us/microsoftteams/platform/resources/bot-v3/bots-notifications for more events
    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
        if (membersAdded[cnt].id) {
          const card = cardTools.AdaptiveCards.declareWithoutData(rawWelcomeCard).render();
          await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
          break;
        }
      }
      await next();
    });
  }

  // Invoked when an action is taken on an Adaptive Card. The Adaptive Card sends an event to the Bot and this
  // method handles that event.
  async onAdaptiveCardInvoke(context, invokeValue) {
     // The verb "userlike" is sent from the Adaptive Card defined in adaptiveCards/learn.json
     if(invokeValue.action.verb==="gameresponse"){
      console.log(context.activity.replyToId)
      const card = cardTools.AdaptiveCards.declareWithoutData(rawThankyouCard).render();
      await context.updateActivity({
        type: "message",
        id: context.activity.replyToId,
        attachments: [CardFactory.adaptiveCard(card)],
      });
      await Game.captureResponses(context, invokeValue.action.data)
     }
     return { statusCode: 200 };
  }

  // Get members from current Conersation Thread
  async getConverationThreadMembers(context){
    var continuationToken;
    var members = [];

    do {
        var pagedMembers = await TeamsInfo.getPagedMembers(context, 100, continuationToken);
        continuationToken = pagedMembers.continuationToken;
        members.push(...pagedMembers.members);
    }
    while(continuationToken !== undefined)

    return(members)
  }
}


module.exports.TeamsBot = TeamsBot;
