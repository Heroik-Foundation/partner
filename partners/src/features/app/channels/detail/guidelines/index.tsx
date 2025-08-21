import handShakeIcon from "./assets/shake.svg";
import microphoneIcon from "./assets/microphone.svg";
import userLockIcon from "./assets/user-lock.svg";
import { Header } from "@/features/app/global/header";

const guidelines = [
  {
    icon: handShakeIcon,
    title: "Respect & Kindness",
    content:
      "Respect & Kindness Treat all users with respect and kindness, we want this to be a supportive environment for everyone.",
  },
  {
    icon: microphoneIcon,
    title: "No Advertising & Spamming",
    content:
      "Please do not advertise anything that is not related to the content you find on this app. Avoid self-promotion and commercial interests. ",
  },
  {
    icon: userLockIcon,
    title: "Privacy & Confidentiality",
    content:
      "Protect sensitive information and respect privacy rights. Avoid sharing personal or sensitive data.",
  },
  {
    icon: userLockIcon,
    title: "Constructive Feedback",
    content:
      "Share constructive feedback respectfully, promoting growth and improvement.",
  },
  {
    icon: userLockIcon,
    title: "Positive Impact",
    content:
      "Strive for a positive impact on the community as a whole. As a rule of thumb: Give more than you take.",
  },
  {
    icon: userLockIcon,
    title: "Consequences",
    content:
      "In the event that these guidelines are not followed, you may receive a warning and or be removed from this platform. Our priority is the safety and wellbeing of our members and to ensure their experience remains pleasant.",
  },
];

const ChannelGuidelines = () => {
  return (
    <div className="space-y-5 min-h-screen">
      <Header
        header={{
          title: "Channel Guidelines",
          position: "inline",
        }}
        previousButtonVariant="primary"
      />

      <p className="font-extrabold bg-primary text-white p-4 rounded-xl text-sm text-center">
        Stay Informed And Instantly Connect With Others Who Share Your
        Interests, All In Real Time. To Ensure A Positive Experience For
        Everyone, Please Follow Our Guidelines
      </p>

      <ul className="space-y-4">
        {guidelines.map((guideline, index) => {
          return (
            <li className="flex items-start space-x-2.5" key={index}>
              <img className="w-6 h-6 mt-2.5" src={guideline.icon} alt="" />

              <div className="flex flex-col items-start">
                <h5 className="font-extrabold text-primary">
                  {guideline.title}
                </h5>
                <p className="text-sm font-semibold text-primary">
                  {guideline.content}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChannelGuidelines;
