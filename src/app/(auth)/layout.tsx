interface LayoutProps {
  children: React.RectNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default Layout;
