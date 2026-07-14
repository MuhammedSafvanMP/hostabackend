
// import Notification from "../models/notification.model";
// import { socketEmitter } from "../utils/socket.emitter";

// export const handleBookingEvent = async (routingKey: string, content: any) => {
//   if (routingKey === "BOOKING_REGISTERED" || routingKey === "BOOKING_CANCELLED") {
//     const msgText = routingKey === "BOOKING_REGISTERED"
//       ? `New booking for  ${content.doctorName || "Doctor"} at ${content.hospitalName || "Hospital"} on ${content.booking_date || "the requested date"}`
//       : `Booking cancelled for  ${content.doctorName || "Doctor"} at ${content.hospitalName || "Hospital"} on ${content.booking_date || "the requested date"} (ID: ${content.bookingId})`;

//     await Notification.create({
//       userIds: content.userId ? [content.userId] : [],
//       hospitalIds: content.hospitalId ? [content.hospitalId] : [],
//       doctorIds: content.doctorId ? [content.doctorId] : [],
//       message: msgText,
//     }).catch((err) => console.error(`Failed to save ${routingKey} notification`, err));

//     if (content.userId) {
//       socketEmitter.to(`user_${content.userId}`).emit("booking_event", { event: routingKey, message: msgText, data: content });
//     }
//     if (content.hospitalId) {
//       socketEmitter.to(`hospital_${content.hospitalId}`).emit("booking_event", { event: routingKey, message: msgText, data: content });
//     }

//     // Additional target alert triggers
//     if (routingKey === "BOOKING_REGISTERED") {
//       if (content.doctorId) {
//         socketEmitter.to(`user_${content.doctorId}`).emit("booking_alert", {
//           message: `New booking registered: ${content.patient_name || "Patient"} (ID: ${content.bookingId})`,
//           data: content,
//         });
//       }
//       if (content.hospitalId) {
//         socketEmitter.to(`user_${content.hospitalId}`).emit("booking_alert", {
//           message: `New booking registered: ${content.patient_name || "Patient"} (ID: ${content.bookingId})`,
//           data: content,
//         });
//       }
//     } else {
//       // BOOKING_CANCELLED
//       if (content.doctorId) {
//         socketEmitter.to(`user_${content.doctorId}`).emit("booking_alert", {
//           message: `Booking cancelled: ${content.patient_name || "Patient"} (ID: ${content.bookingId})`,
//           data: content,
//         });
//       }
//       if (content.hospitalId) {
//         socketEmitter.to(`user_${content.hospitalId}`).emit("booking_alert", {
//           message: `Booking cancelled: ${content.patient_name || "Patient"} (ID: ${content.bookingId})`,
//           data: content,
//         });
//       }
//     }
//   }

//   // HOSPITAL-ONLY notifications for booking updates
//   if (routingKey === "BOOKING_UPDATED" || routingKey === "BOOKING_ACCEPTED" || routingKey === "BOOKING_COMPLETED") {
//     let msg = "";
//     if (content.status === "accepted" || content.status === "declined") {
//       msg = `Booking (ID: ${content.bookingId}) has been ${content.status} by staff.`;
//     } else if (content.status === "completed") {
//       msg = `Booking (ID: ${content.bookingId}) has been marked as completed.`;
//     } else {
//       msg = `Booking (ID: ${content.bookingId}) status has been updated to ${content.status || "updated"}.`;
//     }

//     // Save notification for hospitals only
//     await Notification.create({
//       userIds: [], // No user notifications
//       hospitalIds: content.hospitalId ? [content.hospitalId] : [],
//       message: msg,
//     }).catch((err) => console.error("Failed to save booking update notification", err));

//     // Send socket notifications to hospitals only
//     if (content.hospitalId) {
//       socketEmitter.to(`hospital_${content.hospitalId}`).emit("booking_event", { 
//         event: routingKey, 
//         message: msg, 
//         data: content 
//       });
      
//       // Additional hospital-specific alert
//       socketEmitter.to(`hospital_${content.hospitalId}`).emit("booking_created", {
//         message: msg,
//         bookingId: content.bookingId,
//         status: content.status,
//       });
//     }
//   }  
// };

