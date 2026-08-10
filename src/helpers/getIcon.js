import arrowRight from "../../public/icons/arrow-right-solid-full.svg?raw";
import ellipsisVertical from "../../public/icons/ellipsis-vertical.svg?raw";
import paperclip from "../../public/icons/paperclip.svg?raw";
import checkDouble from "../../public/icons/check-double.svg?raw";
import gear from "../../public/icons/gear.svg?raw";
import logout from "../../public/icons/logout.svg?raw";

const ICONS = {
  "arrow-right": arrowRight,
  "ellipsis-vertical": ellipsisVertical,
  "check-double": checkDouble,
  gear,
  paperclip,
  logout,
};

export default (name) => {
  const svg = ICONS[name];

  if (!svg) {
    return "";
  }

  return svg;
};
