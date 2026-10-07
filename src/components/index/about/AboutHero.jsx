import { useTranslation } from "react-i18next";
import { FaCity } from "react-icons/fa";
import PageHero from "../../common/PageHero";

const AboutHero = () => {
    const { t } = useTranslation();

    return (
        <PageHero
            icon={FaCity}
            badge={t("hero.about.badge")}
            title={t("hero.about.title")}
            description={t("hero.about.description")}
        />
    );
};

export default AboutHero;
