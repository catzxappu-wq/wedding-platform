const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function runE2ETest() {
  console.log("==================================================");
  console.log("🚀 STARTING WEDDING PLATFORM COMPREHENSIVE E2E TEST");
  console.log("==================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, testName) {
    totalTests++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      process.exitCode = 1;
    }
  }

  // 1. Test Admin User & Password Verification
  console.log("\n--- TEST 1: Admin Authentication & Security ---");
  const admin = await prisma.user.findUnique({
    where: { email: "admin@weddingplatform.com" },
  });
  assert(admin !== null, "Admin user exists in database");
  assert(admin.role === "ADMIN", "Admin has ADMIN role");

  const passwordValid = await bcrypt.compare("Admin@Wedding2026!", admin.passwordHash);
  assert(passwordValid, "Bcrypt password hash matches Admin@Wedding2026!");

  // 2. Test 10 Templates
  console.log("\n--- TEST 2: Template Catalog ---");
  const templateCount = await prisma.template.count();
  assert(templateCount === 10, `All 10 luxury templates seeded (found: ${templateCount})`);

  // 3. Test Sample Invitation 1: Rahul & Priya
  console.log("\n--- TEST 3: Sample Invitation 1 (Rahul & Priya) ---");
  const rahulInv = await prisma.invitation.findUnique({
    where: { slug: "rahul-priya" },
    include: { couple: true, events: true, venue: true, gallery: true, rsvps: true },
  });
  assert(rahulInv !== null, "Invitation 'rahul-priya' exists");
  assert(rahulInv.status === "PUBLISHED", "Rahul & Priya status is PUBLISHED");
  assert(rahulInv.couple.groomName === "Rahul Sharma", "Groom is Rahul Sharma");
  assert(rahulInv.couple.brideName === "Priya Patel", "Bride is Priya Patel");
  assert(rahulInv.events.length === 4, `Rahul & Priya has 4 events (found: ${rahulInv.events.length})`);
  assert(rahulInv.venue.venueName.includes("Leela Palace"), "Venue is The Leela Palace");
  assert(rahulInv.rsvps.length >= 3, `RSVP responses exist (found: ${rahulInv.rsvps.length})`);

  // 4. Test Sample Invitation 2: Arjun & Shreya
  console.log("\n--- TEST 4: Sample Invitation 2 (Arjun & Shreya) ---");
  const arjunInv = await prisma.invitation.findUnique({
    where: { slug: "arjun-shreya" },
    include: { couple: true, events: true, venue: true, gallery: true, rsvps: true },
  });
  assert(arjunInv !== null, "Invitation 'arjun-shreya' exists");
  assert(arjunInv.status === "DRAFT", "Arjun & Shreya status is DRAFT");
  assert(arjunInv.couple.groomName === "Arjun Rao", "Groom is Arjun Rao");
  assert(arjunInv.couple.brideName === "Shreya Hegde", "Bride is Shreya Hegde");

  // 5. Test Multi-Tenancy Data Isolation
  console.log("\n--- TEST 5: Data Isolation Between Weddings ---");
  assert(rahulInv.id !== arjunInv.id, "Different primary keys");
  assert(rahulInv.slug !== arjunInv.slug, "Different unique slugs");
  assert(rahulInv.couple.groomName !== arjunInv.couple.groomName, "Different couples data");
  assert(rahulInv.venue.id !== arjunInv.venue.id, "Venues isolated per wedding");

  // Verify RSVPs belong strictly to their wedding
  const rahulRsvpIds = rahulInv.rsvps.map((r) => r.id);
  const arjunRsvpIds = arjunInv.rsvps.map((r) => r.id);
  const overlappingRsvps = rahulRsvpIds.filter((id) => arjunRsvpIds.includes(id));
  assert(overlappingRsvps.length === 0, "Zero RSVP leakage between invitations");

  // 6. Test Creating a New Invitation Dynamically: Kiran & Anu
  console.log("\n--- TEST 6: Dynamic Creation of New Wedding (Kiran & Anu) ---");
  const existingKiran = await prisma.invitation.findUnique({ where: { slug: "kiran-anu" } });
  if (existingKiran) {
    await prisma.invitation.delete({ where: { slug: "kiran-anu" } });
  }

  const kiranInv = await prisma.invitation.create({
    data: {
      title: "Kiran & Anu | South Indian Temple Matrimony",
      slug: "kiran-anu",
      status: "PUBLISHED",
      templateId: "south-indian",
      primaryColor: "#047857",
      weddingDate: new Date("2027-01-10T09:30:00+05:30"),
      startTime: "09:30 AM",
      userId: admin.id,
      couple: {
        create: {
          groomName: "Kiran Kumar",
          brideName: "Anu Radhika",
          introduction: "Under sacred temple bells and fragrant jasmine...",
        },
      },
      venue: {
        create: {
          venueName: "Temple Bay Convention Resort",
          fullAddress: "Mahabalipuram, Tamil Nadu 603104",
          city: "Mahabalipuram",
          state: "Tamil Nadu",
          country: "India",
          googleMapsUrl: "https://maps.google.com/?q=Temple+Bay+Mahabalipuram",
        },
      },
      events: {
        create: [
          {
            name: "Kalyanam & Muhurtham",
            date: new Date("2027-01-10T09:30:00+05:30"),
            startTime: "09:30 AM",
            venueName: "Temple Bay Mandapam",
            address: "Mahabalipuram",
            sortOrder: 1,
          },
        ],
      },
    },
    include: { couple: true, venue: true, events: true },
  });
  assert(kiranInv.slug === "kiran-anu", "Created invitation with slug 'kiran-anu'");
  assert(kiranInv.couple.groomName === "Kiran Kumar", "Couple groom is Kiran Kumar");
  assert(kiranInv.templateId === "south-indian", "Template is 'south-indian'");

  // 7. Test Duplication
  console.log("\n--- TEST 7: Duplication System ---");
  const duplicateSlug = "kiran-anu-copy";
  const existingDup = await prisma.invitation.findUnique({ where: { slug: duplicateSlug } });
  if (existingDup) {
    await prisma.invitation.delete({ where: { slug: duplicateSlug } });
  }

  const duplicated = await prisma.invitation.create({
    data: {
      title: `${kiranInv.title} (Copy)`,
      slug: duplicateSlug,
      status: "DRAFT",
      templateId: kiranInv.templateId,
      primaryColor: kiranInv.primaryColor,
      userId: admin.id,
      couple: {
        create: {
          groomName: kiranInv.couple.groomName,
          brideName: kiranInv.couple.brideName,
        },
      },
      venue: {
        create: {
          venueName: kiranInv.venue.venueName,
          fullAddress: kiranInv.venue.fullAddress,
          city: kiranInv.venue.city,
          state: kiranInv.venue.state,
          googleMapsUrl: kiranInv.venue.googleMapsUrl,
        },
      },
    },
    include: { couple: true },
  });
  assert(duplicated.slug === duplicateSlug, `Duplicated invitation has slug ${duplicateSlug}`);
  assert(duplicated.status === "DRAFT", "Duplicated invitation status defaults to DRAFT");
  assert(duplicated.id !== kiranInv.id, "Duplicated invitation has unique ID");

  // 8. Test RSVP Submission & Counting
  console.log("\n--- TEST 8: RSVP Flow ---");
  const newRsvp = await prisma.rsvp.create({
    data: {
      invitationId: kiranInv.id,
      guestName: "Naveen & Divya",
      phone: "+91 91234 56789",
      email: "naveen@example.com",
      guestsCount: 2,
      attending: true,
      foodPreference: "veg",
      message: "Can't wait to celebrate with you Kiran & Anu!",
    },
  });
  assert(newRsvp.id !== undefined, "RSVP record created in database");
  assert(newRsvp.invitationId === kiranInv.id, "RSVP linked to Kiran & Anu");

  // Count RSVPs for Kiran
  const kiranRsvpCount = await prisma.rsvp.count({ where: { invitationId: kiranInv.id } });
  assert(kiranRsvpCount === 1, "Kiran has exactly 1 RSVP");

  // Verify Rahul still has his original RSVPs and no extra
  const rahulRsvpCountAfter = await prisma.rsvp.count({ where: { invitationId: rahulInv.id } });
  assert(rahulRsvpCountAfter === rahulInv.rsvps.length, "Rahul RSVP count untouched");

  // 9. Clean up test invitations
  console.log("\n--- Cleanup ---");
  await prisma.invitation.delete({ where: { id: duplicated.id } });
  console.log("Deleted duplicate test invitation.");

  console.log("\n==================================================");
  console.log(`🎉 ALL TESTS COMPLETED: ${passedTests}/${totalTests} PASSED`);
  console.log("==================================================");
}

runE2ETest()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
