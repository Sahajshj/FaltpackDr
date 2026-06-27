type SubmissionType = "contact" | "quote";

interface SubmissionBody {
  type?: SubmissionType;
  data?: Record<string, unknown>;
}

interface SubmissionResult {
  status: number;
  body: Record<string, unknown>;
}

interface VercelRequest {
  method?: string;
  body?: SubmissionBody;
}

interface VercelResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: Record<string, unknown>) => void;
  setHeader: (name: string, value: string) => void;
}

const text = (value: unknown, fallback = "Not provided") => {
  const stringValue = typeof value === "string" ? value.trim() : "";
  if (!stringValue) return fallback;

  return stringValue
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const yesNo = (value: unknown) => (value === true ? "Yes" : "No");

export async function processEmailSubmission(
  submission: SubmissionBody,
): Promise<SubmissionResult> {
  const { type, data } = submission ?? {};
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY is not defined in the environment.");
    return {
      status: 500,
      body: { error: "Email service is not configured on the server." },
    };
  }

  if (!data || typeof data !== "object") {
    return { status: 400, body: { error: "Submission data is required." } };
  }

  let subject: string;
  let html: string;

  if (type === "contact") {
    const name = text(data.name, "");
    const phone = text(data.phone, "");

    if (!name || !phone) {
      return { status: 400, body: { error: "Name and phone are required." } };
    }

    subject = `New Contact Message from ${name}`;
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7e5e4; border-radius: 12px; background-color: #fafaf9;">
        <h2 style="color: #064e3b; margin-top: 0; border-bottom: 2px solid #064e3b; padding-bottom: 10px;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${text(data.email)}</p>
        <p><strong>Suburb:</strong> ${text(data.suburb)}</p>
        <div style="margin-top: 20px;"><strong>Message:</strong>
          <div style="white-space: pre-wrap; background: #f5f5f4; padding: 15px; margin-top: 8px; border-radius: 8px; border: 1px solid #e7e5e4;">${text(data.message, "No message provided.")}</div>
        </div>
      </div>`;
  } else if (type === "quote") {
    const fullName = text(data.fullName, "");
    const phone = text(data.phone, "");
    const suburb = text(data.suburb, "");
    const items = text(data.itemsToAssemble, "");

    if (!fullName || !phone || !suburb || !items) {
      return {
        status: 400,
        body: { error: "Name, phone, suburb, and furniture details are required." },
      };
    }

    subject = `New Quote Request from ${fullName} (${suburb})`;
    html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7e5e4; border-radius: 12px; background-color: #fafaf9;">
        <h2 style="color: #064e3b; margin-top: 0; border-bottom: 2px solid #064e3b; padding-bottom: 10px;">New Quote Request Submission</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${text(data.email)}</p>
        <p><strong>Suburb:</strong> ${suburb}</p>
        <p><strong>Preferred Date &amp; Time:</strong> ${text(data.preferredDate, "Any date")} at ${text(data.preferredTime, "Any time")}</p>
        <p><strong>Preferred Contact Method:</strong> ${text(data.preferredContact)}</p>

        <h3 style="margin-top: 20px; border-bottom: 1px solid #e7e5e4; padding-bottom: 5px;">Furniture Details</h3>
        <p><strong>Brand/Retailer:</strong> ${text(data.furnitureBrand, "Not specified")}</p>
        <p><strong>Product Link / Codes:</strong> ${text(data.productLink, "Not specified")}</p>
        <p><strong>Items to Assemble:</strong> ${items}</p>
        <p><strong>Number of Items:</strong> ${text(String(data.numberOfItems ?? 1))}</p>

        <h3 style="margin-top: 20px; border-bottom: 1px solid #e7e5e4; padding-bottom: 5px;">Prep &amp; Extras Requested</h3>
        <ul style="padding-left: 20px;">
          <li><strong>Room Preparation:</strong> ${yesNo(data.roomPrepRequired)}</li>
          <li><strong>Packaging Removal &amp; Disposal:</strong> ${yesNo(data.packagingRemovalRequired)}</li>
          <li><strong>Skirting Board Modification:</strong> ${yesNo(data.skirtingBoardRemovalRequired)}</li>
          <li><strong>Floor Leveling Assessment:</strong> ${yesNo(data.floorLevelingRequired)}</li>
          <li><strong>Wall Anchoring / Safety Fixing:</strong> ${yesNo(data.wallFixingRequired)}</li>
          <li><strong>Exact Spatial Positioning:</strong> ${yesNo(data.furniturePositioningRequired)}</li>
        </ul>
        <div style="margin-top: 20px;"><strong>Additional Notes / Details:</strong>
          <div style="white-space: pre-wrap; background: #f5f5f4; padding: 15px; margin-top: 8px; border-radius: 8px; border: 1px solid #e7e5e4;">${text(data.additionalNotes, "None provided.")}</div>
        </div>
      </div>`;
  } else {
    return { status: 400, body: { error: "Invalid submission type." } };
  }

  const replyTo = typeof data.email === "string" ? data.email.trim() : "";
  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.FORM_FROM_EMAIL || "Flatpack Doctors Form <onboarding@resend.dev>",
      to: process.env.FORM_TO_EMAIL || "flatpackdoctors.au@gmail.com",
      reply_to: replyTo || undefined,
      subject,
      html,
    }),
  });

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text();
    console.error("Resend API error:", resendResponse.status, errorText);
    return {
      status: 502,
      body: { error: "The email provider could not send the message." },
    };
  }

  const result = (await resendResponse.json()) as { id?: string };
  return { status: 200, body: { success: true, messageId: result.id } };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Allow", "POST");
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const result = await processEmailSubmission(req.body ?? {});
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error("Error during send-email execution:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
