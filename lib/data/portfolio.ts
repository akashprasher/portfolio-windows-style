export type Experience = {
  company: string;
  location: string;
  dates: string;
  role: string;
  points: string[];
};

export type Project = {
  name: string;
  type: string;
  stack: string;
  description: string;
  icon: string;
  color: "blue" | "red" | "gray";
  url: string;
};

export type PortfolioData = {
  profile: {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    website: string;
    intro: string;
    bio: string;
    secondBio: string;
    currentRole: string;
    status: string;
    paymentStat: string;
    retentionStat: string;
  };
  experience: Experience[];
  projects: Project[];
  skills: string[];
  education: {
    school: string;
    degree: string;
    program: string;
    dates: string;
  };
};

export const defaultPortfolioData: PortfolioData = {
  profile: {
    name: "Akash Prasher",
    title: "Senior Software Engineer",
    location: "Delhi, India",
    email: "akash.prasher@hotmail.com",
    phone: "+91-9988336867",
    website: "akashprasher.com",
    intro:
      "I'm Akash Prasher, a senior software engineer working across frontend, backend, and full-stack systems. I turn complex product problems into reliable, thoughtful software.",
    bio: "I enjoy working where product thinking meets engineering craft. Over the last four years, I've shipped production applications, designed APIs, improved critical user journeys, and built asynchronous workflows that scale.",
    secondBio:
      "My toolbox spans React, Next.js, React Native, Node.js, FastAPI, and TypeScript. I care about clear architecture, fast interfaces, and the small details that make software feel effortless.",
    currentRole: "Senior Software Engineer",
    status: "Open to conversations",
    paymentStat: "₹30+ crore",
    retentionStat: "20%",
  },
  experience: [
    {
      company: "Jumbo",
      location: "Delhi, India",
      dates: "Jan 2026 — Present",
      role: "Senior Software Engineer",
      points: [
        "Split a high-traffic page API into focused endpoints for banners, matches, events, and joining flows.",
        "Introduced Redis caching and CDN delivery to reduce backend and database pressure.",
        "Designed checkout flows for multiple payment gateways and an in-app wallet, handling ₹30+ crore in transaction value.",
      ],
    },
    {
      company: "Inspect Element",
      location: "Remote · Hong Kong",
      dates: "Jun 2024 — Jan 2026",
      role: "Software Engineer",
      points: [
        "Built SaaS dashboards and workflows across Next.js and FastAPI, including scheduling, revenue tracking, permissions, and booking.",
        "Owned an end-to-end PDF analysis flow from upload and S3 storage through async processing, AI analysis, and report delivery.",
        "Improved reliability and UX with debounced search, loading states, encryption, privacy-compliant deletion, and regional permissions.",
      ],
    },
    {
      company: "Grantit",
      location: "Remote · Hong Kong",
      dates: "Sep 2022 — May 2024",
      role: "Software Engineer / Full-stack",
      points: [
        "Redesigned the loan journey so users could preserve progress with missing documents, improving retention by 20%.",
        "Built flexible document and business-rule flows to support multiple loan types and future product expansion.",
        "Created a full-stack CMS for marketing banners, saving developers 15% of their time.",
      ],
    },
    {
      company: "IBM",
      location: "Pune, India",
      dates: "Apr 2022 — Aug 2022",
      role: "Associate System Engineer",
      points: [
        "Delivered dashboard features and maintainable application updates in collaboration with cross-functional teams.",
        "Supported QA, maintenance, usability improvements, and iterative product enhancements.",
      ],
    },
  ],
  projects: [
    {
      name: "AI Resume Analyzer",
      type: "AI · PRODUCTIVITY",
      stack: "Next.js · TypeScript · FastAPI",
      description:
        "An AI-powered resume analyzer that evaluates ATS compatibility and generates actionable keyword suggestions.",
      icon: "✳",
      color: "blue",
      url: "",
    },
    {
      name: "Conduit",
      type: "FULL-STACK · SOCIAL",
      stack: "MongoDB · Express · React · Node.js",
      description:
        "A blogging app with authentication, article publishing, following, and personalized reading feeds.",
      icon: "▤",
      color: "red",
      url: "",
    },
    {
      name: "URL & QR Generator",
      type: "WEB APP · UTILITY",
      stack: "Express.js · MongoDB · JavaScript",
      description:
        "A URL shortener and QR code generator that turns long links into easy-to-share destinations.",
      icon: "⌘",
      color: "gray",
      url: "",
    },
  ],
  skills: [
    "React",
    "React Native",
    "Next.js",
    "Expo",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "FastAPI",
    "Flutter",
    "Firebase",
    "MongoDB",
    "PostgreSQL",
    "Firestore",
    "REST APIs",
    "Google Maps SDK",
    "WebSockets",
    "AI Integrations",
  ],
  education: {
    school: "Chandigarh University",
    degree: "Bachelor of Engineering",
    program: "Computer Science Engineering",
    dates: "2017 — 2021",
  },
};

export function isPortfolioData(value: unknown): value is PortfolioData {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<PortfolioData>;
  const isObject = (item: unknown): item is Record<string, unknown> =>
    Boolean(item && typeof item === "object" && !Array.isArray(item));
  const hasStrings = (item: unknown, keys: string[]) =>
    isObject(item) && keys.every((key) => typeof item[key] === "string");
  const experienceValid =
    Array.isArray(data.experience) &&
    data.experience.every(
      (item) =>
        hasStrings(item, ["company", "location", "dates", "role"]) &&
        Array.isArray(item.points) &&
        item.points.every((point) => typeof point === "string"),
    );
  const projectsValid =
    Array.isArray(data.projects) &&
    data.projects.every(
      (item) =>
        hasStrings(item, [
          "name",
          "type",
          "stack",
          "description",
          "icon",
          "url",
        ]) &&
        ["blue", "red", "gray"].includes(String(item.color)) &&
        (item.url === "" ||
          (typeof item.url === "string" && /^https?:\/\//i.test(item.url))),
    );
  return Boolean(
    hasStrings(data.profile, [
      "name",
      "title",
      "location",
      "email",
      "phone",
      "website",
      "intro",
      "bio",
      "secondBio",
      "currentRole",
      "status",
      "paymentStat",
      "retentionStat",
    ]) &&
    experienceValid &&
    projectsValid &&
    Array.isArray(data.skills) &&
    data.skills.every((skill) => typeof skill === "string") &&
    hasStrings(data.education, ["school", "degree", "program", "dates"]),
  );
}
