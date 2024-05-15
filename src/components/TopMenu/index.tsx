import { SyButton, SyModeSwitch } from "@purplebureau/sy-react";
import logo from "../../img/curia-logo.svg";
import "./topMenu.scss";
import { useTranslation } from "react-i18next";
import tabs from "../../locales/fi/tabs.json";
import { keys } from "../../utils/objectKeys";

type TopMenuProps = {
  currentTab: string;
  onTabClick: (name: string) => void;
  onLogoClick: () => void;
};

export function TopMenu({ currentTab, onTabClick, onLogoClick }: TopMenuProps) {
  const { t } = useTranslation();
  const tabNames = keys(tabs);

  const handleTabClick = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTabClick(name);
  };

  return (
    <div className={"top-menu"}>
      <img src={logo} className={"main-logo"} onClick={onLogoClick} />
      <h1>Curia</h1>
      <div className={"sections-container"}>
        {tabNames.map((name) => (
          <SyButton
            key={name}
            variant={"tab-link"}
            onClick={(e) => handleTabClick(name, e)}
            className={name === currentTab ? "active hydrated" : "hydrated"}
          >
            {t(`tabs:${name}`)}
          </SyButton>
        ))}
      </div>
      <div className={"theme-container"}>
        <SyModeSwitch />
      </div>
    </div>
  );
}
