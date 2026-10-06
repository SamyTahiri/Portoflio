import type { SpriteName } from "../components/cozy/pixelArt";

// Everything visitors read on the home page lives in this file.
// Entries marked TODO are placeholders — swap them for your real info before publishing.

export const profile = {
  name: "Samy Tahiri",
  role: "Robotics enthusiast & web developer",
  intro: "I build little things that move — robots off-screen, cozy interfaces on-screen.",
  photo: "/images/profile.jpg",
  photoAlt: "A robot competing on the field at a FIRST robotics event",
  photoCaption: "competition day ⚙️",
  email: "hello@example.com", // TODO: your real email
};

export const socials = [
  { label: "GitHub", href: "https://github.com/" }, // TODO: your profile URL
  { label: "LinkedIn", href: "https://www.linkedin.com/" }, // TODO: your profile URL
];

// TODO: rewrite in your own words
export const about = [
  "Hey, I'm Samy! I'm a robotics enthusiast and web developer who loves making things that feel alive — a robot rolling across a competition field, or a button that's just a little too satisfying to press.",
  "On the web I mostly work with React and TypeScript, and lately I've been diving into 3D with Three.js and shaders. Off-screen, you'll find me tinkering with robots, sensors and whatever is on my desk that week.",
];

export type TagColor = "peach" | "sage" | "butter";

export const nowTags: { label: string; value: string; color: TagColor }[] = [
  { label: "now building", value: "this cozy website", color: "peach" },
  { label: "learning", value: "3D & shaders", color: "sage" },
  { label: "off-screen", value: "robots & tinkering", color: "butter" },
];

export type Project = {
  title: string;
  kind: string;
  year: string;
  description: string;
  tags: string[];
  links: { label: string; href: string }[];
  sprite: SpriteName;
  color: "manila" | "peach" | "sage" | "rose";
};

export const projects: Project[] = [
  {
    title: "Cozy 3D Room",
    kind: "3D · web",
    year: "2026",
    description:
      "An interactive 3D room you can step into — warm sunset light, drifting leaves and a door that swings open when you hover it.",
    tags: ["React Three Fiber", "Three.js", "GSAP"],
    links: [{ label: "step inside", href: "/room" }],
    sprite: "leaf",
    color: "peach",
  },
  {
    // TODO: placeholder — replace with a robot you actually built
    title: "Competition Robot",
    kind: "robotics",
    year: "2025",
    description:
      "Designing, wiring and programming a robot for FIRST-style challenges — from the first sketch to autonomous routines.",
    tags: ["Java", "Sensors", "CAD"],
    links: [],
    sprite: "gear",
    color: "manila",
  },
  {
    title: "Moonlit Landing",
    kind: "web · motion",
    year: "2026",
    description:
      "An animated landing page with drifting sakura petals, a day-and-night sky and a “hello” marquee in twenty languages.",
    tags: ["React", "Framer Motion", "CSS animation"],
    links: [],
    sprite: "star",
    color: "rose",
  },
  {
    title: "This Website",
    kind: "web · design",
    year: "2026",
    description:
      "The cozy corner you're scrolling right now: pixel stickers you can drag, a lo-fi radio that composes itself and far too many leaves.",
    tags: ["React", "TypeScript", "Framer Motion"],
    links: [{ label: "back to the top", href: "#top" }],
    sprite: "floppy",
    color: "sage",
  },
];

export const skillGroups: { label: string; keys: string[]; featured?: string[] }[] = [
  {
    label: "web",
    keys: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Three.js", "GSAP", "Framer Motion", "Vite"],
    featured: ["React", "TypeScript", "Three.js"],
  },
  // TODO: double-check these two rows
  { label: "robotics", keys: ["Java", "C++", "Arduino", "Sensors", "CAD"], featured: ["Java"] },
  { label: "tools", keys: ["Git", "IntelliJ IDEA", "Figma"] },
];

export const marqueeWords = [
  "React",
  "TypeScript",
  "Three.js",
  "robotics",
  "WebGL",
  "Framer Motion",
  "GSAP",
  "pixel art",
  "cozy UI",
];
