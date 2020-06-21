import ReactDOM from "react-dom";
import React from "react";
import "./utils/configs";
import styles from "./assets/stylesheets/cloud.scss";
import classNames from "classnames";
import configs from "./utils/configs";
import { IntlProvider, FormattedMessage, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import { lang, messages } from "./utils/i18n";
import IfFeature from "./react-components/if-feature";
import UnlessFeature from "./react-components/unless-feature";

import registerTelemetry from "./telemetry";

registerTelemetry("/cloud", "Neutrino 2020 Hubs Docs Page");

addLocaleData([...en]);

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <IfFeature name="show_whats_new_link">
            <li>
              <a href="/whats-new">
                <FormattedMessage id="home.whats_new_link" />
              </a>
            </li>
          </IfFeature>
          <IfFeature name="show_source_link">
            <li>
              <a href="https://github.com/mozilla/hubs">
                <FormattedMessage id="home.source_link" />
              </a>
            </li>
          </IfFeature>
          <IfFeature name="show_community_link">
            <li>
              <a href={configs.link("community", "https://conferences.fnal.gov/nu2020/contacts/")}>
                <FormattedMessage id="home.community_link" />
              </a>
            </li>
          </IfFeature>
          <IfFeature name="enable_spoke">
            <li>
              <a href="/spoke">
                <FormattedMessage id="editor-name" />
              </a>
            </li>
          </IfFeature>
          <IfFeature name="show_docs_link">
            <li>
              <a href={configs.link("docs", "https://hubs.mozilla.com/docs")}>
                <FormattedMessage id="home.docs_link" />
              </a>
            </li>
          </IfFeature>
          <IfFeature name="show_cloud">
            <li>
              <a href="https://hubs.mozilla.com/cloud">
                <FormattedMessage id="home.cloud_link" />
              </a>
            </li>
          </IfFeature>
        </ul>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className={styles.poweredBy}>
        <UnlessFeature name="hide_powered_by">
          <span className={styles.prefix}>
            <FormattedMessage id="home.powered_by_prefix" />
          </span>
          <a className={styles.link} href="https://hubs.mozilla.com/cloud">
            <FormattedMessage id="home.powered_by_link" />
          </a>
        </UnlessFeature>
      </div>
      <nav>
        <ul>
          <IfFeature name="show_terms">
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={configs.link("terms_of_use", "https://github.com/mozilla/hubs/blob/master/TERMS.md")}
              >
                <FormattedMessage id="home.terms_of_use" />
              </a>
            </li>
          </IfFeature>
          <IfFeature name="show_privacy">
            <li>
              <a
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
                href={configs.link("privacy_notice", "https://github.com/mozilla/hubs/blob/master/PRIVACY.md")}
              >
                <FormattedMessage id="home.privacy_notice" />
              </a>
            </li>
          </IfFeature>
          <IfFeature name="show_company_logo">
            <li>
              <img className={styles.companyLogo} src={configs.image("company_logo")} />
            </li>
          </IfFeature>
        </ul>
      </nav>
    </footer>
  );
}

