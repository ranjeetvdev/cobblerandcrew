import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";

const Hero = () => {
  const videoRef = useRef();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  useGSAP(() => {
    let heroSplit;
    let paragraphSplit;

    const init = async () => {
      try {
        await document.fonts.ready;

        // Reveal text ONLY after fonts are loaded
        gsap.set([".title", ".subtitle"], { visibility: "visible" });

        heroSplit = new SplitText(".title", {
          type: "chars, words",
        });
        paragraphSplit = new SplitText(".subtitle", {
          type: "lines",
        });

        // heroSplit.chars.map((char) => char.classList.add("text-gradient"));

        gsap.from(heroSplit.chars, {
          yPercent: 100,
          duration: 1.8,
          ease: "expo.out",
          stagger: 0.05,
        });

        gsap.from(paragraphSplit.lines, {
          opacity: 0,
          yPercent: 100,
          duration: 1.8,
          ease: "expo.out",
          stagger: 0.05,
          delay: 1,
        });
      } catch (error) {
        console.error("GSAP SplitText initialization failed:", error);
      }
    };

    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
      .to(".right-leaf", {
        y: 200,
      })
      .to(".left-leaf", { y: -200 }, 0);

    const startValue = isMobile ? "top 50%" : "center 60%";
    const endValue = isMobile ? "120% top" : "bottom top";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "video",
        start: startValue,
        end: endValue,
        scrub: true,
        pin: true,
      },
    });

    videoRef.current.onloadedmetadata = () => {
      tl.to(videoRef.current, {
        currentTime: videoRef.current.duration,
      });
    };
    init();

    return () => {
      heroSplit?.revert?.();
      paragraphSplit?.revert?.();
    };
  }, []);

  return (
    <>
      <section id="hero" className="noisy">
        <h1 className="title invisible">MOJITO</h1>
        <img
          src="images/hero-left-leaf.png"
          alt="left-leaf"
          className="left-leaf"
        />
        <img
          src="images/hero-right-leaf.png"
          alt="right-leaf"
          className="right-leaf"
        />

        <div className="body">
          <div className="content">
            <div className="space-y-5 hidden md:block">
              <p>Cool. Crisp. Classic.</p>
              <p className="subtitle">
                Sip the Spirit <br /> of Summer
              </p>
            </div>

            <div className="view-cocktails">
              <p className="subtitle invisible">
                Every cocktail on our menu is a blend of premium ingredients,
                creative flair, and timeless recipes — designed to delight your
                senses.{" "}
              </p>
              <a href="#cocktails" className="hover:text-yellow">
                View Cocktails
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className="video absolute inset-0">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          src="/videos/output.mp4"
        />
      </div>
    </>
  );
};

export default Hero;
