const { Telegraf, Markup } = require("telegraf");
const {MenuTemplate, MenuMiddleware} = require('telegraf-inline-menu')
const fetchNews = require('./fetch')
require("dotenv").config();
//create a bot
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

//when a user starts a session with your bot
bot.start((ctx) => {
	ctx.replyWithPhoto(
		"https://preview.redd.it/stz1nbzqqoh41.jpg?width=640&crop=smart&auto=webp&s=333d1e26d77ef43f3000f5aa7d51b2c014e3587f"
	);
	ctx.reply("Welcome to DunieBot~ I am little qi pot and I love berry");
});
bot.catch((err,ctx) => {
    console.log(err)
    ctx.reply('Uh oh error')
})
bot.hears("helloie", (ctx) => ctx.reply("Helloie"));
bot.hears("who's this?", (ctx) => ctx.reply("Its meeerrrr~"));
bot.hears("hehe", (ctx) => ctx.reply("Dont copy me"));
bot.hears("currr", (ctx) => ctx.reply("currrrr~"));

bot.command("news", async (ctx) => {
	const texts = ctx.message.text.split(" ");
    const country = texts[1];
	if (!country) {
		return menuMiddleware.replyToContext(ctx)
	}
	return fetchNews(country,ctx)
});
const possibleOptions = 'ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za'
const countryArray = possibleOptions.split(' ')
//create a menu
const menuTemplate = new MenuTemplate(ctx => ctx.reply(`Please choose the following countries`))

countryArray.forEach(c => {
    return menuTemplate.interact(c,c,{
        do: async ctx => {
            ctx.answerCbQuery().then(()=> true)
          },

    })
})

 //middleware
const menuMiddleware = new MenuMiddleware('/', menuTemplate)

bot.use((ctx,next)=> {
    if(ctx.callbackQuery!=null){
        const country = ctx.callbackQuery.data.substring(1)
        console.log('CallbackQuery:', ctx.callbackQuery)
        return fetchNews(country, ctx)
    }
    next()
})

bot.use(menuMiddleware)
//start the bot
console.log(`Starting bot at ${new Date()}`);
bot.launch();
