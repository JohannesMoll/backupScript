import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import * as dotenv from 'dotenv'
import create_backup from './backup'
dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN!);
 
bot.command('backup', async (ctx) => {
    await ctx.telegram.sendMessage(process.env.CHAT_ID!, `Starting manual Backup`);
    await create_backup(ctx.telegram);
    await ctx.telegram.sendMessage(process.env.CHAT_ID!, `Finished manual Backup`);
})
  
bot.launch()


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))