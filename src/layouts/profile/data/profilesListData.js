/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Images
import kal from 'assets/images/kal-visuals-square.jpg';
import marie from 'assets/images/marie.jpg';
import ivana from 'assets/images/ivana-square.jpg';
import team3 from 'assets/images/team-3.jpg';
import team4 from 'assets/images/team-4.jpg';

export default [
    {
        image: kal,
        name: 'Клиент 1',
        description: 'Текст текст..',
        action: {
            type: 'internal',
            route: '/pages/profile/profile-overview',
            color: 'info',
            label: 'Ответить',
        },
    },
    {
        image: marie,
        name: 'Клиент 2',
        description: 'Текст текст..',
        action: {
            type: 'internal',
            route: '/pages/profile/profile-overview',
            color: 'info',
            label: 'Ответить',
        },
    },
    {
        image: ivana,
        name: 'Клиент Три',
        description: 'Текст описание..',
        action: {
            type: 'internal',
            route: '/pages/profile/profile-overview',
            color: 'info',
            label: 'Ответить',
        },
    },
];
