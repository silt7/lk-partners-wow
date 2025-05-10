import { dictionaryProfileData, profileFields } from './config';

export const normalizeProfileData = (response) => {
    const contactPersonDetails =  response[dictionaryProfileData.contactPersonDetails].split(': ');
    const companyWebsite = response[dictionaryProfileData.companyWebsite].map(({VALUE}) => VALUE);

    console.log( response[dictionaryProfileData.contactPersonDetails]);

    return {
        headerData: {
            [profileFields.companyName]:
                response[dictionaryProfileData.companyName],
            [profileFields.companyDescription]:
                response[dictionaryProfileData.companyDescription] ??
                'Описание',
        },
        mainInfo: {
            [profileFields.companyWebsite]: companyWebsite,
            [profileFields.contactPersonName]: contactPersonDetails[0] ?? '',
            [profileFields.contactPersonEmail]: contactPersonDetails[1] ?? '',
            [profileFields.contactPersonPhone]: contactPersonDetails[2] ?? '',
        }
    };
};
