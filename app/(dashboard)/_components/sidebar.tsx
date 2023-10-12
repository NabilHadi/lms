"use client";

import Logo from "./logo";
import SideBarRoutes from "./sidebar-routes";

const Sidebar = () => {
  return (
    <div className="h-full border-r felx flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6 flex justify-center">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SideBarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;