import Notification from "../models/notification.model";
import { socketEmitter } from "../utils/socket.emitter";

// Helper to format booking ID as #APT000001
const formatBookingId = (id: number | string): string => {
  const num = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(num)) return '#APT000000';
  return `#APT${String(num).padStart(6, '0')}`;
};

export const handleBookingEvent = async (routingKey: string, content: any) => {
  if (routingKey === "BOOKING_REGISTERED" || routingKey === "BOOKING_CANCELLED") {
    const formattedId = formatBookingId(content.bookingId);
    const msgText = routingKey === "BOOKING_REGISTERED"
      ? `New booking for ${content.doctorName || "Doctor"} at ${content.hospitalName || "Hospital"} on ${content.booking_date || "the requested date"}`
      : `Booking cancelled for ${content.doctorName || "Doctor"} at ${content.hospitalName || "Hospital"} on ${content.booking_date || "the requested date"} (ID: ${formattedId})`;

    await Notification.create({
      userIds: content.userId ? [content.userId] : [],
      hospitalIds: content.hospitalId ? [content.hospitalId] : [],
      doctorIds: content.doctorId ? [content.doctorId] : [],
      message: msgText,
    }).catch((err) => console.error(`Failed to save ${routingKey} notification`, err));

    if (content.userId) {
      socketEmitter.to(`user_${content.userId}`).emit("booking_event", { event: routingKey, message: msgText, data: content });
    }
    if (content.hospitalId) {
      socketEmitter.to(`hospital_${content.hospitalId}`).emit("booking_event", { event: routingKey, message: msgText, data: content });
    }

    // Additional target alert triggers
    if (routingKey === "BOOKING_REGISTERED") {
      if (content.doctorId) {
        socketEmitter.to(`user_${content.doctorId}`).emit("booking_alert", {
          message: `New booking registered: ${content.patient_name || "Patient"} (ID: ${formattedId})`,
          data: content,
        });
      }
      if (content.hospitalId) {
        socketEmitter.to(`user_${content.hospitalId}`).emit("booking_alert", {
          message: `New booking registered: ${content.patient_name || "Patient"} (ID: ${formattedId})`,
          data: content,
        });
      }
    } else {
      // BOOKING_CANCELLED
      if (content.doctorId) {
        socketEmitter.to(`user_${content.doctorId}`).emit("booking_alert", {
          message: `Booking cancelled: ${content.patient_name || "Patient"} (ID: ${formattedId})`,
          data: content,
        });
      }
      if (content.hospitalId) {
        socketEmitter.to(`user_${content.hospitalId}`).emit("booking_alert", {
          message: `Booking cancelled: ${content.patient_name || "Patient"} (ID: ${formattedId})`,
          data: content,
        });
      }
    }
  }

  // HOSPITAL-ONLY notifications for booking updates
  if (routingKey === "BOOKING_UPDATED" || routingKey === "BOOKING_ACCEPTED" || routingKey === "BOOKING_COMPLETED") {
    const formattedId = formatBookingId(content.bookingId);
    let msg = "";
    if (content.status === "accepted" || content.status === "declined") {
      msg = `Booking (ID: ${formattedId}) has been ${content.status} by staff.`;
    } else if (content.status === "completed") {
      msg = `Booking  ${formattedId} has been marked as completed.`;
    } else {
      msg = `Booking  ${formattedId} status has been updated to ${content.status || "updated"}.`;
    }

    // Save notification for hospitals only
    await Notification.create({
      userIds: [], // No user notifications
      hospitalIds: content.hospitalId ? [content.hospitalId] : [],
      message: msg,
    }).catch((err) => console.error("Failed to save booking update notification", err));

    // Send socket notifications to hospitals only
    if (content.hospitalId) {
      socketEmitter.to(`hospital_${content.hospitalId}`).emit("booking_event", { 
        event: routingKey, 
        message: msg, 
        data: content 
      });
      
      // Additional hospital-specific alert
      socketEmitter.to(`hospital_${content.hospitalId}`).emit("booking_created", {
        message: msg,
        bookingId: content.bookingId,
        status: content.status,
      });
    }
  }  
};