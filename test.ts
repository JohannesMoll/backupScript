import { Telegraf, Telegram } from "telegraf";
import create_backup from "./backup";
import * as dotenv from 'dotenv'

dotenv.config()


const telegram = new Telegram(process.env.BOT_TOKEN!);

create_backup(telegram);