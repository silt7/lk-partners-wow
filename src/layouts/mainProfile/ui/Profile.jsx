import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

import { Header } from './Header';
import { Content } from './Content';

import useGetProfile from '../hooks/useGetProfile';

export const Profile = () => {
    const data = useGetProfile();

    // console.log('profle data', data);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Header {...data.headerData} />
            <Content
                mainInfo={data.mainInfo}
                schedule={data.schedule}
                requisites={data.requisites}
                additionalInfo={data.additionalInfo}
            />
        </DashboardLayout>
    );
};
