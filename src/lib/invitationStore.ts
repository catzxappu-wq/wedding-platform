import fs from "fs";
import path from "path";
import os from "os";
import { InvitationWithRelations } from "@/types";

const STORE_FILE = path.join(os.tmpdir(), "wedding_platform_invitations.json");

// Default seeded invitations so public demo links work out of the box even without database
const DEFAULT_INVITATIONS: InvitationWithRelations[] = [
  {
    id: "inv-rahul-priya",
    slug: "rahul-priya",
    title: "The Royal Wedding Celebration of Rahul & Priya",
    status: "PUBLISHED",
    templateId: "royal-gold",
    primaryColor: "#B8972E",
    secondaryColor: "#58111A",
    accentColor: "#D4AF37",
    backgroundColor: "#FAF7F2",
    textColor: "#1F2937",
    fontFamily: "Cinzel",
    headingFont: "Cinzel",
    musicEnabled: true,
    musicUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=indian-flute-and-sitar-10492.mp3",
    musicTitle: "Royal Shehnai & Sitar Melody",
    weddingDate: "2026-12-18T10:30:00.000Z",
    startTime: "10:30 AM",
    endTime: "10:00 PM",
    timeZone: "Asia/Kolkata",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    couple: {
      id: "couple-1",
      groomName: "Rahul Sharma",
      brideName: "Priya Patel",
      groomPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      bridePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      couplePhoto: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      introduction: "Two souls, two families, woven together into one grand celebration of eternal love.",
      story: "From serendipitous collegiate meetings to countless shared sunsets across Bangalore.",
      familyMessage: "With immense blessings from the Sharma and Patel families.",
      familyNames: "Mr. Rajesh & Mrs. Sunita Sharma • Mr. Vikram & Mrs. Meera Patel",
    },
    venue: {
      id: "venue-1",
      venueName: "The Leela Palace Ballroom",
      fullAddress: "23 HAL Airport Road, Kodihalli, Bengaluru, Karnataka 560008",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9606,
      longitude: 77.6484,
      googleMapsUrl: "https://maps.google.com/?q=The+Leela+Palace+Bengaluru",
    },
    events: [
      {
        id: "ev-1",
        name: "Mehendi & Sangeet Night",
        date: "2026-12-17T18:00:00.000Z",
        startTime: "06:00 PM",
        endTime: "11:30 PM",
        venueName: "The Royal Ballroom, The Leela Palace",
        address: "23 HAL Old Airport Road, Bengaluru",
        description: "An evening of vibrant henna, energetic dhol beats, family choreography, and culinary delights.",
        icon: "Music",
        imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
        sortOrder: 1,
      },
      {
        id: "ev-2",
        name: "Auspicious Muhurtham Ceremony",
        date: "2026-12-18T10:30:00.000Z",
        startTime: "10:30 AM",
        endTime: "01:30 PM",
        venueName: "Grand Heritage Mandapam",
        address: "The Leela Palace Grounds, Bengaluru",
        description: "The sacred traditional Vedic ceremony, Saat Phere, and blessings under the floral canopy.",
        icon: "Heart",
        imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
        sortOrder: 2,
      },
      {
        id: "ev-3",
        name: "Grand Gala Dinner Reception",
        date: "2026-12-18T19:30:00.000Z",
        startTime: "07:30 PM",
        endTime: "11:59 PM",
        venueName: "The Grand Courtyard Pavilion",
        address: "The Leela Palace, Bengaluru",
        description: "Cocktails, speeches, cake cutting, live classical fusion music, and an elaborate banquet.",
        icon: "Sparkles",
        imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
        sortOrder: 3,
      },
    ],
    gallery: [
      {
        id: "gal-1",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        caption: "Golden Sunset Pre-Wedding shoot",
        sortOrder: 1,
        isCover: true,
      },
      {
        id: "gal-2",
        imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
        caption: "Engagement Ring Exchange",
        sortOrder: 2,
        isCover: false,
      },
      {
        id: "gal-3",
        imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
        caption: "Traditional Attire Elegance",
        sortOrder: 3,
        isCover: false,
      },
    ],
    rsvps: [
      {
        id: "rsvp-1",
        guestName: "Ananya Deshmukh",
        phone: "+91 98765 43210",
        email: "ananya@example.com",
        guestsCount: 2,
        attending: true,
        foodPreference: "Vegetarian",
        message: "Heartfelt congratulations to the gorgeous couple! Can't wait!",
        createdAt: new Date().toISOString(),
      },
    ],
    settings: [],
  },
  {
    id: "inv-shrinivas-meghashree",
    slug: "shrinivas-meghashree",
    title: "Shrinivas & Meghashree | Wedding Celebration",
    status: "PUBLISHED",
    templateId: "traditional-indian",
    primaryColor: "#B91C1C",
    secondaryColor: "#D97706",
    accentColor: "#F59E0B",
    backgroundColor: "#FFFBEB",
    textColor: "#451A03",
    fontFamily: "Cinzel",
    headingFont: "Cinzel",
    musicEnabled: true,
    musicUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=indian-flute-and-sitar-10492.mp3",
    musicTitle: "Royal Shehnai & Sitar Harmony",
    weddingDate: "2026-12-18T10:30:00.000Z",
    startTime: "10:30 AM",
    endTime: "10:00 PM",
    timeZone: "Asia/Kolkata",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    couple: {
      id: "couple-shrinivas-meghashree",
      groomName: "Shrinivas",
      brideName: "Meghashree",
      groomPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      bridePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      couplePhoto: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
      introduction: "Two hearts, two souls, woven into one eternal journey of love and joy. We warmly invite you to celebrate our sacred wedding union. • ಎರಡು ಮನಸ್ಸುಗಳ ಮಿಲನ, ನೂರು ಕಾಲದ ಪ್ರೀತಿಯ ಬಾಂಧವ್ಯ. ನಮ್ಮ ವಿವಾಹ ಮಹೋತ್ಸವಕ್ಕೆ ತಮಗೆಲ್ಲರಿಗೂ ಪ್ರೀತಿಯ ಆದರದ ಸುಸ್ವಾಗತ.",
      story: "A journey of shared smiles, unwavering support, and endless love leading to this beautiful, auspicious milestone. • ಪರಸ್ಪರ ಪ್ರೀತಿ, ಗೌರವ ಹಾಗೂ ನಂಬಿಕೆಯೊಂದಿಗೆ ಜೊತೆಯಾಗಿ ಸಾಗಿದ ಪಯಣ ಇಂದು ಶುಭ ವಿವಾಹದ ಪವಿತ್ರ ಘಟ್ಟಕ್ಕೆ ತಲುಪಿದೆ.",
      familyMessage: "With the loving blessings of our parents and elders, we request the honour of your presence at our wedding festivities. • ಗುರು-ಹಿರಿಯರ ಹಾಗೂ ತಂದೆ-ತಾಯಿಗಳ ಕೃಪಾಶೀರ್ವಾದಗಳೊಂದಿಗೆ, ನಮ್ಮ ಈ ಶುಭ ಸಮಾರಂಭಕ್ಕೆ ತಾವು ಸಕುಟುಂಬ ಸಮೇತರಾಗಿ ಆಗಮಿಸಿ ನವದಂಪತಿಗಳನ್ನು ಆಶೀರ್ವದಿಸಬೇಕಾಗಿ ವಿನಮ್ರ ಪ್ರಾರ್ಥನೆ.",
      familyNames: "The Family & Elders • ಕುಟುಂಬಸ್ಥರು ಹಾಗೂ ಬಂಧು-ಮಿತ್ರರು",
    },
    venue: {
      id: "venue-shrinivas-meghashree",
      venueName: "The Grand Heritage Mandapam",
      fullAddress: "The Leela Palace, 23 HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560008",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      latitude: 12.9606,
      longitude: 77.6484,
      googleMapsUrl: "https://maps.google.com/?q=The+Leela+Palace+Bengaluru",
    },
    events: [
      {
        id: "ev-sm-1",
        name: "Haldi & Mehendi Celebration",
        date: "2026-12-16T10:00:00.000Z",
        startTime: "10:00 AM",
        endTime: "02:00 PM",
        venueName: "The Royal Courtyard",
        address: "The Leela Palace, Bengaluru",
        description: "Auspicious turmeric blessings, intricate henna designs, live folk music, and joyous celebration.",
        icon: "Sun",
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        sortOrder: 1,
      },
      {
        id: "ev-sm-2",
        name: "Sangeet & Dance Night",
        date: "2026-12-17T18:30:00.000Z",
        startTime: "06:30 PM",
        endTime: "11:30 PM",
        venueName: "Grand Ballroom",
        address: "The Leela Palace, Bengaluru",
        description: "An energetic evening of choreography, dhol beats, family performances, and culinary delights.",
        icon: "Music",
        imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
        sortOrder: 2,
      },
      {
        id: "ev-sm-3",
        name: "Auspicious Muhurtham & Saat Phere",
        date: "2026-12-18T10:30:00.000Z",
        startTime: "10:30 AM",
        endTime: "01:30 PM",
        venueName: "The Grand Mandapam",
        address: "The Leela Palace, Bengaluru",
        description: "Sacred Vedic rituals, Kanyadaan, Mangalya Dharanam, and the seven eternal vows around the holy fire.",
        icon: "Heart",
        imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
        sortOrder: 3,
      },
      {
        id: "ev-sm-4",
        name: "Grand Reception Gala",
        date: "2026-12-18T19:30:00.000Z",
        startTime: "07:30 PM",
        endTime: "11:30 PM",
        venueName: "Palace Lawn & Courtyard",
        address: "The Leela Palace, Bengaluru",
        description: "An elaborate banquet dinner, cake cutting, toasts, classical fusion music, and celebrations.",
        icon: "Sparkles",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
        sortOrder: 4,
      },
    ],
    gallery: [
      {
        id: "gal-sm-1",
        imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
        caption: "Royal Pre-Wedding Portrait",
        sortOrder: 1,
        isCover: true,
      },
      {
        id: "gal-sm-2",
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        caption: "Cherished moments of togetherness",
        sortOrder: 2,
        isCover: false,
      },
      {
        id: "gal-sm-3",
        imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
        caption: "Golden hour promises under Bengaluru skies",
        sortOrder: 3,
        isCover: false,
      },
    ],
    rsvps: [],
    settings: [],
  },
];

