export const profileFields = {
    companyName: 'companyName',
    companyDescription: 'companyDescription',
    companyWebsite: 'companyWebsite',
    companyPhone: 'companyPhone',
    contactPersonDetails: 'contactPersonDetails',
    contactPersonName: 'contactPersonName',
    contactPersonPhone: 'contactPersonPhone',
    contactPersonEmail: 'contactPersonEmail',
};

export const dictionaryProfileData = {
    [profileFields.companyName]: 'TITLE',
    [profileFields.companyDescription]: 'DESCRIPTION',
    [profileFields.companyWebsite]: 'WEB',
    [profileFields.contactPersonDetails]: 'UF_CRM_1684102732248', //Контактное лицо (Имя: почта: номер телефона)
    [profileFields.location]: 'UF_CRM_1684102866982', //Локации (адрес;)
    [profileFields.newLocation]: 'UF_CRM_1692176867840', //Адрес (Новый)
    [profileFields.messageClient]: 'UF_CRM_1692176867840', //Указать в сообщении для клиента (Дополнительная информация)
};

export const documentData = [
    {
        name: 'Документ1',
        link: 'https://docs.google.com/document/d/1ZHzOgjpgHXLj0sa4kd3swMVWgDbBlKA-TqIZibNnTEU/edit?tab=t.0',
    },
    {
        name: 'Документ2',
        link: 'https://docs.google.com/document/d/1ZHzOgjpgHXLj0sa4kd3swMVWgDbBlKA-TqIZibNnTEU/edit?tab=t.0',
    },
    {
        name: 'Документ3',
        link: 'https://docs.google.com/document/d/1ZHzOgjpgHXLj0sa4kd3swMVWgDbBlKA-TqIZibNnTEU/edit?tab=t.0',
    },
    {
        name: 'Документ4',
        link: 'https://docs.google.com/document/d/1ZHzOgjpgHXLj0sa4kd3swMVWgDbBlKA-TqIZibNnTEU/edit?tab=t.0',
    },
];

export const notificationChannelsConfig = {
    WA: false,
    SMS: false,
    Email: false,
    TG: false,
};
