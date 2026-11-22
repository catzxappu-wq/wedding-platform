import { format } from "date-fns";

export interface CalendarEventParams {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate?: Date;
}

function formatDateToICS(date: Date): string {
  // Format as YYYYMMDDTHHMMSSZ (UTC)
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function generateICSContent(event: CalendarEventParams): string {
  const startStr = formatDateToICS(event.startDate);
  // Default end time to 4 hours after start if not provided
  const endDate = event.endDate || new Date(event.startDate.getTime() + 4 * 60 * 60 * 1000);
  const endStr = formatDateToICS(endDate);
  const nowStr = formatDateToICS(new Date());
  const uid = `wedding-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@weddingplatform.com`;

  // Escape special chars for ICS
  const cleanSummary = event.title.replace(/[,;\\]/g, " ");
  const cleanDescription = event.description.replace(/\n/g, "\\n").replace(/[,;\\]/g, " ");
  const cleanLocation = event.location.replace(/[,;\\]/g, " ");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation Management Platform//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanLocation}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function generateGoogleCalendarUrl(event: CalendarEventParams): string {
  const startStr = formatDateToICS(event.startDate);
  const endDate = event.endDate || new Date(event.startDate.getTime() + 4 * 60 * 60 * 1000);
  const endStr = formatDateToICS(endDate);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${startStr}/${endStr}`,
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
