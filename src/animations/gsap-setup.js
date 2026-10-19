import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Observer } from "gsap/Observer";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(
  ScrollTrigger,
  Flip,
  SplitText,
  DrawSVGPlugin,
  ScrambleTextPlugin,
  Observer,
  CustomEase,
);

CustomEase.create("signature", "0.22, 1, 0.36, 1");
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, Flip, SplitText, DrawSVGPlugin, ScrambleTextPlugin };
