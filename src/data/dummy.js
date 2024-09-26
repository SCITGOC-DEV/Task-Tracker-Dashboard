import React from "react";
import { GoTasklist } from "react-icons/go";

import { FiUsers } from "react-icons/fi";
import { BsCurrencyDollar } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { BiCategoryAlt } from "react-icons/bi";
import { MdOutlineDashboard } from "react-icons/md";
import product5 from "./product5.jpg";
import product6 from "./product6.jpg";
import product7 from "./product7.jpg";
import { format } from "date-fns";
import { RiMapPin2Line } from "react-icons/ri";
import { AiOutlineSolution } from "react-icons/ai";
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "MM/dd/yyyy/hh:mm a"); // Customize the format as needed
};

export const gridOrderImage = (props) => (
  <div>
    <img
      className="rounded-xl h-20 md:ml-3"
      src={props.ProductImage}
      alt="order-item"
    />
  </div>
);

export const gridOrderStatus = (props) => (
  <button
    type="button"
    style={{ background: props.StatusBg }}
    className="text-white py-1 px-2 capitalize rounded-2xl text-md"
  >
    {props.Status}
  </button>
);

const gridEmployeeProfile = (props) => (
  <div className="flex items-center gap-2">
    <img
      className="rounded-full w-10 h-10"
      src={props.EmployeeImage}
      alt="employee"
    />
    <p>{props.Name}</p>
  </div>
);

const gridEmployeeCountry = (props) => (
  <div className="flex items-center justify-center gap-2">
    <GrLocation />
    <span>{props.Country}</span>
  </div>
);
const customerGridImage = (props) => (
  <div className="image flex gap-4">
    <img
      className="rounded-full w-10 h-10"
      src={props.CustomerImage}
      alt="employee"
    />
    <div>
      <p>{props.CustomerName}</p>
      <p>{props.CustomerEmail}</p>
    </div>
  </div>
);

const customerGridStatus = (props) => (
  <div className="flex gap-2 justify-center items-center text-gray-700 capitalize">
    <p
      style={{ background: props.StatusBg }}
      className="rounded-full h-3 w-3"
    />
    <p>{props.Status}</p>
  </div>
);

export const links = [
  {
    title: "Dashboard",
    links: [
      {
        name: "dashboard",
        href: "/",
        icon: <MdOutlineDashboard />,
      },
    ],
  },
  {
    title: "Pages",
    links: [
      {
        name: "users",
        href: "/users",
        icon: <FiUsers />,
      },
      {
        name: "tasks",
        href: "/tasks",
        icon: <GoTasklist />,
      },
      {
        name: "locations",
        href: "/locations",
        icon: <RiMapPin2Line />,
      },
      {
        name: "tracking tasks",
        href: "/trackings",
        icon: <AiOutlineSolution />,
      },
      {
        name: "inventory categories",
        href: "/inventory-categories",
        icon: <BiCategoryAlt />,
      },
    ],
  },
];

export const projectAdminOptions = [
  {
    title: "Dashboard",
    links: [
      {
        name: "dashboard",
        href: "/",
        icon: <MdOutlineDashboard />,
      },
    ],
  },
  {
    title: "Pages",
    links: [
      {
        name: "users",
        href: "/users",
        icon: <FiUsers />,
      },
      {
        name: "tasks",
        href: "/tasks",
        icon: <GoTasklist />,
      },
      {
        name: "locations",
        href: "/locations",
        icon: <RiMapPin2Line />,
      },
      {
        name: "inventory categories",
        href: "/inventory-categories",
        icon: <BiCategoryAlt />,
      },
    ],
  },
];

export const cartData = [
  {
    image: product5,
    name: "butterscotch ice-cream",
    category: "Milk product",
    price: "$250",
  },
  {
    image: product6,
    name: "Supreme fresh tomato",
    category: "Vegetable Item",
    price: "$450",
  },
  {
    image: product7,
    name: "Red color candy",
    category: "Food Item",
    price: "$190",
  },
];

export const themeColors = [
  {
    name: "blue-theme",
    color: "#1A97F5",
  },
  {
    name: "green-theme",
    color: "#0C1FA2",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#CDBF7D",
  },
  {
    color: "#FB9678",
    name: "orange-theme",
  },
];

export const userProfileData = [
  {
    icon: <BsCurrencyDollar />,
    title: "My Profile",
    desc: "Account Settings",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    href: "/profile",
  },
];
