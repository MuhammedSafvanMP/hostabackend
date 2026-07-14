import { sendPushNotification } from "../events/pushnotification";

interface PushPayload {
  hospitalToken?: string;
  doctorToken?: string;
  userToken?: string;
  userId?: string | number;
  doctorId?: string | number;
  hospitalId?: string | number

  patient_name?: string;
  doctorName?: string;

  booking_date?: string;

  type:
    | "BOOKING_REGISTERED"
    | "BOOKING_UPDATED"
    | "BOOKING_CANCELLED"
    | "BOOKING_ACCEPTED"
    | "BOOKING_COMPLETED";
}

export const sendBookingPushNotifications = async ({
  userId,
  doctorId,
  hospitalId,
  hospitalToken,
  doctorToken,
  userToken,
  patient_name,
  doctorName,
  booking_date,
  type,
}: PushPayload) => {

  const notifications: Promise<any>[] = [];

  // =========================
  // BOOKING REGISTERED
  // =========================

  if (type === "BOOKING_REGISTERED") {

    if (hospitalToken?.length) {
       for (const token of hospitalToken) {
      notifications.push(
        sendPushNotification({
          hospitalId,
          token: token,
          title: "New Booking",
          body: `${patient_name} booked with  ${doctorName}`,
        })
      );
    }
  }


    if (doctorToken?.length) {
      for (const token of doctorToken) {
      notifications.push(
        sendPushNotification({
          doctorId,
          token: token,
          title: "New Appointment",
          body: `New booking on ${booking_date}`,
        })
      );
    }
  }

  
}



  // =========================
  // BOOKING_ACCEPTED
  // =========================

  if (type === "BOOKING_ACCEPTED") {

  
      if (userToken?.length) {
      for (const token of userToken) {
      notifications.push(
        sendPushNotification({
          userId,
          token: token,
          title: "Booking Confirmed",
          body: `Appointment with  ${doctorName} confirmed`,
        })
      );
    }
  }

  
}



  // =========================
  // BOOKING UPDATED
  // =========================

  if (type === "BOOKING_UPDATED") {

    if (userToken?.length) {
       for (const token of userToken) {
      notifications.push(
        sendPushNotification({
          userId,
          token: token,
          title: "Booking Rejected",
          body: `Your booking has been rejected`,
        })
      );
    }
  }
}


  // =========================
  // BOOKING COMPLETED
  // =========================


  if (type === "BOOKING_COMPLETED") {

    if (userToken?.length) {
       for (const token of userToken) {
      notifications.push(
        sendPushNotification({
          userId,
          token: token,
          title: "Booking Updated",
          body: `Your booking has been completed`,
        })
      );
    }
  }
}




  // =========================
  // BOOKING CANCELLED
  // =========================

  if (type === "BOOKING_CANCELLED") {

  

    if (doctorToken?.length) {
       for (const token of doctorToken) {
      notifications.push(
        sendPushNotification({
          doctorId,
          token: token,
          title: "Appointment Cancelled",
          body: `Patient cancelled appointment`,
        })
      );
    }
  }
}

  await Promise.allSettled(notifications);

};