import { CgClose } from 'react-icons/cg';
import { FaTrash } from 'react-icons/fa';
import { CiLogin, CiLogout, CiMail, CiEdit } from 'react-icons/ci';
import { FiArrowLeft, FiClock, FiDownload } from 'react-icons/fi';
import { IoMdCalendar } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { IconName } from '../../utils';

export interface IconProps {
  name: IconName | string;
  className?: string;
}

const Icon = ({ name, className }: IconProps) => {
  switch (name) {
    case IconName.calendar:
      return <IoMdCalendar className={className} />;
    case IconName.time:
      return <FiClock className={className} />;
    case 'logout':
      return <CiLogout className={className} />;
    case 'login':
      return <CiLogin className={className} />;
    case 'mail':
      return <CiMail className={className} />;
    case 'edit':
      return <CiEdit className={className} />;
    case IconName.back:
      return <FiArrowLeft className={className} />;
    case IconName.dropdownArrow:
      return <MdKeyboardArrowDown className={className} />;
    case IconName.close:
      return <CgClose className={className} />;
    case IconName.remove:
      return <FaTrash className={className} />;
    case IconName.download:
      return <FiDownload className={className} />;
    case IconName.user:
      return (
        <svg
          width="54"
          height="54"
          className={className}
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M27 29.25C33.2132 29.25 38.25 24.2132 38.25 18C38.25 11.7868 33.2132 6.75 27 6.75C20.7868 6.75 15.75 11.7868 15.75 18C15.75 24.2132 20.7868 29.25 27 29.25Z"
            stroke="#2671D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M45 47.25C45 42.4761 43.1036 37.8977 39.7279 34.5221C36.3523 31.1464 31.7739 29.25 27 29.25C22.2261 29.25 17.6477 31.1464 14.2721 34.5221C10.8964 37.8977 9 42.4761 9 47.25"
            stroke="#2671D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case IconName.userLogo:
      return (
        <svg
          width="55"
          height="54"
          className={className}
          viewBox="-3 -5 63 63"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="28"
            cy="28"
            r="26"
            stroke="#2671D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="28"
            cy="19"
            r="7"
            stroke="#2671D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.7 48.3C12.7 39.8 19.6 33 28 33C36.4 33 43.3 39.8 43.3 48.3"
            stroke="#2671D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case IconName.anonym:
      return (
        <svg
          width="54"
          height="54"
          viewBox="0 0 54 54"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_22_915)">
            <path
              d="M6.75 23.625H47.25"
              stroke="#2671D9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.5 23.625L18.0675 10.125L26.46 16.1325L34.83 10.125L40.5 23.625"
              stroke="#2671D9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M34.875 40.5C37.3603 40.5 39.375 38.4853 39.375 36C39.375 33.5147 37.3603 31.5 34.875 31.5C32.3897 31.5 30.375 33.5147 30.375 36C30.375 38.4853 32.3897 40.5 34.875 40.5Z"
              stroke="#2671D9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19.125 40.5C21.6103 40.5 23.625 38.4853 23.625 36C23.625 33.5147 21.6103 31.5 19.125 31.5C16.6397 31.5 14.625 33.5147 14.625 36C14.625 38.4853 16.6397 40.5 19.125 40.5Z"
              stroke="#2671D9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23.625 36H30.375"
              stroke="#2671D9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_22_915">
              <rect width="54" height="54" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );

    default:
      return null;
  }
};

export default Icon;
