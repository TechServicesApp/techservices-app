import axios from "axios";

/**
 * @typedef {Object} SendNotificationParams
 * @property {string} receiveID - L'UID du destinataire.
 * @property {string} [message="Notification"] - Le message à envoyer.
 * @property {string} [title="Notification"] - Le titre de la notification.
 * @property {string} userType - Le type de l'utilisateur, doit être soit 'Techniciens' soit 'client'.
 */

/**
 * Envoie une notification à un utilisateur.
 * @param {SendNotificationParams} params - Les paramètres pour l'envoi de la notification.
 * @returns {Promise<{message: string, data?: any}>} - Une promesse qui se résout lorsque la notification est envoyée.
 * @throws {string} - Un message d'erreur si l'envoi échoue.
 */
export const sendNotificationToSomeone = async ({
  receiveID,
  message,
  title,
  userType,
}) => {
  if (!receiveID || !message || !title) {
    throw "Impossible d'envoyer la notification : paramètres invalides !";
  }

  try {
    const response = await axios.post(
      "https://us-central1-techservicebackend.cloudfunctions.net/sendNotificationToSomeone",
      {
        receiveID,
        message,
        title,
        userType,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      }
    );
    console.log("Notification sent successfully: ", response.data);
    return { message: "Notification sent successfully", data: response.data };
  } catch (error) {
    if (error.response) {
      console.error("Erreur de réponse du serveur: ", error.response.data);
      throw `Erreur du serveur : ${
        error.response.data.message || error.response.statusText
      }`;
    } else if (error.request) {
      console.error("Aucune réponse reçue: ", error.request);
      throw "Erreur réseau : Aucune réponse reçue du serveur";
    } else {
      console.error("Erreur lors de la requête: ", error.message);
      throw `Erreur lors de la requête : ${error.message}`;
    }
  }
};
