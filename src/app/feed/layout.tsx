interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <nav>Im a navbar</nav>
      <div>{children}</div>
    </div>
  );
};

export default Layout;
