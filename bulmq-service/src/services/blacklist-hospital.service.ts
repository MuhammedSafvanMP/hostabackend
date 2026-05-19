import { blacklistReminderHospitalQueue } from "../queues/blacklist-reminder-hospital.queue";

interface IBlacklistReminderHospital {
  hospitalId: string;
  hospitalName: string;
  phone: string;
  blacklistDate: Date;
}

export const scheduleBlacklistReminderHospital = async ({
  hospitalId,
  hospitalName,
  phone,
  blacklistDate,
}: IBlacklistReminderHospital) => {
  try {

    // 3 days before blacklist
    const reminderDate = new Date(blacklistDate);

    reminderDate.setDate(reminderDate.getDate() - 3);

    const delay = reminderDate.getTime() - Date.now();

    const body = `Reminder: Hospital ${hospitalName} will be blacklisted in 3 days. Please take necessary action immediately.`;

    const job = await blacklistReminderHospitalQueue.add(
      "blacklist-reminder-hospital",
      {
        hospitalId,
        hospitalName,
        phone,
        body,
      },
      {
        delay: delay > 0 ? delay : 0,

        attempts: 3,

        backoff: {
          type: "exponential",
          delay: 5000,
        },

        removeOnComplete: true,

        removeOnFail: false,
      }
    );

    return job;

  } catch (error) {
    throw error;
  }
};