function HubsCloudPage() {
  return (
    <IntlProvider locale={lang} messages={messages}>
      <>
        <Header />
        <main>
          <div className={styles.hero}>
            <div className={styles.center}>
              <a href="/">
                <img className="logo" src={configs.image("logo")} />
              </a>
            </div>
            <section className={styles.center}>
              <div className={styles.heroContent}>
                <h1>Neutrino 2020 Hubs</h1>
                <p className={styles.centerLg}>
                  This year the Neutrino 2020 conference is entirely online. This poses a particular problem for a
                  poster session, which main goal is to facilitate the interaction among all conference
                  partecipants, and to give everyone the oppurtinity to share their own work.
                  In an effort to keep the same spirit, we are hosting a virtual reality (VR) poster session,
                  using a customized version of <a href="https://hubs.mozilla.com/#/">Mozilla Hubs</a>:
                  a social VR platform that runs right in the browser.
                </p>
                <div className={classNames(styles.row, styles.colLg, styles.centerLg)}>
                  <a className={styles.primaryButton} href="/">
                    Enter a Room
                  </a>
                </div>
                <div className={classNames(styles.getStarted, styles.center)}>
                  <a href="#troubleshooting">Problems? Check the troubleshooting section below.</a>
                </div>
              </div>
            </section>
          </div>
          <section className={styles.left}>
            {/*<a href="https://www.youtube.com/watch?v=jG3Vms5jS8Y" target="_blank" rel="noopener noreferrer">
              <img src="./assets/docs/vr_video.jpg" alt="Audio Setup" width="400"/>
            </a>*/}
            <h4>Check out the virtual reality tutorial video <a href="https://www.youtube.com/watch?v=jG3Vms5jS8Y">here</a>!</h4>
            <h2>1. Log In</h2>
            You will only be able to enter a virtual room if you are logged in. To log in:
            <ul>
              <li>Go to the <a href="/">main page</a> and click on the "Log in" link on the top right.</li>
              <li>Enter the email you used for you Indico registration.</li>
              <li>You will receive an email with a link (make sure to check your spam folder).</li>
              <li>Clicking on the link will log you into Neutrino 2020 Hubs!</li>
            </ul>
            <h2>2. Enter a Room</h2>
            <p>
              Make sure you are using Mozilla Firefox (Hubs works best in Firefox but also works on Chrome, Safari and Edge.<br></br>
              Also make sure you are using wired heaphones (Hubs doesn't work properly without them!).<br></br>
              You can see all the available rooms in the <a href="/">main page</a>.<br></br>
              There is a maximum number of partecipants per room.<br></br>
              The poster session is spread over several room. Each room contains 5 posters each.<br></br>
              The number of partecipants in a room is limited, and you can see the room occupancy in the <a href="/">main page</a>.<br></br>
              To enter a room, simply pick one which is not full and click on it.<br></br>
            </p>
            <p>
              Before entering, you are in the room's lobby.<br></br>
              You can see what's going on inside the room but you can't interact.<br></br>
              Click "Enter Room" and follow the prompts to select an avatar and enable the mic.<br></br>
            </p>
          </section>
          <div className={styles.herow}>
            <section className={styles.colLg}>
              <div className={classNames(styles.heroMedia, styles.centerLg)}>
                <img src="./assets/docs/audio_setup.png" alt="Audio Setup"/>
              </div>
              <div className={styles.heroContent}>
                <p className={styles.centerLg}>
                  Before entering the room, make sure you test your mic and speaker as shown in the picture.
                  If you speak, you should see the mic circle filling up.
                  If you click on the audio button, you should be able to hear a sound.
                  Also, make sure you select the right audio device from the dropdown menu.
                  You should be wearing headphones. Hubs doesn't perform well without them.
                </p>
              </div>
            </section>
          </div>
          <section className={styles.left}>
            <h2>3. Explore</h2>
            <h3>Look Around</h3>
            Now that you are in the room, you can start exploring. Use your <b>WASD</b> keys to move around, or use your right mouse button to jump. To rotate your view, hold down your left mouse button and drag (alternatively you can use the <b>Q</b> and <b>E</b> keys).
            For VR and mobile controls see the list on the <a href="https://hubs.mozilla.com/docs/hubs-controls.html">Mozilla Hubs page</a>.
            <h3>User Interface</h3>
          </section>
          <div className={styles.herow}>
            <section className={styles.colLg}>
              <div className={classNames(styles.heroMedia, styles.centerLg)}>
                <img src="./assets/docs/nu2020-hubs-ui.png" alt="UI"/>
              </div>
              <div className={styles.heroContent}>
                <p className={styles.centerLg}>
                  Take a moment to take a look around the user interface. You can mute your mic, take photos, and use a laser pointer.
                </p>
              </div>
            </section>
          </div>
          <section className={styles.left}>
            <h3>Object Menus</h3>
            Additional controls for objects, videos, and drawings can be found in the object menu.
            To reveal these controls, hover your cursor over the object and press the <b>space bar</b> or <b>tab key</b> on Desktop.
          </section>
          <div className={styles.herow}>
            <section className={styles.colLg}>
              <div className={classNames(styles.heroMedia, styles.centerLg)}>
                <img src="./assets/docs/nu2020-hubs-ui-openposter.png" alt="UI"/>
              </div>
              <div className={styles.heroContent}>
                <p className={styles.centerLg}>
                  Click <b>space bar</b> while pointing at a poster to show the poster menu.
                  If you click on "open link" it will open the poster on a new tab.
                </p>
              </div>
            </section>
          </div>
          <div className={styles.herow}>
            <section className={styles.colLg}>
              <div className={classNames(styles.heroMedia, styles.centerLg)}>
                <img src="./assets/docs/nu2020-hubs-ui-link.png" alt="UI"/>
              </div>
              <div className={styles.heroContent}>
                <p className={styles.centerLg}>
                  The widget below the poster number if a link. If you click on "open" link it will open a new tab showing
                  the poster session main page, where you can see the poster in full resolution and watch the video.
                </p>
              </div>
            </section>
          </div>
          <div className={styles.herow} id="avatar_volume">
            <section className={styles.colLg}>
              <div className={classNames(styles.heroMedia, styles.centerLg)}>
                <img src="./assets/docs/nu2020-hubs-ui-avatarvolume.png" alt="UI"/>
              </div>
              <div className={styles.heroContent}>
                <p className={styles.centerLg}>
                  Point at the avatar of another user and click spacebar. Here, you can change the volume of a particular user.
                </p>
              </div>
            </section>
          </div>
          <section className={styles.left}>
            <h1 id="troubleshooting">Troubleshooting</h1>
            Having problems? Belowe we have collected some of the typical issues that may encounter.<br/>
            Some simple tips:
            <ul>
              <li>Try using Firefox.</li>
              <li>Wear wired headphones.</li>
              <li>Use your computer and not a mobile device.</li>
              <li>Restart your browser.</li>
            </ul>
            <h3>Getting stuck on loading screen</h3>
              If you are getting stuck on the loading screen, try refreshing the page or loading the scene on another browser or device.
            <h3>Cannot hear well who is speaking</h3>
              You can customize the volume for a particular avatar by folowing the instructions above under <a href="/cloud#avatar_volume">Object Menus</a>.
            <h3>Cannot see the poster well</h3>
              You can change the orientation of your head to better look at a poster.
              See <a href="https://www.youtube.com/watch?v=jG3Vms5jS8Y">this video</a> for tips on how to move in VR.
              You can also open the poster in another tab. To do this, look at the poster and hit spacebar. Then, click on "Open Link".
            <h3>There is echo in the room</h3>
              Echo may occur if a participant is not wearing headphones.
              You can also reduce the volume of the user in their avatar menu.
            <h3>'Unable to connect' error</h3>
          </section>
          <div className={styles.herow}>
            <section className={styles.colLg}>
              <div className={classNames(styles.heroMedia, styles.centerLg)}>
                <img src="./assets/docs/tcp_fail.png" alt="'Unable to connect' error"/>
              </div>
              <div className={styles.heroContent}>
                <p className={styles.centerLg}>
                  If you see this error message, try clicking on the link "connecting via TCP".
                  If this also doesn't work and you are not using Firefox, try on a Firefox browser.
                </p>
              </div>
            </section>
          </div>
          <section className={styles.left}>
            An error that says 'unable to connect' is often caused by a firewall.
            At a minimum, Hubs needs your computer to connect to external servers port 80 and 443, both via TLS.
            Ideally you should also open up ports 51610-65535 on UDP and TCP for Hubs on your router's firewall.
            Please note that for self-hosted versions of Hubs you need to open ports 49152-60999 on UDP and TCP.
            You will also need to open port 19302 on UDP and TCP.
            <h3>Mic not working</h3>
            First check that your mic is properly plugged in, and that you selected the right mic in the browser permissions (typically to the left of the address bar).
            If it is still not working, you may need to look in the privacy and security settings on your computer to ensure that mic permissions are not being blocked.
            If it still does not work, try in another browser. Hubs works best in Firefox and Chrome, but it also runs on Edge, and desktop Safari.<br/>
            If the mic is picking up your voice but it sounds distorted, check you aren't using a bluetooth headset mic, as these do not always work well with browser-based tools.

            <h3>Need help with something else?</h3>
              To get feedback fast, please ask us in the Nu2020 Slack channel #virtual-reality.<br/>
              Not part of the Slack workspace yet? Fill up <a href="https://forms.gle/w33uo8FKyUXrM9j2A">this form</a> to be added.<br/>
              Alternatively, you can send us an email at <a href="mailto:nu2020-hubs@fnal.gov?body=[Please specify what OS, computer, and browser you were using.]">nu2020-hubs@fnal.gov</a>.
          </section>

          {/*<section className={classNames(styles.features, styles.colLg, styles.centerLg)}>
            <div>
              <h3>Engage</h3>
              <p>
                You will only be able to enter a virtual room if you are logged in.
              </p>
              <p>
                To log in, got to the main page and click on the "Log in" link on the top right.
                Enter the email you used for you Indico registration.
              </p>
              <p>
                You will receive an email with
                a link. Clicking on the link will log you into Neutrino 2020 Hubs!
              </p>
            </div>
            <div className={styles.center}>
              <h3>Enter a Room</h3>
              <p>
                With Hubs Cloud, your deployment is on your own organization’s infrastructure, keeping your sensitive
                data private and secure within an AWS account your team owns.
              </p>
            </div>
            <div className={styles.center}>
              <h3>Engage</h3>
              <p>
                Your cost to run Hubs Cloud will be dependent on the size of your deployed instances, bandwidth, and
                storage used. All billing is handled through AWS, so you’ll get visibility into charges at every step of
                the process.
              </p>
            </div>
          </section>*/ }
        </main>
        <Footer />
      </>
    </IntlProvider>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<HubsCloudPage />, document.getElementById("ui-root"));
});
