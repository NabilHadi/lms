"use client";

import { Category } from "@prisma/client";
import { FcDatabase } from "react-icons/fc";
import { GiArtificialHive } from "react-icons/gi";
import { BsRobot } from "react-icons/bs";
import {
  AiOutlineHtml5,
  AiOutlineMobile,
  AiOutlineDatabase,
} from "react-icons/ai";
import { FaComputer } from "react-icons/fa6";
import { FaNetworkWired } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import CategoryItem from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  "Artificial Intelligence": GiArtificialHive,
  "Data Science": AiOutlineDatabase,
  "Machine Learning": BsRobot,
  "Web Development": AiOutlineHtml5,
  "Mobile Development": AiOutlineMobile,
  "Computer Science": FaComputer,
  "Information Technology": FaNetworkWired,
};

const Categories = ({ items }: CategoriesProps) => {
  return (
    <div
      data-test="catogries-container"
      className="flex items-center gap-x2 overflow-x-auto pb-2"
    >
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};

export default Categories;
