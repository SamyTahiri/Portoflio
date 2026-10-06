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
  email: "samy.tahiri26@gmail.com",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/SamyTahiri" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" }, // TODO: your profile URL
];

// TODO: rewrite in your own words
export const about = [
  "Hey, I'm Samy! I'm a robotics enthusiast and web developer who loves making things that feel alive — a robot rolling across a competition field, or a button that's just a little too satisfying to press.",
  "On the web I mostly work with React and TypeScript, and lately I've been diving into 3D with Three.js and shaders. Off-screen, you'll find me tinkering with robots, sensors and whatever is on my desk that week.",
  "I designed and built this website myself, and with Jerry and Raphaël I made technexus.jerryxf.net, the website for TechNexus — a companion app for FRC events.",
];

export type TagColor = "peach" | "sage" | "butter";

export const nowTags: { label: string; value: string; color: TagColor }[] = [
  { label: "now building", value: "this cozy website", color: "peach" },
  { label: "learning", value: "3D & shaders", color: "sage" },
  { label: "off-screen", value: "robots & tinkering", color: "butter" },
];

export type Project = {
  title: string;
  year: string;
  description: string;
  link?: { label: string; href: string };
};

export type ProjectType = {
  kind: string;
  title: string;
  description: string;
  tags: string[];
  sprite: SpriteName;
  color: "manila" | "peach" | "sage" | "rose";
  projects: Project[];
};

export const projectTypes: ProjectType[] = [
  {
    kind: "web",
    title: "Websites",
    description: "Sites I've designed and built, from the first sketch to the live link.",
    tags: ["React", "TypeScript", "CSS"],
    sprite: "floppy",
    color: "sage",
    projects: [
      {
        title: "This Website",
        year: "2026",
        description:
          "The cozy corner you're scrolling right now: pixel stickers you can drag, a lo-fi radio that composes itself and far too many leaves.",
        link: { label: "back to the top", href: "#top" },
      },
      {
        title: "TechNexus",
        year: "2026",
        description:
          "The website for TechNexus, a free companion app that puts your FRC team's next match on your Lock Screen. Made with Jerry and Raphaël.",
        link: { label: "visit the site", href: "https://technexus.jerryxf.net" },
      },
    ],
  },
  {
    kind: "3D",
    title: "3D & interactive",
    description: "Little worlds in the browser you can look around and poke at.",
    tags: ["React Three Fiber", "Three.js", "GSAP"],
    sprite: "leaf",
    color: "peach",
    projects: [
      {
        title: "Cozy 3D Room",
        year: "2026",
        description:
          "An interactive 3D room you can step into — warm sunset light, drifting leaves and a door that swings open when you hover it.",
        link: { label: "step inside", href: "/room" },
      },
    ],
  },
  {
    kind: "motion",
    title: "Motion & animation",
    description: "Pages that drift, sway and bounce — animation that makes a page feel alive.",
    tags: ["React", "Framer Motion", "CSS animation"],
    sprite: "star",
    color: "rose",
    projects: [
      {
        title: "Moonlit Landing",
        year: "2026",
        description:
          "An animated landing page with drifting sakura petals, a day-and-night sky and a “hello” marquee in twenty languages.",
      },
    ],
  },
  {
    kind: "robotics",
    title: "Robotics",
    description: "Robots off-screen: designing, wiring and programming them for competition.",
    tags: ["Java", "Sensors", "CAD"],
    sprite: "gear",
    color: "manila",
    projects: [
      {
        // TODO: placeholder — replace with a robot you actually built
        title: "Competition Robot",
        year: "2025",
        description:
          "Designing, wiring and programming a robot for FIRST-style challenges — from the first sketch to autonomous routines.",
      },
    ],
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
