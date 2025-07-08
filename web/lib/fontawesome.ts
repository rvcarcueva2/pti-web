import { library, config } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope, faPhone, faCalendarDays, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faSquareInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";


config.autoAddCss = false;

library.add(faEnvelope, faPhone, faFacebook, faYoutube, faSquareInstagram, faCalendarDays, faLocationDot);