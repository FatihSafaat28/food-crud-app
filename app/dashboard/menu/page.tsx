import { MenuCategory } from "../components/card-menu-category";
import { MenuItems } from "../components/card-menu-items";

export default function Menu() {
  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 items-end">
          <MenuCategory />
        </div>
        <div className="flex flex-col gap-4 items-end">
          <MenuItems />
        </div>
      </div>
    </div>
  );
}
