import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faCompass,
  faStar,
  faInfo,
  faBook
} from "@fortawesome/free-solid-svg-icons";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";

library.add(faCompass, faStar, faInfo, faBook, faGithubAlt);
dom.watch();
