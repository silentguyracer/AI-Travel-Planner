import { TripPlan } from '@/types/travel';

export function generateICS(trip: TripPlan, startDate: Date = new Date()): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const formatDate = (date: Date) => {
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(
      date.getUTCHours()
    )}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
  };

  const escapeICS = (str: string) => {
    return str.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WanderAI//AI Travel Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICS(`${trip.destination} - ${trip.duration} Day Trip`)}`,
    'X-WR-TIMEZONE:UTC',
  ];

  trip.itinerary.forEach((day) => {
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + (day.day - 1));

    day.schedule.forEach((activity, actIdx) => {
      // Estimate start hour based on time slot
      let startHour = 9;
      let startMinute = 0;
      if (activity.timeSlot === 'Afternoon') startHour = 13;
      if (activity.timeSlot === 'Evening') startHour = 18;
      if (activity.timeSlot === 'Night') startHour = 21;

      // Try parsing time string if present (e.g., "09:00 AM")
      const timeMatch = activity.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        let h = parseInt(timeMatch[1], 10);
        startMinute = parseInt(timeMatch[2], 10) || 0;
        const isPM = timeMatch[3].toUpperCase() === 'PM';
        if (isPM && h < 12) h += 12;
        if (!isPM && h === 12) h = 0;
        startHour = h;
      }

      const eventStart = new Date(dayDate);
      eventStart.setHours(startHour, startMinute, 0, 0);

      const eventEnd = new Date(eventStart);
      eventEnd.setHours(startHour + 2, startMinute, 0, 0);

      const uid = `wanderai-${trip.id}-d${day.day}-a${actIdx}@wanderai.app`;

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(eventStart)}`,
        `DTEND:${formatDate(eventEnd)}`,
        `SUMMARY:${escapeICS(`[Day ${day.day}] ${activity.activity}`)}`,
        `DESCRIPTION:${escapeICS(`${activity.description}\n\nCost: ${activity.cost}\nTip: ${activity.tip}`)}`,
        `LOCATION:${escapeICS(`${activity.locationName}, ${trip.destination}`)}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });
  });

  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
}

export function downloadCalendarICS(trip: TripPlan, startDate?: Date): void {
  const icsData = generateICS(trip, startDate);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.setAttribute('download', `${trip.destination.toLowerCase().replace(/[^a-z0-9]/g, '_')}_itinerary.ics`);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function generateGoogleCalendarUrl(params: {
  title: string;
  details: string;
  location: string;
  startDate: Date;
  durationHours?: number;
}): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatGDate = (d: Date) => {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };

  const startStr = formatGDate(params.startDate);
  const endDate = new Date(params.startDate.getTime() + (params.durationHours || 2) * 60 * 60 * 1000);
  const endStr = formatGDate(endDate);

  const query = new URLSearchParams({
    action: 'TEMPLATE',
    text: params.title,
    dates: `${startStr}/${endStr}`,
    details: params.details,
    location: params.location,
  });

  return `https://calendar.google.com/calendar/render?${query.toString()}`;
}

