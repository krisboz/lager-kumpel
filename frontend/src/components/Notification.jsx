import useNotificationStore from "./../zustand/useNotificationStore";
import "../styles/Notification.scss";
import { BiErrorAlt as Error } from "react-icons/bi";
import {
  RiAlarmWarningLine as Warning,
  RiInformationLine as Info,
} from "react-icons/ri";

const Notification = () => {
  const icons = {
    info: <Info />,
    warning: <Warning />,
    error: <Error />,
  };
  const notifications = useNotificationStore((state) => state.notifications);

  if (notifications.length > 0) {
    return (
      <div className="notification-container">
        {notifications.reverse().map((notification, index) => (
          <div
            key={Math.floor(Math.random() * 1000000)}
            className={`notification notification-${notification.type}`}
          >
            <div className="icon-container">
              {icons[`${notification.type}`]}
            </div>
            {notification.message}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default Notification;
