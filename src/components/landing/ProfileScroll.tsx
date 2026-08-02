import { motion } from "framer-motion";
import "./ProfileScroll.css";

type ProfileScrollProps = {
  photoSrc?: string;
  name?: string;
  bio?: string;
};

export default function ProfileScroll({
  photoSrc = "/images/profile.jpg",
  name = "Hi, I'm Samy Tahiri",
  bio = "Robotics enthusiast & web developer.",
}: ProfileScrollProps) {
  return (
    <div className="mark">
     <span className="logomark" aria-hidden="true">
  <svg viewBox="0 0 40 40" width="56" height="56" fill="none">
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
        <stop offset="0%" stopColor="#fde3ec" />
        <stop offset="18%" stopColor="#f4afc7" />
        <stop offset="35%" stopColor="#ffffff" />
        <stop offset="52%" stopColor="#d4759a" />
        <stop offset="70%" stopColor="#f9c9da" />
        <stop offset="85%" stopColor="#c85f85" />
        <stop offset="100%" stopColor="#f4afc7" />
      </linearGradient>
    </defs>
          <path
            d="M20 6a14 14 0 1 1 -9.7 4.05"
            stroke="url(#logoGrad)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <circle cx="20" cy="6" r="1.8" fill="url(#logoGrad)" />
          <circle cx="30.5" cy="30.5" r="1.8" fill="url(#logoGrad)" />
          <line x1="30.5" y1="30.5" x2="36" y2="34" stroke="url(#logoGrad)" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="36" cy="34" r="1.6" fill="url(#logoGrad)" />
        </svg>
      </span>

      <motion.div
        className="scroll-wrap"
        tabIndex={0}
        aria-label="About Samy Tahiri"
        initial="closed"
        whileHover="open"
        whileFocus="open"
      >
        <motion.div
          className="scroll-rod"
          variants={{ closed: { rotate: 0 }, open: { rotate: -0 } }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <motion.div
          className="scroll-paper"
          variants={{
            closed: { height: 0 },
            open: {
              height: 280,
              transition: {
                type: "spring",
                stiffness: 220,
              damping: 26,
                when: "beforeChildren",
                staggerChildren: 0.08,
              },
            },
          }}
        >
          <div className="scroll-paper-inner">
            <motion.img
              src={photoSrc}
              alt={name}
              className="scroll-photo"
              variants={{ closed: { opacity: 0, y: 10 }, open: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.35 }}
            />
            <motion.p
              className="scroll-bio"
              variants={{ closed: { opacity: 0, y: 10 }, open: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.35 }}
            >
              <strong>{name}</strong>
              <br />
              {bio}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}