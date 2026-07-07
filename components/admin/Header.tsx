interface HeaderProps {
  subtitle: string;
  type?: 'admin' | 'user';
}

const Header = ({ subtitle, type = 'user' }: HeaderProps) => (
  <div className="w-full h-[148px] pad:h-[260px] bg-gray-5 py-8 pad:py-16 flex flex-col justify-center items-center px-4">
    <div className="w-full pad:w-[786px] dt:w-[1200px] h-full flex flex-col gap-6">
      <p className="text-[36px] pad:text-[64px] font-semibold leading-none">
        Admin
      </p>
      <p className="text-[16px] pad:text-[24px] font-semibold">{subtitle}</p>
    </div>
  </div>
);

export default Header;
