import React from 'react';
import ReactDOM from "react-dom";
import config from '../data/designConfig.json'
import Main from './templates/main';

const data = {
    CustomerInfo : {
        CustomerContactDetails: {
            emailId: 'aa@bb.com',
            phoneNumber: '8028208020'
        },
        CustomerPersonalDetails: {
            Gender: 'M',
            DOB: '11/11/1990'
        }
    },
    AddressInfo : {state: 'TX'},
    OrderInfo:{orderId: '2212'},
    Subscriptions:{SubscriptionId: '11222'}
}

ReactDOM.render(
<Main 
    CustomerInfo={data.CustomerInfo}
    AddressInfo={data.AddressInfo} 
    OrderInfo={data.OrderInfo} 
    Subscriptions={data.Subscriptions} 
    />,
    document.getElementById('root')
);
