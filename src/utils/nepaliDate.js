import NepaliDate from "nepali-date-converter";

// AD miti lai BS ma (Nepali wa English akshar ma). Galat miti bhae khali string
export const formatBS = (date, isEn, format = "YYYY MMMM DD") => {
    try {
        return new NepaliDate(new Date(date)).format(format, isEn ? "en" : "np");
    } catch {
        return "";
    }
};

// Miti box ko lagi din, mahina, sal chhuttai
export const bsParts = (date, isEn) => ({
    day: formatBS(date, isEn, "DD"),
    month: formatBS(date, isEn, "MMMM"),
    year: formatBS(date, isEn, "YYYY"),
});
