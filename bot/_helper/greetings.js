const Database = require("../../database")
const {MessageFactory, TurnContext} = require("botbuilder");
class Greetings{
    
    static async addToDataBase(members){
        console.log("Adding Greeting users to DB")
        members.forEach(element => {
            Database.appendUser(element)
        });
        
    }

    static async greetEveryone(members,context){

        members.forEach(async (teamMember) => {
            const message = MessageFactory.text('Hello '+teamMember["name"]+'. I have greeted you 2 times.');
    
            var ref = TurnContext.getConversationReference(context.activity);
            ref.user = teamMember;
    
            await context.adapter.createConversation(ref,
                async (t1) => {
                    const ref2 = TurnContext.getConversationReference(t1.activity);
                    await t1.adapter.continueConversation(ref2, async (t2) => {
                        await t2.sendActivity(message);
                    });
                });
        });    
    }
}

module.exports=Greetings