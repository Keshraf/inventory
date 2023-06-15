import { motion } from "framer-motion";

const Logo = () => {
  const icon = {
    hidden: {
      pathLength: 0,
      fill: "#6366F1",
    },
    visible: {
      pathLength: 0.5,
      fill: "#6366F1",
    },
  };

  return (
    <svg
      width="75"
      height="75"
      viewBox="0 0 100 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="75" height="75" rx="12" fill="#6366F1" />
      <motion.path
        variants={icon}
        initial="hidden"
        animate="visible"
        transition={{
          default: { duration: 0.1, ease: "easeInOut" },
          fill: { duration: 0.2, ease: [1, 0, 0.8, 1] },
        }}
        d="M37 58.6667C48.9167 58.6667 58.6667 48.9167 58.6667 37C58.6667 25.0833 48.9167 15.3333 37 15.3333C25.0834 15.3333 15.3334 25.0833 15.3334 37C15.3334 48.9167 25.0834 58.6667 37 58.6667Z"
        stroke="#F8FBFC"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <motion.path
        variants={icon}
        initial="hidden"
        animate="visible"
        transition={{
          default: { duration: 0.1, ease: "easeInOut" },
          fill: { duration: 0.2, ease: [1, 0, 0.8, 1] },
        }}
        d="M27.7916 37L33.9233 43.1317L54.0345 24.4483"
        stroke="#F8FBFC"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default Logo;
