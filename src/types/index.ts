export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: "luxury" | "traditional" | "modern" | "floral" | "minimal" | "regional";
  previewImage: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    headingFont: string;
    envelopeStyle: "gold-foil" | "burgundy-velvet" | "emerald-royal" | "blush-floral" | "minimal-pearl" | "midnight-stars" | "marigold-festive" | "mysore-silk";
    motifType: "mandala" | "floral" | "peacock" | "geometric" | "temple" | "stars" | "abstract";
  };
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface InvitationWithRelations {
  id: string;
  slug: string;
  title: string;
  status: "DRAFT" | "PUBLISHED" | "UNPUBLISHED" | "ARCHIVED";
  templateId: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  headingFont: string;
  musicEnabled: boolean;
  musicUrl: string | null;
  musicTitle: string | null;
  weddingDate: Date | string | null;
  startTime: string | null;
  endTime: string | null;
  timeZone: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  couple?: {
    id: string;
    groomName: string;
    brideName: string;
    groomPhoto: string | null;
    bridePhoto: string | null;
    couplePhoto: string | null;
    introduction: string | null;
    story: string | null;
    familyMessage: string | null;
    familyNames: string | null;
  } | null;
  events: Array<{
    id: string;
    name: string;
    date: Date | string;
    startTime: string;
    endTime: string | null;
    venueName: string;
    address: string;
    description: string | null;
    icon: string | null;
    imageUrl: string | null;
    sortOrder: number;
  }>;
  venue?: {
    id: string;
    venueName: string;
    fullAddress: string;
    city: string;
    state: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    googleMapsUrl: string;
  } | null;
  gallery: Array<{
    id: string;
    imageUrl: string;
    caption: string | null;
    sortOrder: number;
    isCover: boolean;
  }>;
  rsvps: Array<{
    id: string;
    guestName: string;
    phone: string;
    email: string | null;
    guestsCount: number;
    attending: boolean;
    foodPreference: string;
    message: string | null;
    createdAt: Date | string;
  }>;
  settings: Array<{
    id: string;
    section: string;
    key: string;
    value: string;
  }>;
  template?: {
    id: string;
    name: string;
    description: string;
    previewImage: string;
    category: string;
    configuration: string;
  } | null;
}
