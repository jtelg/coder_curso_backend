import twilio from 'twilio';
import logger from './loggerUtils.js';

import dotenv from './dotenvUtils.js';


const client = twilio(process.env.TWILIO_ACCOUNT, process.env.TWILIO_TOKEN);

const twiClient = {
    sendMessage: async (body, to) => {
        try {
            const message = await client.messages.create({
                body, from: process.env.TWILIO_FROM, to: `+54${to}`
            })
            logger.info('POST > SMS por twlio enviado - twilio.js:19');
        } catch (error) {
            logger.error(`ERROR > Al enviar SMS por twilio (${JSON.stringify(error)}) - twilio.js:21`);
        }
    },
    sendWhatsapp: async (body, to) => {
        try {
            const message = await client.messages.create({
                body,
                from: `whatsapp:${process.env.TWILIO_FROM_WPP}`,
                to: `whatsapp:+549${to}`
            })
            logger.info('POST > Msg Whatsapp por twlio enviado - twilio.js:29');
        } catch (error) {
            logger.error(`ERROR > Al enviar msg whatsapp por twilio (${JSON.stringify(error)}) - twilio.js:31`);
        }
    }
};

export default twiClient;