import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser to process incoming form data
  app.use(express.json());

  // API Route: Send Email via Resend
  app.post("/api/send-email", async (req, res) => {
    try {
      const { type, data } = req.body;
      const apiKey = process.env.RESEND_API_KEY;

      if (!apiKey) {
        console.error("RESEND_API_KEY is not defined in the environment.");
        return res.status(500).json({ error: "Email service is not configured on the server." });
      }

      let subject = "";
      let htmlContent = "";

      if (type === "contact") {
        const { name, phone, email, suburb, message } = data;
        subject = `New Contact Message from ${name}`;
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7e5e4; border-radius: 12px; background-color: #fafaf9;">
            <h2 style="color: #064e3b; margin-top: 0; border-bottom: 2px solid #064e3b; padding-bottom: 10px;">New Contact Form Submission</h2>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email || "Not provided"}</p>
            <p style="margin: 10px 0;"><strong>Suburb:</strong> ${suburb || "Not provided"}</p>
            <div style="margin-top: 20px;">
              <strong style="display: block; margin-bottom: 8px;">Message:</strong>
              <div style="white-space: pre-wrap; background: #f5f5f4; padding: 15px; border-radius: 8px; border: 1px solid #e7e5e4; color: #1c1917; font-size: 14px; line-height: 1.5;">${message || "No message provided."}</div>
            </div>
          </div>
        `;
      } else if (type === "quote") {
        const { 
          fullName, phone, email, suburb, preferredDate, preferredTime,
          furnitureBrand, productLink, itemsToAssemble, numberOfItems,
          roomPrepRequired, packagingRemovalRequired, skirtingBoardRemovalRequired,
          floorLevelingRequired, wallFixingRequired, furniturePositioningRequired,
          additionalNotes, preferredContact
        } = data;
        
        subject = `New Quote Request from ${fullName} (${suburb})`;
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7e5e4; border-radius: 12px; background-color: #fafaf9;">
            <h2 style="color: #064e3b; margin-top: 0; border-bottom: 2px solid #064e3b; padding-bottom: 10px;">New Quote Request Submission</h2>
            <p style="margin: 8px 0;"><strong>Full Name:</strong> ${fullName}</p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email || "Not provided"}</p>
            <p style="margin: 8px 0;"><strong>Suburb:</strong> ${suburb}</p>
            <p style="margin: 8px 0;"><strong>Preferred Date & Time:</strong> ${preferredDate || "Any date"} at ${preferredTime || "Any time"}</p>
            <p style="margin: 8px 0;"><strong>Preferred Contact Method:</strong> ${preferredContact}</p>
            
            <h3 style="color: #1c1917; margin-top: 20px; border-bottom: 1px solid #e7e5e4; padding-bottom: 5px;">Furniture Details</h3>
            <p style="margin: 6px 0;"><strong>Brand/Retailer:</strong> ${furnitureBrand || "Not specified"}</p>
            <p style="margin: 6px 0;"><strong>Product Link / Codes:</strong> ${productLink || "Not specified"}</p>
            <p style="margin: 6px 0;"><strong>Items to Assemble:</strong> ${itemsToAssemble || "Not specified"}</p>
            <p style="margin: 6px 0;"><strong>Number of Items:</strong> ${numberOfItems}</p>

            <h3 style="color: #1c1917; margin-top: 20px; border-bottom: 1px solid #e7e5e4; padding-bottom: 5px;">Prep & Extras Requested</h3>
            <ul style="padding-left: 20px; margin: 10px 0;">
              <li style="margin: 4px 0;"><strong>Room Preparation (baseboards, spatial prep):</strong> ${roomPrepRequired ? "Yes" : "No"}</li>
              <li style="margin: 4px 0;"><strong>Packaging Removal & Disposal:</strong> ${packagingRemovalRequired ? "Yes" : "No"}</li>
              <li style="margin: 4px 0;"><strong>Skirting Board Modification:</strong> ${skirtingBoardRemovalRequired ? "Yes" : "No"}</li>
              <li style="margin: 4px 0;"><strong>Floor Leveling Assessment:</strong> ${floorLevelingRequired ? "Yes" : "No"}</li>
              <li style="margin: 4px 0;"><strong>Wall Anchoring / Safety Fixing:</strong> ${wallFixingRequired ? "Yes" : "No"}</li>
              <li style="margin: 4px 0;"><strong>Exact Spatial Positioning:</strong> ${furniturePositioningRequired ? "Yes" : "No"}</li>
            </ul>

            <div style="margin-top: 20px;">
              <strong style="display: block; margin-bottom: 8px;">Additional Notes / Details:</strong>
              <div style="white-space: pre-wrap; background: #f5f5f4; padding: 15px; border-radius: 8px; border: 1px solid #e7e5e4; color: #1c1917; font-size: 14px; line-height: 1.5;">${additionalNotes || "None provided."}</div>
            </div>
          </div>
        `;
      } else {
        return res.status(400).json({ error: "Invalid submission type." });
      }

      // Format from-header and reply-to fields correctly
      // We send from onboarding@resend.dev but set reply_to to allow easy replies
      const resendPayload = {
        from: "Flatpack Doctors Form <onboarding@resend.dev>",
        to: "flatpackdoctors.au@gmail.com",
        reply_to: data.email || undefined,
        subject: subject,
        html: htmlContent,
      };

      console.log("Sending email via Resend API...");
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resendPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Resend API responded with error status:", response.status, errorText);
        return res.status(response.status).json({ error: "Failed to send email via Resend API." });
      }

      const resData = (await response.json()) as any;
      console.log("Email sent successfully. Message ID:", resData.id);
      return res.json({ success: true, messageId: resData.id });
    } catch (error: any) {
      console.error("Error during server send-email execution:", error);
      return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
