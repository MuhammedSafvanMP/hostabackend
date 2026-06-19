
import amqp from 'amqplib';
import { env } from '../config/env';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

let channel: amqp.Channel;
let connection: any;

export const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(env.RABBITMQ_URL);

        connection.on('error', (err) => {
            console.error('❌ Staff Service RabbitMQ Connection Error:', err);
        });

        connection.on('close', () => {
            console.warn('⚠️ Staff Service RabbitMQ Connection closed. Retrying...');
            channel = null as any;
            setTimeout(connectRabbitMQ, 5000);
        });

        channel = await connection.createChannel();
        console.log('🐰 Staff Service connected to RabbitMQ');
    } catch (error) {
        console.error('❌ Staff Service RabbitMQ Error:', error);
        setTimeout(connectRabbitMQ, 5000);
    }
};

export const publishEvent = async (exchange: string, routingKey: string, data: any) => {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }
        await channel.assertExchange(exchange, 'direct', { durable: true });
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)), { persistent: true });
        
            await axios.post(`${process.env.SOCKETIO_SERVICE_URL}/emit-event`, {
            event: routingKey,
            userId : null,
            data
        });

    } catch (error) {
        console.error('❌ Event Publish Error:', error);
    }
};
