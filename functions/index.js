const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({origin: true});
const nodemailer = require("nodemailer");
const {defineSecret} = require("firebase-functions/params");
const admin = require("firebase-admin");

/* Sets email and password to secret */
const gmailEmail = defineSecret("GMAIL_EMAIL");
const gmailPassword = defineSecret("GMAIL_PASSWORD");

/* Initilizes the Firebase Admin SDK with Realtime DB connection  (Benjamin)*/
admin.initializeApp({
  databaseURL: "https://app200v-44990-default-rtdb.europe-west1.firebasedatabase.app",
});

/* Function for sending email */ 
exports.sendInviteEmail = onRequest(
    {
      region: "us-central1",
      secrets: [gmailEmail, gmailPassword],
    },
    (req, res) => {
      cors(req, res, async () => {
        if (req.method === "OPTIONS") {
          return res.status(204).send("");
        }

        if (req.method !== "POST") {
          return res.status(405).json({
            success: false,
            error: "Method not allowed",
          });
        }

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({
            success: false,
            error: "Unauthorized",
          });
        }

        /* Firebase ID token used to verify that the user is authenticated and allowed to use the invite system */
        const idToken = authHeader.split("Bearer ")[1];

        let decodedToken;

        try {
          decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (error) {
          logger.error("Token verification failed:", error);
          return res.status(401).json({
            success: false,
            error: "Invalid token",
          });
        }

        const userId = decodedToken.uid;
        const verifiedSenderEmail = decodedToken.email || "A user";

        const {to, movieTitle} = req.body;

        if (!to || !movieTitle) {
          return res.status(400).json({
            success: false,
            error: "Missing email or movie title",
          });
        }

        const db = admin.database();
        const now = Date.now();
        const invitesRef = db.ref(`sentInvites/${userId}`);
        const invitesSnapshot = await invitesRef.get();

        if (invitesSnapshot.exists()) {
          const invites = invitesSnapshot.val();

          for (const inviteId in invites) {
            if (Object.prototype.hasOwnProperty.call(invites, inviteId)) {
              const invite = invites[inviteId];

              /* Remove expired invitations from the database to keep data clean and prevent old invites from remaining stored forever */
              if (invite.expiresAt && invite.expiresAt < now) {
                await invitesRef.child(inviteId).remove();
              }
            }
          }
        }
        const indexRef = db.ref(`inviteIndex/${userId}`);
        const indexSnapshot = await indexRef.get();

        if (indexSnapshot.exists()) {
          const emailEntries = indexSnapshot.val();

          for (const emailKey in emailEntries) {
            if (Object.prototype.hasOwnProperty.call(emailEntries, emailKey)
            ) {
              const movieEntries = emailEntries[emailKey];

              for (const movieKey in movieEntries) {
                if (Object.prototype.hasOwnProperty.call(movieEntries, movieKey)
                ) {
                  const entry = movieEntries[movieKey];

                  if (entry.expiresAt && entry.expiresAt < now) {
                    await indexRef.child(emailKey).child(movieKey).remove();
                  }
                }
              }
            }
          }
        }
        
        const today = new Date().toISOString().split("T")[0];

        const userLimitRef = db.ref(`emailLimits/${userId}/${today}`);
        const limitSnapshot = await userLimitRef.get();

        let count = 0;

        if (limitSnapshot.exists()) {
          count = limitSnapshot.val().count || 0;
        }

        /* Restricts each user to a maximum of 5 invitations per day to prevent spam and abuse of emailsystem */
        if (count >= 5) {
          return res.status(429).json({
            success: false,
            error: "Daily limit reached (5 invitations per day)",
          });
        }

        const normalizedEmail = to.trim().toLowerCase().replace(/\./g, "_");
        const normalizedMovieTitle = movieTitle.trim().toLowerCase();

        const duplicateRef = db.ref(
            `inviteIndex/${userId}/${normalizedEmail}/${normalizedMovieTitle}`,
        );

        const duplicateSnapshot = await duplicateRef.get();

        if (duplicateSnapshot.exists()) {
          return res.status(409).json({
            success: false,
            error: "You have already sent this movie to this email address.",
          });
        }
        
        /* Handels the actual sending of the email using Gmail services */
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailEmail.value(),
            pass: gmailPassword.value(),
          },
        });

        try {
          await transporter.sendMail({
            from: `"Movie Wheel App 🎬" <${gmailEmail.value()}>`,
            to: to,
            subject: `🎬 You're invited to watch ${movieTitle}!`,
            text: `Hi!

This invitation was sent from Movie Wheel App.

${verifiedSenderEmail} invited you to watch "${movieTitle}" with them 🍿

Open the app and enjoy your movie night! 🎬`,
          });

          const sentInviteRef = db.ref(`sentInvites/${userId}`).push();
          
          /* Invitations automaticaly deletes info from DB after 7 days to prevent storing info */ 
          const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
          const expiresAt = Date.now() + sevenDaysInMs;

          await sentInviteRef.set({
            to: to,
            movieTitle: movieTitle,
            senderEmail: verifiedSenderEmail,
            sentAt: Date.now(),
            expiresAt: expiresAt,
          });

          await duplicateRef.set({
            expiresAt: expiresAt,
          });

          await userLimitRef.set({
            count: count + 1,
          });

          return res.status(200).json({
            success: true,
            message: "Invitation sent",
          });
        } catch (error) {
          logger.error("FULL EMAIL ERROR:", error);

          return res.status(500).json({
            success: false,
            error: error.message || "Could not send invitation",
          });
        }
      });
    },
);
