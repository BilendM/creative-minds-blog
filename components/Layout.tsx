import Nav from "./Nav";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="mx-6 md:max-w-2xl md:mx-auto font-poppins">
      <Nav />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
