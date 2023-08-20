require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.on('messageCreate', function(msg){
    sstrQ = 'https://www.googleapis.com/books/v1/volumes?q='
    sstrA = '+inauthor:'
    sstrK = '&key=' + process.env.API_KEY
    strGR = 'https://www.goodreads.com/book/isbn/'
    
    if(msg.content.includes('!Hunt')&&msg.content.includes('!by')){
        idxTitle = msg.content.match('!Hunt')
        idxAuthor = msg.content.match('!by')
        Title = idxTitle.input.slice(6,idxAuthor.index-1)
        Author = idxTitle.input.slice(idxAuthor.index+4)
        //console.log(Title)
        //console.log(Author)
        sTitle = Title.replaceAll(' ','+')
        sAuthor = Author.replaceAll(' ','+')
        BuildCMD = sstrQ+sTitle + sstrA+sAuthor + sstrK
        //console.log(BuildCMD)
        //!Hunt [title] !by [author]
        promiseBook = fetch(BuildCMD, 
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
            if(response.items[0].volumeInfo.industryIdentifiers[1].identifier.includes('X')){
                return response.items[1].volumeInfo.industryIdentifiers[1].identifier;
            } else {
                return response.items[0].volumeInfo.industryIdentifiers[1].identifier;
            }
        })
        promiseBook.then((isbn10) => {
            hunt=strGR+isbn10
            //console.log(strGR+isbn10);
            msg.reply('🏹 ['+Title+' by '+Author+']('+hunt+')');
            })
    } else if(msg.content.includes('!Hunt')&&(!msg.content.includes('!by'))){
        idxTitle = msg.content.match('!Hunt')
        Title = idxTitle.input.slice(6)
        //console.log(title)
        sTitle = Title.replaceAll(' ','+')
        Author = '???'
        BuildCMD = sstrQ+sTitle + sstrK
        promiseBook = fetch(BuildCMD, 
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
            if(response.items[0].volumeInfo.industryIdentifiers[1].identifier.includes('X')){
                return response.items[1].volumeInfo.industryIdentifiers[1].identifier;
            } else {
                return response.items[0].volumeInfo.industryIdentifiers[1].identifier;
            }
        })
        promiseBook.then((isbn10) => {
            hunt=strGR+isbn10
            //console.log(strGR+isbn10);
            msg.reply('🏹 ['+Title+' by '+Author+']('+hunt+')');
            })
    }
});

client.login(process.env.BOT_TOKEN)