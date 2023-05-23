import { cn } from "@/utils/cn";
import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={cn(
        "fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center duration-300 shadow-md hover:bg-indigo-600 transition-all",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      onClick={scrollToTop}
    >
      <ArrowUpCircleIcon />
    </button>
  );
};

export default ScrollToTopButton;
