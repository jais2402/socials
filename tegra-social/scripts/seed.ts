import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local (Next.js convention) — dotenv/config only loads .env
config({ path: resolve(process.cwd(), ".env.local") });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { user, profiles, inviteCodes, session, account, verification } from "../src/lib/db/schema";

// ─── Standalone DB connection (not via lib/db — avoids Next.js env deps) ─────

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Error: DATABASE_URL is not set. Add it to .env.local");
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle({ client: sql });

// ─── Seed data ────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@tegrasocial.demo";

type DemoEmployee = {
  id: string;
  name: string;
  email: string;
  role: string;
  country: "India" | "Iceland";
  profile: {
    bio: string;
    interests: string[];
    funFact: string;
    favouriteFood: string;
    favouriteSport: string;
  };
};

const demoEmployees: DemoEmployee[] = [
  // ── India ──────────────────────────────────────────────────────────────
  {
    id: "demo-india-001",
    name: "Arjun Sharma",
    email: "arjun.sharma@tegrasocial.demo",
    role: "Software Engineer",
    country: "India",
    profile: {
      bio: "Full-stack developer passionate about building scalable systems. Coffee aficionado and weekend trekker.",
      interests: ["System Design", "Open Source", "Hiking", "Chess"],
      funFact: "I once trekked to Roopkund lake at 5029m in the Himalayas.",
      favouriteFood: "Biryani",
      favouriteSport: "Cricket",
    },
  },
  {
    id: "demo-india-002",
    name: "Priya Nair",
    email: "priya.nair@tegrasocial.demo",
    role: "Product Manager",
    country: "India",
    profile: {
      bio: "Product enthusiast bridging the gap between user needs and engineering realities. Former UX researcher.",
      interests: ["User Research", "Roadmapping", "Yoga", "Photography"],
      funFact: "I have photographed wildlife in 6 different national parks across India.",
      favouriteFood: "Kerala Sadya",
      favouriteSport: "Badminton",
    },
  },
  {
    id: "demo-india-003",
    name: "Vikram Reddy",
    email: "vikram.reddy@tegrasocial.demo",
    role: "DevOps Engineer",
    country: "India",
    profile: {
      bio: "Infrastructure and reliability obsessive. I automate everything, including my morning routine.",
      interests: ["Kubernetes", "Terraform", "Cooking", "Gaming"],
      funFact: "I have 47 houseplants and have named all of them after Linux distributions.",
      favouriteFood: "Hyderabadi Haleem",
      favouriteSport: "Table Tennis",
    },
  },
  {
    id: "demo-india-004",
    name: "Ananya Krishnamurthy",
    email: "ananya.k@tegrasocial.demo",
    role: "Designer",
    country: "India",
    profile: {
      bio: "Design systems architect and accessibility advocate. I believe good design is invisible.",
      interests: ["Typography", "Accessibility", "Kathak Dance", "Pottery"],
      funFact: "I designed my wedding invitation purely in Figma, including the motion animations.",
      favouriteFood: "Chettinad Chicken",
      favouriteSport: "Swimming",
    },
  },
  {
    id: "demo-india-005",
    name: "Rahul Mehta",
    email: "rahul.mehta@tegrasocial.demo",
    role: "QA Engineer",
    country: "India",
    profile: {
      bio: "Quality guardian who loves breaking things before users can. Firm believer that QA is everyone's job.",
      interests: ["Test Automation", "Security Testing", "Reading", "Football"],
      funFact: "I once found a critical bug in production by playing Minecraft — the physics simulation revealed a race condition.",
      favouriteFood: "Pav Bhaji",
      favouriteSport: "Football",
    },
  },
  {
    id: "demo-india-006",
    name: "Deepika Iyer",
    email: "deepika.iyer@tegrasocial.demo",
    role: "Software Engineer",
    country: "India",
    profile: {
      bio: "Frontend specialist who cares deeply about performance and smooth user experiences.",
      interests: ["React", "WebGL", "Carnatic Music", "Marathon Running"],
      funFact: "I completed my first marathon while still in college, fueled entirely by filter coffee.",
      favouriteFood: "Rava Idli",
      favouriteSport: "Running",
    },
  },
  {
    id: "demo-india-007",
    name: "Suresh Patel",
    email: "suresh.patel@tegrasocial.demo",
    role: "Account Manager",
    country: "India",
    profile: {
      bio: "Client success advocate who turns every engagement into a long-term partnership.",
      interests: ["Relationship Building", "Cricket Strategy", "Entrepreneurship", "Cooking"],
      funFact: "I played first-class cricket for Gujarat under-19 before pivoting to tech.",
      favouriteFood: "Undhiyu",
      favouriteSport: "Cricket",
    },
  },
  {
    id: "demo-india-008",
    name: "Kavitha Rajendran",
    email: "kavitha.r@tegrasocial.demo",
    role: "Software Engineer",
    country: "India",
    profile: {
      bio: "Backend systems engineer specialising in high-throughput data pipelines and distributed databases.",
      interests: ["Distributed Systems", "PostgreSQL", "Veena Music", "Cycling"],
      funFact: "I cycle 20km every morning before work — rain or shine.",
      favouriteFood: "Pongal",
      favouriteSport: "Cycling",
    },
  },
  // ── Iceland ─────────────────────────────────────────────────────────────
  {
    id: "demo-iceland-001",
    name: "Gunnar Sigurdsson",
    email: "gunnar.s@tegrasocial.demo",
    role: "Software Engineer",
    country: "Iceland",
    profile: {
      bio: "Backend engineer who loves solving complex algorithmic challenges. Avid outdoorsman and Northern Lights chaser.",
      interests: ["Algorithms", "Go Language", "Aurora Hunting", "Hiking"],
      funFact: "I have seen the Northern Lights over 200 times and still get excited every single time.",
      favouriteFood: "Skyr with Blueberries",
      favouriteSport: "Cross-country Skiing",
    },
  },
  {
    id: "demo-iceland-002",
    name: "Sigrid Jonsdottir",
    email: "sigrid.j@tegrasocial.demo",
    role: "Designer",
    country: "Iceland",
    profile: {
      bio: "UX designer inspired by Iceland's landscapes. I bring natural minimalism into every product I touch.",
      interests: ["Nature Photography", "UX Research", "Knitting", "Hot Springs"],
      funFact: "I designed a mobile app while staying in a remote fjord with no internet — all offline with paper prototypes.",
      favouriteFood: "Plokkfiskur",
      favouriteSport: "Horseback Riding",
    },
  },
  {
    id: "demo-iceland-003",
    name: "Bjorn Einarsson",
    email: "bjorn.e@tegrasocial.demo",
    role: "Product Manager",
    country: "Iceland",
    profile: {
      bio: "Product strategist who thinks in systems and ships fast. Former geologist who now excavates user problems instead of rocks.",
      interests: ["Geology", "Agile Strategy", "Handball", "Fermentation"],
      funFact: "I brew my own Brennivín and have won two local tasting competitions.",
      favouriteFood: "Lamb Soup (Kjötsúpa)",
      favouriteSport: "Handball",
    },
  },
  {
    id: "demo-iceland-004",
    name: "Astrid Magnusdottir",
    email: "astrid.m@tegrasocial.demo",
    role: "QA Engineer",
    country: "Iceland",
    profile: {
      bio: "Detail-obsessed QA who approaches testing like a scientific experiment. I hypothesise, test, and document everything.",
      interests: ["Exploratory Testing", "Automation", "Poetry", "Swimming"],
      funFact: "I swam across Lake Thingvallavatn — 10km in glacially cold water — for a charity fundraiser.",
      favouriteFood: "Hangikjöt",
      favouriteSport: "Open Water Swimming",
    },
  },
  {
    id: "demo-iceland-005",
    name: "Olafur Kristjansson",
    email: "olafur.k@tegrasocial.demo",
    role: "DevOps Engineer",
    country: "Iceland",
    profile: {
      bio: "Cloud infrastructure expert who loves clean pipelines and reliable deployments. Mushroom forager on weekends.",
      interests: ["Cloud Architecture", "CI/CD", "Mushroom Foraging", "Icelandic Sagas"],
      funFact: "I have read all 40 original Icelandic Sagas and can recite passages from memory at dinner parties.",
      favouriteFood: "Hardfiskur with Butter",
      favouriteSport: "Glima (Icelandic Wrestling)",
    },
  },
];

