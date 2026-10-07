// Backend ko utils/serviceArea.js jastai: yo department le yo thau ko gunaso herchha ki?
// Khali province = pura Nepal, khali district = pura pradesh, khali municipalities = pura jilla
export const coversLocation = (area = {}, location = {}) => {
    if (!area?.province) return true;
    if (area.province !== location.province) return false;

    if (!area.district) return true;
    if (area.district !== location.district) return false;

    if (!area.municipalities?.length) return true;
    return area.municipalities.includes(location.municipality);
};
