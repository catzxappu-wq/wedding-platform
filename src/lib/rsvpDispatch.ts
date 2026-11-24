import prisma from "@/lib/prisma";
import { invitationStore } from "@/lib/invitationStore";

export interface RsvpDispatchConfig {
  email: string;
  whatsapp: string;
  enabled: boolean;
  notifyHoursBefore: number;
  lastSentAt?: string | null;
  lastStatus?: string | null;
}

export interface RsvpStats {
  totalResponses: number;
  attendingCount: number;
  notAttendingCount: number;
  totalHeadcount: number;
  vegCount: number;
  nonVegCount: number;
  jainCount: number;
  veganCount: number;
}

/**
 * Normalizes phone numbers to international standard format for WhatsApp API
 */
export function formatWhatsAppNumber(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "";
  // If user enters 10-digit Indian number without country code, prefix with 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

/**
 * Fetches all RSVPs for an invitation from both database and backup store
 */
export async function getRsvpsForInvitation(invitationId: string) {
  let rsvps: any[] = [];
  try {
    rsvps = await prisma.rsvp.findMany({
      where: {
        OR: [
          { invitationId },
          { invitation: { slug: invitationId } },
        ],
      },
      include: {
        invitation: {
          include: { couple: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("DB RSVP query error in rsvpDispatch:", err);
  }

  // Backup store merge
  const allInvs = invitationStore.getAllInvitations();
  const existingIds = new Set(rsvps.map((r) => r.id));
  for (const inv of allInvs) {
    if (inv.id === invitationId || inv.slug.toLowerCase() === invitationId.toLowerCase()) {
      for (const r of inv.rsvps || []) {
        if (!existingIds.has(r.id)) {
          rsvps.push({
            ...r,
            invitation: { title: inv.title, couple: inv.couple, slug: inv.slug },
          });
        }
      }
    }
  }

  return rsvps;
}

/**
 * Computes attendance & dietary statistics
 */
export function computeRsvpStats(rsvps: any[]): RsvpStats {
  const totalResponses = rsvps.length;
  const attendingList = rsvps.filter((r) => r.attending);
  const attendingCount = attendingList.length;
  const notAttendingCount = totalResponses - attendingCount;
  const totalHeadcount = attendingList.reduce(
    (sum, r) => sum + (Number(r.guestsCount) || 1),
    0
  );

  const vegCount = attendingList.filter((r) => r.foodPreference?.toLowerCase() === "veg" || r.foodPreference?.toLowerCase() === "vegetarian").length;
  const nonVegCount = attendingList.filter((r) => r.foodPreference?.toLowerCase() === "non-veg" || r.foodPreference?.toLowerCase() === "non-vegetarian").length;
  const jainCount = attendingList.filter((r) => r.foodPreference?.toLowerCase() === "jain").length;
  const veganCount = attendingList.filter((r) => r.foodPreference?.toLowerCase() === "vegan").length;

  return {
    totalResponses,
    attendingCount,
    notAttendingCount,
    totalHeadcount,
    vegCount,
    nonVegCount,
    jainCount,
    veganCount,
  };
}

/**
 * Generates a clean, standard CSV string containing all RSVP responses
 */
export function buildRsvpCsv(rsvps: any[], weddingTitle?: string): string {
  const headers = [
    "S.No",
    "Guest Name",
    "Phone",
    "Email",
    "Attending",
    "Guests Count",
    "Food Preference",
    "Blessings / Note",
    "Submitted Date (IST)",
  ].join(",");

  const rows = rsvps.map((r, idx) => {
    const formattedDate = r.createdAt
      ? new Date(r.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      : "";
    const name = `"${(r.guestName || "Guest").replace(/"/g, '""')}"`;
    const phone = `"${(r.phone || "").replace(/"/g, '""')}"`;
    const email = `"${(r.email || "").replace(/"/g, '""')}"`;
    const attending = r.attending ? "YES" : "NO";
    const count = r.attending ? (r.guestsCount || 1) : 0;
    const food = `"${(r.foodPreference || "Vegetarian").replace(/"/g, '""')}"`;
    const note = `"${(r.message || "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

    return [
      idx + 1,
      name,
      phone,
      email,
      attending,
      count,
      food,
      note,
      `"${formattedDate}"`,
    ].join(",");
  });

  return [headers, ...rows].join("\r\n");
}

/**
 * Builds a formatted WhatsApp message with stats and direct CSV download link
 */
export function buildWhatsAppMessage(params: {
  weddingTitle: string;
  weddingDateStr: string;
  stats: RsvpStats;
  downloadUrl: string;
  is12HrNotice?: boolean;
}): string {
  const { weddingTitle, weddingDateStr, stats, downloadUrl, is12HrNotice } = params;
  const timingHeader = is12HrNotice
    ? "⏰ *12-HOUR PRE-WEDDING RSVP DISPATCH*"
    : "📋 *WEDDING RSVP GUEST REPORT*";

  return `${timingHeader}
💍 *${weddingTitle}*
📅 *Wedding Date:* ${weddingDateStr}

━━━━━━━━━━━━━━━━━━━━
📊 *ATTENDANCE SUMMARY*
━━━━━━━━━━━━━━━━━━━━
• *Total Responses:* ${stats.totalResponses}
• *Confirmed Attending:* ${stats.attendingCount} parties
• *Total Guest Headcount:* ${stats.totalHeadcount} guests
• *Decline / Regrets:* ${stats.notAttendingCount}

🍽️ *DIETARY PREFERENCES*
• Vegetarian: ${stats.vegCount}
• Non-Vegetarian: ${stats.nonVegCount}
• Jain: ${stats.jainCount}
• Vegan: ${stats.veganCount}

━━━━━━━━━━━━━━━━━━━━
📥 *DOWNLOAD FULL CSV REPORT:*
${downloadUrl}
━━━━━━━━━━━━━━━━━━━━
_Generated automatically by ForeverYours Wedding Platform_`;
}

/**
 * Dispatches the RSVP report via Email (Resend API or simulated SMTP)
 * and generates WhatsApp Click-to-Chat URL
 */
export async function executeRsvpDispatch(params: {
  invitationId: string;
  slug: string;
  title: string;
  weddingDate?: Date | string | null;
  email: string;
  whatsapp: string;
  origin?: string;
  is12HrNotice?: boolean;
}) {
  const {
    invitationId,
    slug,
    title,
    weddingDate,
    email,
    whatsapp,
    origin = "https://wedding-platform-one-lilac.vercel.app",
    is12HrNotice = false,
  } = params;

  const rsvps = await getRsvpsForInvitation(invitationId);
  const stats = computeRsvpStats(rsvps);
  const csvContent = buildRsvpCsv(rsvps, title);

  const formattedWeddingDate = weddingDate
    ? new Date(weddingDate).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "full",
        timeStyle: "short",
      })
    : "Upcoming Wedding";

  const downloadUrl = `${origin}/api/rsvp?export=csv&invitationId=${invitationId}`;
  const whatsappNumber = formatWhatsAppNumber(whatsapp);
  const whatsappMessage = buildWhatsAppMessage({
    weddingTitle: title,
    weddingDateStr: formattedWeddingDate,
    stats,
    downloadUrl,
    is12HrNotice,
  });

  const whatsappUrl = whatsappNumber
    ? `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
        whatsappMessage
      )}`
    : "";

  let emailDeliveryStatus = "SIMULATED_SUCCESS";
  let emailDeliveryMessage = `RSVP CSV (${rsvps.length} guests) prepared for dispatch to ${email}`;

  // If RESEND_API_KEY is configured in environment, send real email with CSV attachment
  if (process.env.RESEND_API_KEY && email) {
    try {
      const csvBase64 = Buffer.from(csvContent, "utf-8").toString("base64");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Wedding Platform <rsvp@resend.dev>",
          to: [email],
          subject: `${is12HrNotice ? "⏰ [12-Hour Notice] " : ""}RSVP Guest List Report - ${title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1F2937; padding: 20px;">
              <div style="background: #FFFBEB; border: 1px solid #F59E0B; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
                <h1 style="color: #92400E; margin: 0 0 10px 0; font-size: 22px;">${is12HrNotice ? "⏰ 12 Hours Until Wedding" : "📋 Wedding RSVP Report"}</h1>
                <h2 style="color: #B45309; margin: 0; font-size: 18px;">${title}</h2>
                <p style="color: #78350F; margin: 8px 0 0 0; font-size: 14px;"><strong>Wedding Date:</strong> ${formattedWeddingDate}</p>
              </div>

              <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: #111827;">Attendance Summary</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr><td style="padding: 6px 0;"><strong>Total Responses:</strong></td><td style="text-align: right;">${stats.totalResponses}</td></tr>
                  <tr><td style="padding: 6px 0;"><strong>Attending Parties:</strong></td><td style="text-align: right; color: #059669; font-weight: bold;">${stats.attendingCount}</td></tr>
                  <tr><td style="padding: 6px 0;"><strong>Total Guest Headcount:</strong></td><td style="text-align: right; font-weight: bold;">${stats.totalHeadcount}</td></tr>
                  <tr><td style="padding: 6px 0;"><strong>Declined:</strong></td><td style="text-align: right; color: #DC2626;">${stats.notAttendingCount}</td></tr>
                  <tr><td style="padding: 6px 0;"><strong>Vegetarian:</strong></td><td style="text-align: right;">${stats.vegCount}</td></tr>
                  <tr><td style="padding: 6px 0;"><strong>Non-Vegetarian:</strong></td><td style="text-align: right;">${stats.nonVegCount}</td></tr>
                  <tr><td style="padding: 6px 0;"><strong>Jain Food:</strong></td><td style="text-align: right;">${stats.jainCount}</td></tr>
                </table>
              </div>

              <div style="text-align: center; margin: 25px 0;">
                <a href="${downloadUrl}" style="background: #D97706; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">
                  📥 Download Complete RSVP CSV File
                </a>
              </div>

              <p style="font-size: 12px; color: #6B7280; text-align: center; margin-top: 30px;">
                The complete RSVP spreadsheet is also attached to this email as a CSV file.<br/>
                ForeverYours Wedding Invitation Platform
              </p>
            </div>
          `,
          attachments: [
            {
              filename: `RSVP-Guest-List-${slug}-${Date.now()}.csv`,
              content: csvBase64,
            },
          ],
        }),
      });

      if (res.ok) {
        emailDeliveryStatus = "DELIVERED";
        emailDeliveryMessage = `RSVP CSV successfully emailed to ${email}`;
      } else {
        const errorData = await res.json().catch(() => ({}));
        emailDeliveryStatus = "PROVIDER_ERROR";
        emailDeliveryMessage = `Email provider error: ${JSON.stringify(errorData)}`;
      }
    } catch (err: any) {
      emailDeliveryStatus = "SEND_FAILED";
      emailDeliveryMessage = `Email dispatch exception: ${err.message}`;
    }
  }

  // Update Settings in DB & in-memory store
  const nowIso = new Date().toISOString();
  try {
    await prisma.setting.upsert({
      where: {
        id: `dispatch-sent-${invitationId}`,
      },
      update: {
        value: nowIso,
      },
      create: {
        id: `dispatch-sent-${invitationId}`,
        invitationId,
        section: "rsvp_dispatch",
        key: "last_sent_at",
        value: nowIso,
      },
    });
  } catch (err) {
    console.warn("Could not upsert setting in DB:", err);
  }

  return {
    success: true,
    sentAt: nowIso,
    emailDeliveryStatus,
    emailDeliveryMessage,
    whatsappUrl,
    whatsappNumber,
    whatsappMessage,
    downloadUrl,
    stats,
    csvContent,
  };
}