// ─── Main seed function ────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding Tegra Social demo data...");

  // ── 1. Clear existing data (in dependency order) ──────────────────────
  console.log("Clearing existing data...");
  await db.delete(profiles);
  await db.delete(inviteCodes);
  await db.delete(verification);
  await db.delete(session);
  await db.delete(account);
  await db.delete(user);
  console.log("Cleared.");

  // ── 2. Insert admin user ───────────────────────────────────────────────
  const now = new Date();
  await db.insert(user).values({
    id: "demo-admin-001",
    name: "Admin User",
    email: ADMIN_EMAIL,
    emailVerified: true,
    isAdmin: true,
    status: "active",
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Created admin: ${ADMIN_EMAIL}`);

  // ── 2b. Insert real admin (Jayasuriya) ────────────────────────────────
  await db.insert(user).values({
    id: "real-admin-001",
    name: "Jayasuriya Venkatesan",
    email: "jayasuriya.venkatesan@roanuz.com",
    emailVerified: true,
    isAdmin: true,
    role: "Software Engineer",
    country: "India",
    status: "active",
    createdAt: now,
    updatedAt: now,
  });
  console.log("Created admin: jayasuriya.venkatesan@roanuz.com");

  // ── 3. Insert demo employees ───────────────────────────────────────────
  const indiaEmployees = demoEmployees.filter((e) => e.country === "India");
  const icelandEmployees = demoEmployees.filter((e) => e.country === "Iceland");

  for (const emp of demoEmployees) {
    await db.insert(user).values({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      country: emp.country,
      emailVerified: true,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
  }

  console.log(
    `Created ${demoEmployees.length} demo employees (${indiaEmployees.length} India, ${icelandEmployees.length} Iceland)`,
  );

  // ── 4. Insert profiles ─────────────────────────────────────────────────
  for (const emp of demoEmployees) {
    await db.insert(profiles).values({
      userId: emp.id,
      bio: emp.profile.bio,
      interests: emp.profile.interests,
      funFact: emp.profile.funFact,
      favouriteFood: emp.profile.favouriteFood,
      favouriteSport: emp.profile.favouriteSport,
      coffeeOptIn: true,
      updatedAt: now,
    });
  }

  console.log(`Created ${demoEmployees.length} profiles`);
  console.log("Seed complete!");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
