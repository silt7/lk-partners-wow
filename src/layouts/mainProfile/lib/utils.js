import { dictionaryProfileData, profileFields } from './config';

export const normalizeProfileData = (response) => {
    const contactPersonDetails =  response[dictionaryProfileData.contactPersonDetails].split(': ');
    const companyWebsite = response[dictionaryProfileData.companyWebsite].map(({VALUE}) => VALUE);

    // console.log( response[dictionaryProfileData.contactPersonDetails]);

    return {
        // 1. Основная информация
        headerData: {
            [profileFields.companyName]:
                response[dictionaryProfileData.companyName],
            [profileFields.companyDescription]:
            response[dictionaryProfileData.companyDescription] ??
            'Описание',
        },
        //2. Выбор канала оповещений (WhatsApp, Telegram, SMS, Email)

        // 3. Контактные данные
        mainInfo: {
            [profileFields.companyWebsite]: companyWebsite,
            [profileFields.contactPersonName]: contactPersonDetails[0] ?? '',
            [profileFields.contactPersonEmail]: contactPersonDetails[1] ?? '',
            [profileFields.contactPersonPhone]: contactPersonDetails[2] ?? '',
        },
        // 4. Локация и рабочее время
        schedule: {
            // [profileFields.location]: location,
            // [profileFields.newLocation]: newLocation[0] ?? ''
        },
        // 5. реквизиты
        requisites: {

        },
        // 8. Дополнительная информация
        additionalInfo: {
            // [profileFields.messageClient]: messageClient
        }
    };
};
