import { Worker } from "bullmq";
import dotenv from "dotenv";
import twilio from "twilio";

import { connection } from "../config/redis";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const blacklistReminderHospitalWorker = new Worker(

  "blacklist-reminder-hospital-queue",

  async (job) => {

    const {
      hospitalId,
      hospitalName,
      phone,
      body,
    } = job.data;

    await client.messages.create({
      to: "+91" + phone,
      from: process.env.TWLIO_NUMBER,
      body,
    });

    console.log(
      `Blacklist reminder sent to hospital ${hospitalName}`
    );

  },

  {
    connection,
  }
);

blacklistReminderHospitalWorker.on(
  "completed",
  (job) => {
    console.log("Job completed:", job.id);
  }
);

blacklistReminderHospitalWorker.on(
  "failed",
  (job, err) => {
    console.error("Job failed:", err);
  }
);