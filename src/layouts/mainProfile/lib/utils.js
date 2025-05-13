import { dictionaryProfileData, profileFields } from './config';


export const normalizeProfileData = (response) => {
    // Проверяем, что response существует и это объект
    if (!response || typeof response !== 'object') {
        console.warn('Некорректный response', response);
        return getDefaultProfileData(); // Возвращаем дефолтные данные
    }

    // Получаем контактное лицо
    const contactPersonRaw = response[dictionaryProfileData.contactPersonDetails];
    const contactPersonDetails = typeof contactPersonRaw === 'string'
        ? contactPersonRaw.split(': ')
        : ['', '', ''];

    // Получаем сайт компании
    const companyWebsite = Array.isArray(response[dictionaryProfileData.companyWebsite])
        ? response[dictionaryProfileData.companyWebsite].map(item => item.VALUE)
        : [];

    return {
        headerData: {
            [profileFields.companyName]: response[dictionaryProfileData.companyName] ?? '',
            [profileFields.companyDescription]: response[dictionaryProfileData.companyDescription] ?? 'Описание',
        },
        mainInfo: {
            [profileFields.companyWebsite]: companyWebsite,
            [profileFields.contactPersonName]: contactPersonDetails[0] ?? '',
            [profileFields.contactPersonEmail]: contactPersonDetails[1] ?? '',
            [profileFields.contactPersonPhone]: contactPersonDetails[2] ?? '',
        },
        schedule: {},
        requisites: {},
        additionalInfo: {}
    };
};

// Дефолтная структура на случай ошибки
const getDefaultProfileData = () => ({
    headerData: {
        companyName: '',
        companyDescription: 'Описание',
    },
    mainInfo: {
        companyWebsite: [],
        contactPersonName: '',
        contactPersonEmail: '',
        contactPersonPhone: '',
    },
    schedule: {},
    requisites: {},
    additionalInfo: {}
});


// export const normalizeProfileData = (response) => {
//     // Получаем данные контактного лица, если они есть
//     const contactPersonRaw = response?.[dictionaryProfileData.contactPersonDetails];
//     const contactPersonDetails = typeof contactPersonRaw === 'string'
//         ? contactPersonRaw.split(': ')
//         : ['', '', '']; // Значения по умолчанию
//
//     // Получаем сайт компании, если он есть
//     const companyWebsite = Array.isArray(response?.[dictionaryProfileData.companyWebsite])
//         ? response[dictionaryProfileData.companyWebsite].map(({ VALUE }) => VALUE)
//         : [];
//     // const contactPersonDetails =  response[dictionaryProfileData.contactPersonDetails].split(': ');
//     // const companyWebsite = response[dictionaryProfileData.companyWebsite].map(({VALUE}) => VALUE);
//
//     // console.log( response[dictionaryProfileData.contactPersonDetails]);
//
//     return {
//         // 1. Основная информация
//         headerData: {
//             [profileFields.companyName]: response[dictionaryProfileData.companyName],
//             [profileFields.companyDescription]:
//             response[dictionaryProfileData.companyDescription] ??
//             'Описание',
//         },
//         //2. Выбор канала оповещений (WhatsApp, Telegram, SMS, Email)
//
//         // 3. Контактные данные
//         mainInfo: {
//             [profileFields.companyWebsite]: companyWebsite,
//             [profileFields.contactPersonName]: contactPersonDetails[0] ?? '',
//             [profileFields.contactPersonEmail]: contactPersonDetails[1] ?? '',
//             [profileFields.contactPersonPhone]: contactPersonDetails[2] ?? '',
//         },
//         // 4. Локация и рабочее время
//         schedule: {
//             // [profileFields.location]: location,
//             // [profileFields.newLocation]: newLocation[0] ?? ''
//         },
//         // 5. реквизиты
//         requisites: {
//
//         },
//         // 8. Дополнительная информация
//         additionalInfo: {
//             // [profileFields.messageClient]: messageClient
//         }
//     };
// };
