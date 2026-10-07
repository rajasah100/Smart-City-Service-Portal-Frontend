import { useTranslation } from "react-i18next";
import { FaCalendarAlt } from "react-icons/fa";
import PageHero from "../../common/PageHero";

const EventHero = () => {
    const { t } = useTranslation();

    return (
        <PageHero
            icon={FaCalendarAlt}
            badge={t("hero.events.badge")}
            title={t("hero.events.title")}
            description={t("hero.events.description")}
        />
    );
};

export default EventHero;