// Global in-memory cache to keep invitations alive across requests
declare global {
  // eslint-disable-next-line no-var
  var __weddingStore: Map<string, InvitationWithRelations> | undefined;
}

function initStore(): Map<string, InvitationWithRelations> {
  if (global.__weddingStore) {
    return global.__weddingStore;
  }

  const map = new Map<string, InvitationWithRelations>();

  // 1. Try reading from temporary JSON file
  try {
    if (fs.existsSync(STORE_FILE)) {
      const content = fs.readFileSync(STORE_FILE, "utf8");
      const list: InvitationWithRelations[] = JSON.parse(content);
      if (Array.isArray(list)) {
        list.forEach((item) => {
          if (item?.slug) map.set(item.slug.toLowerCase().trim(), item);
        });
      }
    }
  } catch (err) {
    console.warn("Could not read backup store file:", err);
  }

  // 2. Ensure defaults are populated if empty
  DEFAULT_INVITATIONS.forEach((item) => {
    if (!map.has(item.slug.toLowerCase().trim())) {
      map.set(item.slug.toLowerCase().trim(), item);
    }
  });

  global.__weddingStore = map;
  return map;
}

function persistToFile(map: Map<string, InvitationWithRelations>) {
  try {
    const list = Array.from(map.values());
    fs.writeFileSync(STORE_FILE, JSON.stringify(list, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not persist invitations to backup store:", err);
  }
}

export const invitationStore = {
  getInvitationBySlug(slug: string): InvitationWithRelations | null {
    const map = initStore();
    const clean = (slug || "").toLowerCase().trim();
    return map.get(clean) || null;
  },

  getInvitationById(id: string): InvitationWithRelations | null {
    const map = initStore();
    let found: InvitationWithRelations | null = null;
    map.forEach((item) => {
      if (item.id === id) found = item;
    });
    return found;
  },

  getAllInvitations(): InvitationWithRelations[] {
    const map = initStore();
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  saveInvitation(data: any): InvitationWithRelations {
    const map = initStore();
    const slug = (data.slug || `wedding-${Date.now()}`).toLowerCase().trim();
    const id = data.id || `inv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const record: InvitationWithRelations = {
      id,
      slug,
      title: data.title || `${data.couple?.groomName || "Groom"} & ${data.couple?.brideName || "Bride"}'s Wedding`,
      status: (data.status || "PUBLISHED") as any,
      templateId: data.templateId || "royal-gold",
      primaryColor: data.primaryColor || "#B8972E",
      secondaryColor: data.secondaryColor || "#58111A",
      accentColor: data.accentColor || "#D4AF37",
      backgroundColor: data.backgroundColor || "#FAF7F2",
      textColor: data.textColor || "#1F2937",
      fontFamily: data.fontFamily || "Cinzel",
      headingFont: data.headingFont || "Cinzel",
      musicEnabled: data.musicEnabled ?? true,
      musicTitle: data.musicTitle || "Royal Wedding Music",
      musicUrl: data.musicUrl || "",
      weddingDate: data.weddingDate || new Date().toISOString(),
      startTime: data.startTime || "10:30 AM",
      endTime: data.endTime || "10:00 PM",
      timeZone: data.timeZone || "Asia/Kolkata",
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      couple: data.couple
        ? {
            id: data.couple.id || `couple-${id}`,
            groomName: data.couple.groomName || "Groom",
            brideName: data.couple.brideName || "Bride",
            groomPhoto: data.couple.groomPhoto || null,
            bridePhoto: data.couple.bridePhoto || null,
            couplePhoto: data.couple.couplePhoto || null,
            introduction: data.couple.introduction || "Two hearts, one beautiful journey.",
            story: data.couple.story || null,
            familyMessage: data.couple.familyMessage || null,
            familyNames: data.couple.familyNames || null,
          }
        : null,
      venue: data.venue
        ? {
            id: data.venue.id || `venue-${id}`,
            venueName: data.venue.venueName || "Grand Ballroom",
            fullAddress: data.venue.fullAddress || "Bengaluru, Karnataka",
            city: data.venue.city || "Bengaluru",
            state: data.venue.state || "Karnataka",
            country: data.venue.country || "India",
            latitude: data.venue.latitude ? Number(data.venue.latitude) : null,
            longitude: data.venue.longitude ? Number(data.venue.longitude) : null,
            googleMapsUrl: data.venue.googleMapsUrl || "https://maps.google.com",
          }
        : null,
      events: Array.isArray(data.events)
        ? data.events.map((ev: any, idx: number) => ({
            id: ev.id || `ev-${id}-${idx}`,
            name: ev.name || "Ceremony",
            date: ev.date || data.weddingDate || new Date().toISOString(),
            startTime: ev.startTime || "10:00 AM",
            endTime: ev.endTime || null,
            venueName: ev.venueName || data.venue?.venueName || "Wedding Venue",
            address: ev.address || data.venue?.fullAddress || "",
            description: ev.description || "",
            icon: ev.icon || "Sparkles",
            imageUrl: ev.imageUrl || null,
            sortOrder: ev.sortOrder ?? idx,
          }))
        : [],
      gallery: Array.isArray(data.gallery)
        ? data.gallery.map((g: any, idx: number) => ({
            id: g.id || `gal-${id}-${idx}`,
            imageUrl: g.imageUrl,
            caption: g.caption || null,
            sortOrder: g.sortOrder ?? idx,
            isCover: g.isCover ?? idx === 0,
          }))
        : [],
      rsvps: Array.isArray(data.rsvps) ? data.rsvps : [],
      settings: Array.isArray(data.settings) ? data.settings : [],
    };

    map.set(slug, record);
    persistToFile(map);
    return record;
  },

  deleteInvitation(id: string): boolean {
    const map = initStore();
    let targetSlug: string | null = null;
    map.forEach((item, slug) => {
      if (item.id === id) targetSlug = slug;
    });
    if (targetSlug) {
      map.delete(targetSlug);
      persistToFile(map);
      return true;
    }
    return false;
  },

  addRsvp(slugOrId: string, rsvpData: any): boolean {
    const map = initStore();
    let target: InvitationWithRelations | undefined;

    map.forEach((item) => {
      if (item.id === slugOrId || item.slug.toLowerCase() === slugOrId.toLowerCase()) {
        target = item;
      }
    });

    if (!target) return false;

    const newRsvp = {
      id: `rsvp-${Date.now()}`,
      guestName: rsvpData.guestName || "Guest",
      phone: rsvpData.phone || "",
      email: rsvpData.email || null,
      guestsCount: Number(rsvpData.guestsCount) || 1,
      attending: Boolean(rsvpData.attending),
      foodPreference: rsvpData.foodPreference || "Vegetarian",
      message: rsvpData.message || null,
      createdAt: new Date().toISOString(),
    };

    target.rsvps = [newRsvp, ...(target.rsvps || [])];
    persistToFile(map);
    return true;
  },
};
