const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process...");

  // 1. Seed Admin User
  const passwordHash = await bcrypt.hash("Admin@Wedding2026!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@weddingplatform.com" },
    update: {},
    create: {
      name: "Platform Administrator",
      email: "admin@weddingplatform.com",
      passwordHash: passwordHash,
      role: "ADMIN",
    },
  });
  console.log("Admin user seeded:", admin.email);

  // 2. Seed 10 Luxury Templates
  const templates = [
    {
      id: "royal-gold",
      name: "Royal Gold",
      description: "Palatial Indian royalty with shimmering gold foil accents, regal ivory cream, and intricate mandala borders.",
      category: "luxury",
      previewImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      configuration: JSON.stringify({
        primaryColor: "#B8972E",
        secondaryColor: "#58111A",
        accentColor: "#D4AF37",
        backgroundColor: "#FAF7F2",
        textColor: "#1F2937",
        fontFamily: "Cinzel",
        headingFont: "Cinzel",
        envelopeStyle: "gold-foil",
      }),
    },
    {
      id: "black-gold",
      name: "Black & Gold Luxury",
      description: "Deep obsidian velvet backdrop paired with burnished metallic gold and high-fashion serif typography.",
      category: "luxury",
      previewImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      configuration: JSON.stringify({
        primaryColor: "#D4AF37",
        secondaryColor: "#111827",
        accentColor: "#F59E0B",
        backgroundColor: "#0B0F17",
        textColor: "#F3F4F6",
        fontFamily: "Cinzel",
        headingFont: "Cinzel",
        envelopeStyle: "gold-foil",
      }),
    },
    {
      id: "floral-romance",
      name: "Floral Romance",
      description: "Botanical elegance featuring watercolored English roses, sage eucalyptus vines, and soft rose-gold hues.",
      category: "floral",
      previewImage: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80",
      configuration: JSON.stringify({
        primaryColor: "#C05671",
        secondaryColor: "#4A6B53",
        accentColor: "#E098A8",
        backgroundColor: "#FDF8F9",
        textColor: "#2D3748",
        fontFamily: "Playfair Display",
        headingFont: "Playfair Display",
        envelopeStyle: "blush-floral",
      }),
    },
    {
      id: "minimal-chic",
      name: "Minimal Chic",
      description: "Architectural modernism with generous negative space, crisp typography, and understated monochromatic warmth.",
      category: "minimal",
      previewImage: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
      configuration: JSON.stringify({
        primaryColor: "#27272A",
        secondaryColor: "#71717A",
        accentColor: "#A1A1AA",
        backgroundColor: "#FFFFFF",
        textColor: "#18181B",
        fontFamily: "Inter",
        headingFont: "Cinzel",
        envelopeStyle: "minimal-pearl",
      }),
    },
    {
      id: "pastel-dream",
      name: "Pastel Dream",
      description: "Ethereal blend of soft lavender, powder blue, and peach sunsets with delicate glassmorphic elements.",
      category: "modern",
      previewImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
      configuration: JSON.stringify({
        primaryColor: "#8B5CF6",
        secondaryColor: "#EC4899",
        accentColor: "#F472B6",
        backgroundColor: "#FDF4FF",
        textColor: "#374151",
        fontFamily: "Cormorant Garamond",
        headingFont: "Playfair Display",
        envelopeStyle: "blush-floral",
      }),
    },
    {
      id: "traditional-indian",
      name: "Traditional Indian",
      description: "Auspicious wedding splendour featuring vermilion red, sacred turmeric yellow, peacock motifs, and shloka accents.",
      category: "traditional",
      previewImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
      configuration: JSON.stringify({
        primaryColor: "#B91C1C",
        secondaryColor: "#D97706",
        accentColor: "#F59E0B",
        backgroundColor: "#FFFBEB",
        textColor: "#451A03",
        fontFamily: "Cinzel",
        headingFont: "Cinzel",
        envelopeStyle: "marigold-festive",
      }),
    },
    {
      id: "marigold-palace",
      name: "Royal Marigold & Rani Pink",
      description: "Vibrant Rajasthani palace celebration featuring radiant marigold orange, royal rani pink, shehnai melodies, and festive floral jaali arches.",
      category: "traditional",
      previewImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      configuration: JSON.stringify({
        primaryColor: "#BE185D",
        secondaryColor: "#EA580C",
        accentColor: "#F59E0B",
        backgroundColor: "#FFFDF5",
        textColor: "#500724",
        fontFamily: "Cinzel",
        headingFont: "Cinzel",
        envelopeStyle: "marigold-festive",
      }),
    },
    {
      id: "south-indian",
      name: "South Indian Heritage",
      description: "Kanjivaram silk saree inspiration with banana leaf greens, rich temple gopuram borders, and sacred jasmine garlands.",
      category: "regional",
      previewImage: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
      configuration: JSON.stringify({
        primaryColor: "#047857",
        secondaryColor: "#B45309",
        accentColor: "#FCD34D",
        backgroundColor: "#F0FDF4",
        textColor: "#064E3B",
        fontFamily: "Marcellus",
        headingFont: "Cinzel",
        envelopeStyle: "emerald-royal",
      }),
    },
    {
      id: "kannada-wedding",
      name: "Kannada Wedding",
      description: "Classic Karnataka wedding tribute with Hoysala stone carving motifs, Mysore silk royal red, and sandalwood tones.",
      category: "regional",
      previewImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      configuration: JSON.stringify({
        primaryColor: "#991B1B",
        secondaryColor: "#78350F",
        accentColor: "#EAB308",
        backgroundColor: "#FEFCE8",
        textColor: "#3F2A1D",
        fontFamily: "Cinzel",
        headingFont: "Cinzel",
        envelopeStyle: "mysore-silk",
      }),
    },
    {
      id: "modern-editorial",
      name: "Modern Editorial",
      description: "Vogue-inspired wedding magazine style with sleek black typography, editorial framing, and cinematic romance.",
      category: "modern",
      previewImage: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
      configuration: JSON.stringify({
        primaryColor: "#09090B",
        secondaryColor: "#71717A",
        accentColor: "#27272A",
        backgroundColor: "#FAFAFA",
        textColor: "#09090B",
        fontFamily: "Inter",
        headingFont: "Playfair Display",
        envelopeStyle: "minimal-pearl",
      }),
    },
    {
      id: "premium-dark",
      name: "Premium Dark",
      description: "Midnight starlight aesthetic with deep sapphire blue, cosmic constellation sparkles, and platinum silver accents.",
      category: "luxury",
      previewImage: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80",
      configuration: JSON.stringify({
        primaryColor: "#60A5FA",
        secondaryColor: "#818CF8",
        accentColor: "#E0E7FF",
        backgroundColor: "#030712",
        textColor: "#F9FAFB",
        fontFamily: "Cinzel",
        headingFont: "Cinzel",
        envelopeStyle: "midnight-stars",
      }),
    },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }
  console.log("Seeded 10 Templates successfully.");

  // 3. Seed Sample Invitation 1: Rahul & Priya (PUBLISHED)
  const existingRahul = await prisma.invitation.findUnique({
    where: { slug: "rahul-priya" },
  });

  if (existingRahul) {
    await prisma.invitation.delete({ where: { slug: "rahul-priya" } });
  }

  const rahulInvite = await prisma.invitation.create({
    data: {
      slug: "rahul-priya",
      title: "Rahul & Priya | The Royal Union",
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
      musicTitle: "Shehnai & Royal Sitar Raga",
      musicUrl: "https://actions.google.com/sounds/v1/ambiences/outdoor_festival.ogg",
      weddingDate: new Date("2026-12-18T10:30:00+05:30"),
      startTime: "10:30 AM",
      endTime: "10:00 PM",
      timeZone: "Asia/Kolkata",
      userId: admin.id,
      couple: {
        create: {
          groomName: "Rahul Sharma",
          brideName: "Priya Patel",
          groomPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
          bridePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
          couplePhoto: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
          introduction: "Two hearts, one beautiful journey. Together with their parents, Rahul & Priya invite you to celebrate the joyous union of their souls in eternal matrimony.",
          story: "From our first college coffee in Bengaluru to midnight walks in Cubbon Park and quiet sunsets in Coorg, our journey together has been pure magic. Now, surrounded by our beloved families and closest friends, we take our sacred seven vows.",
          familyMessage: "With the divine blessings of our ancestors and the endless love of our parents, Mr. & Mrs. Rajesh Sharma and Mr. & Mrs. Deepak Patel warmly invite you to grace this auspicious celebration.",
          familyNames: "The Sharma & Patel Families",
        },
      },
      venue: {
        create: {
          venueName: "The Leela Palace Bengaluru",
          fullAddress: "23, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560008",
          city: "Bengaluru",
          state: "Karnataka",
          country: "India",
          latitude: 12.9606,
          longitude: 77.6484,
          googleMapsUrl: "https://maps.google.com/?q=The+Leela+Palace+Bengaluru",
        },
      },
      events: {
        create: [
          {
            name: "Haldi & Phoolon Ki Holi",
            date: new Date("2026-12-16T10:00:00+05:30"),
            startTime: "10:00 AM",
            endTime: "01:00 PM",
            venueName: "The Royal Gardens, Leela Palace",
            address: "HAL Old Airport Rd, Bengaluru",
            description: "A burst of auspicious turmeric, marigold petals, singing, and joy as we prepare the bride and groom.",
            icon: "Sun",
            imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
            sortOrder: 1,
          },
          {
            name: "Mehendi & Sangeet Gala",
            date: new Date("2026-12-17T18:30:00+05:30"),
            startTime: "06:30 PM",
            endTime: "11:30 PM",
            venueName: "Grand Ballroom, Leela Palace",
            address: "HAL Old Airport Rd, Bengaluru",
            description: "Intricate henna designs, electric dance performances, live dhol beats, and an exquisite dinner banquet.",
            icon: "Music",
            imageUrl: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=600&q=80",
            sortOrder: 2,
          },
          {
            name: "The Royal Wedding & Muhurtham",
            date: new Date("2026-12-18T10:30:00+05:30"),
            startTime: "10:30 AM",
            endTime: "02:00 PM",
            venueName: "The Grand Mandapam, Leela Palace",
            address: "HAL Old Airport Rd, Bengaluru",
            description: "The auspicious Saptapadi and wedding rituals under the sacred floral mandap, followed by traditional wedding feast.",
            icon: "Heart",
            imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
            sortOrder: 3,
          },
          {
            name: "Grand Reception & Dinner",
            date: new Date("2026-12-18T19:30:00+05:30"),
            startTime: "07:30 PM",
            endTime: "11:30 PM",
            venueName: "Palace Lawn & Courtyard",
            address: "HAL Old Airport Rd, Bengaluru",
            description: "An evening of fine dining, heartfelt toasts, champagne, and musical celebration with the newlyweds.",
            icon: "Sparkles",
            imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
            sortOrder: 4,
          },
        ],
      },
      gallery: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
            caption: "Our royal pre-wedding shoot at Bangalore Palace",
            sortOrder: 1,
            isCover: true,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            caption: "A quiet moment amidst the celebration",
            sortOrder: 2,
            isCover: false,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
            caption: "Golden hour promises and laughter",
            sortOrder: 3,
            isCover: false,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80",
            caption: "Intricate floral and mehendi details",
            sortOrder: 4,
            isCover: false,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
            caption: "Together under the starry sky",
            sortOrder: 5,
            isCover: false,
          },
        ],
      },
      rsvps: {
        create: [
          {
            guestName: "Aditya & Sneha Verma",
            phone: "+91 98765 43210",
            email: "aditya.verma@example.com",
            guestsCount: 2,
            attending: true,
            foodPreference: "veg",
            message: "Heartiest congratulations to our dearest Rahul and Priya! Cannot wait to dance at your Sangeet!",
          },
          {
            guestName: "Vikram Malhotra",
            phone: "+91 98123 45678",
            email: "vikram.m@example.com",
            guestsCount: 1,
            attending: true,
            foodPreference: "non-veg",
            message: "Wishing you both a lifetime of happiness, health, and adventure!",
          },
          {
            guestName: "Meera & Siddharth Deshmukh",
            phone: "+91 97654 32109",
            email: "meera.d@example.com",
            guestsCount: 3,
            attending: true,
            foodPreference: "jain",
            message: "Blessings and best wishes to the lovely couple from all of us in Pune.",
          },
          {
            guestName: "Rohan Kapoor",
            phone: "+91 99887 76655",
            email: "rohan.k@example.com",
            guestsCount: 1,
            attending: false,
            foodPreference: "veg",
            message: "So sorry to miss the big day due to overseas travel, but sending all my love!",
          },
        ],
      },
    },
  });
  console.log("Seeded Invitation 1: Rahul & Priya (slug: rahul-priya, status: PUBLISHED)");

  // 4. Seed Sample Invitation 2: Arjun & Shreya (DRAFT)
  const existingArjun = await prisma.invitation.findUnique({
    where: { slug: "arjun-shreya" },
  });

  if (existingArjun) {
    await prisma.invitation.delete({ where: { slug: "arjun-shreya" } });
  }

  const arjunInvite = await prisma.invitation.create({
    data: {
      slug: "arjun-shreya",
      title: "Arjun & Shreya | A Celebration of Love",
      status: "DRAFT",
      templateId: "kannada-wedding",
      primaryColor: "#991B1B",
      secondaryColor: "#78350F",
      accentColor: "#EAB308",
      backgroundColor: "#FEFCE8",
      textColor: "#3F2A1D",
      fontFamily: "Cinzel",
      headingFont: "Cinzel",
      musicEnabled: true,
      musicTitle: "Mysore Palace Instrumental Raga",
      weddingDate: new Date("2026-12-25T11:00:00+05:30"),
      startTime: "11:00 AM",
      endTime: "09:00 PM",
      timeZone: "Asia/Kolkata",
      userId: admin.id,
      couple: {
        create: {
          groomName: "Arjun Rao",
          brideName: "Shreya Hegde",
          groomPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
          bridePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
          couplePhoto: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
          introduction: "A timeless bond rooted in Karnataka traditions and modern dreams. Join Arjun and Shreya as they step into their new beginning.",
          story: "Our paths crossed during a temple festival in coastal Udupi, and what started as friendly banter evolved into an unbreakable partnership for life.",
          familyMessage: "Warmly invited by the Rao and Hegde families with traditional prayers for good fortune and prosperity.",
          familyNames: "The Rao & Hegde Families",
        },
      },
      venue: {
        create: {
          venueName: "Palace Grounds, Sheesh Mahal",
          fullAddress: "Jayachamaraja Wadiyar Golf Club Rd, Bellary Rd, Bengaluru, Karnataka 560006",
          city: "Bengaluru",
          state: "Karnataka",
          country: "India",
          latitude: 12.9988,
          longitude: 77.5921,
          googleMapsUrl: "https://maps.google.com/?q=Palace+Grounds+Bengaluru",
        },
      },
      events: {
        create: [
          {
            name: "Nandi Puja & Haldi",
            date: new Date("2026-12-24T09:00:00+05:30"),
            startTime: "09:00 AM",
            endTime: "12:30 PM",
            venueName: "Sheesh Mahal Courtyard",
            address: "Bellary Rd, Bengaluru",
            description: "Traditional auspicious Nandi prayers followed by Haldi ceremony.",
            icon: "Sun",
            sortOrder: 1,
          },
          {
            name: "Dhare Muhurtham",
            date: new Date("2026-12-25T11:00:00+05:30"),
            startTime: "11:00 AM",
            endTime: "01:30 PM",
            venueName: "Main Kalyana Mantapa",
            address: "Bellary Rd, Bengaluru",
            description: "Traditional Kannada wedding rituals, Kanyadaan and Dhare ceremony with traditional lunch.",
            icon: "Heart",
            sortOrder: 2,
          },
        ],
      },
      gallery: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
            caption: "Temple bells and wedding vibes",
            sortOrder: 1,
            isCover: true,
          },
        ],
      },
      rsvps: {
        create: [
          {
            guestName: "Kavya Murthy",
            phone: "+91 99112 23344",
            email: "kavya.m@example.com",
            guestsCount: 2,
            attending: true,
            foodPreference: "veg",
            message: "Congratulations Arjun & Shreya! So excited for the wedding!",
          },
        ],
      },
    },
  });
  console.log("Seeded Invitation 2: Arjun & Shreya (slug: arjun-shreya, status: DRAFT)");

  // 3c. Seed Shrinivas & Meghashree (PUBLISHED)
  const existingShrinivas = await prisma.invitation.findUnique({
    where: { slug: "shrinivas-meghashree" },
  });

  if (existingShrinivas) {
    await prisma.invitation.delete({ where: { slug: "shrinivas-meghashree" } });
  }

  await prisma.invitation.create({
    data: {
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
      musicTitle: "Royal Shehnai & Sitar Harmony",
      musicUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=indian-flute-and-sitar-10492.mp3",
      weddingDate: new Date("2026-12-18T10:30:00+05:30"),
      startTime: "10:30 AM",
      endTime: "10:00 PM",
      timeZone: "Asia/Kolkata",
      userId: admin.id,
      couple: {
        create: {
          groomName: "Shrinivas",
          brideName: "Meghashree",
          groomPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
          bridePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
          couplePhoto: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
          introduction: "Two hearts, two souls, woven into one eternal journey of love and joy. We warmly invite you to celebrate our sacred wedding union. • ಎರಡು ಮನಸ್ಸುಗಳ ಮಿಲನ, ನೂರು ಕಾಲದ ಪ್ರೀತಿಯ ಬಾಂಧವ್ಯ. ನಮ್ಮ ವಿವಾಹ ಮಹೋತ್ಸವಕ್ಕೆ ತಮಗೆಲ್ಲರಿಗೂ ಪ್ರೀತಿಯ ಆದರದ ಸುಸ್ವಾಗತ.",
          story: "A journey of shared smiles, unwavering support, and endless love leading to this beautiful, auspicious milestone. • ಪರಸ್ಪರ ಪ್ರೀತಿ, ಗೌರವ ಹಾಗೂ ನಂಬಿಕೆಯೊಂದಿಗೆ ಜೊತೆಯಾಗಿ ಸಾಗಿದ ಪಯಣ ಇಂದು ಶುಭ ವಿವಾಹದ ಪವಿತ್ರ ಘಟ್ಟಕ್ಕೆ ತಲುಪಿದೆ.",
          familyMessage: "With the loving blessings of our parents and elders, we request the honour of your presence at our wedding festivities. • ಗುರು-ಹಿರಿಯರ ಹಾಗೂ ತಂದೆ-ತಾಯಿಗಳ ಕೃಪಾಶೀರ್ವಾದಗಳೊಂದಿಗೆ, ನಮ್ಮ ಈ ಶುಭ ಸಮಾರಂಭಕ್ಕೆ ತಾವು ಸಕುಟುಂಬ ಸಮೇತರಾಗಿ ಆಗಮಿಸಿ ನವದಂಪತಿಗಳನ್ನು ಆಶೀರ್ವದಿಸಬೇಕಾಗಿ ವಿನಮ್ರ ಪ್ರಾರ್ಥನೆ.",
          familyNames: "The Family & Elders • ಕುಟುಂಬಸ್ಥರು ಹಾಗೂ ಬಂಧು-ಮಿತ್ರರು",
        },
      },
      venue: {
        create: {
          venueName: "The Grand Heritage Mandapam",
          fullAddress: "The Leela Palace, 23 HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560008",
          city: "Bengaluru",
          state: "Karnataka",
          country: "India",
          latitude: 12.9606,
          longitude: 77.6484,
          googleMapsUrl: "https://maps.google.com/?q=The+Leela+Palace+Bengaluru",
        },
      },
      events: {
        create: [
          {
            name: "Haldi & Mehendi Celebration",
            date: new Date("2026-12-16T10:00:00+05:30"),
            startTime: "10:00 AM",
            endTime: "02:00 PM",
            venueName: "The Royal Courtyard",
            address: "The Leela Palace, Bengaluru",
            description: "Auspicious turmeric blessings, intricate henna designs, live folk music, and joyous celebration.",
            icon: "Sun",
            imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
            sortOrder: 1,
          },
          {
            name: "Sangeet & Dance Night",
            date: new Date("2026-12-17T18:30:00+05:30"),
            startTime: "06:30 PM",
            endTime: "11:30 PM",
            venueName: "Grand Ballroom",
            address: "The Leela Palace, Bengaluru",
            description: "An energetic evening of choreography, dhol beats, family performances, and culinary delights.",
            icon: "Music",
            imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
            sortOrder: 2,
          },
          {
            name: "Auspicious Muhurtham & Saat Phere",
            date: new Date("2026-12-18T10:30:00+05:30"),
            startTime: "10:30 AM",
            endTime: "01:30 PM",
            venueName: "The Grand Mandapam",
            address: "The Leela Palace, Bengaluru",
            description: "Sacred Vedic rituals, Kanyadaan, Mangalya Dharanam, and the seven eternal vows around the holy fire.",
            icon: "Heart",
            imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
            sortOrder: 3,
          },
          {
            name: "Grand Reception Gala",
            date: new Date("2026-12-18T19:30:00+05:30"),
            startTime: "07:30 PM",
            endTime: "11:30 PM",
            venueName: "Palace Lawn & Courtyard",
            address: "The Leela Palace, Bengaluru",
            description: "An elaborate banquet dinner, cake cutting, toasts, classical fusion music, and celebrations.",
            icon: "Sparkles",
            imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
            sortOrder: 4,
          },
        ],
      },
      gallery: {
        create: [
          {
            imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
            caption: "Royal Pre-Wedding Portrait",
            sortOrder: 1,
            isCover: true,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            caption: "Cherished moments of togetherness",
            sortOrder: 2,
            isCover: false,
          },
          {
            imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
            caption: "Golden hour promises under Bengaluru skies",
            sortOrder: 3,
            isCover: false,
          },
        ],
      },
    },
  });
  console.log("Seeded Invitation 3: Shrinivas & Meghashree (slug: shrinivas-meghashree, status: PUBLISHED)");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
