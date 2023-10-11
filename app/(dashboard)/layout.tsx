import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";

const DashboradLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[88px] md:pl-56 fixed inset-y-0 w-full">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 h-full pt-[88px]">{children}</main>
    </div>
  );
};

export default DashboradLayout;
