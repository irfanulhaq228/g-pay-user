import logo2 from "../../assets/logo2.png";
import Royal247Logo from "../../assets/Royal247Logo.png";

export default function Header() {

  return (
    <div className="flex justify-between items-center bg-[--main-light] p-4 lg:px-10 h-[66px] overflow-hidden">
      <div className="flex items-center space-x-2 overflow-hidden">
        <img className="w-[160px] object-contain" src={Royal247Logo} alt="" />
      </div>
      <div>
        <img className="h-12" src={logo2} alt="" />
      </div>
    </div>


  );
}
