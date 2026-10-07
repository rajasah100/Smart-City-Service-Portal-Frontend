import { useTranslation } from "react-i18next";
import { GoReport } from "react-icons/go";
import PageHero from "../common/PageHero";

const Header = () => {
  const { t } = useTranslation();

  return (
    <PageHero
      icon={GoReport}
      badge={t("hero.complaint.badge")}
      title={t("hero.complaint.title")}
      description={t("hero.complaint.description")}
    />
  )
}

export default Header
