import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faCompass,
  faStar,
  faInfo,
  faBook,
  faSpinner
  // faHeart,
} from "@fortawesome/free-solid-svg-icons";
// import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";

library.add(
  faCompass,
  faStar,
  faInfo,
  faBook,
  faSpinner,
  // faHeart,
  // faHeartOutline,
  faGithubAlt
);
dom.watch();
