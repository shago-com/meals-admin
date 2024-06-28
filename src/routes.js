// eslint-disable no-unused-vars
import ShopsIcon from '@mui/icons-material/Storefront';
import * as React from 'react';
import FastFoodIcon from '@mui/icons-material/DonutLarge';
import GroupIcon from '@mui/icons-material/Group';
import QRCodeIcon from '@mui/icons-material/QrCode';
import SalesIcon from '@mui/icons-material/PriceChange';
import DashboardIcon from '@mui/icons-material/BalconyRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentsIcon from '@mui/icons-material/Payments';
import StaffIcon from '@mui/icons-material/Badge';
import CouponIcon from '@mui/icons-material/LocalActivity';
import ManagementIcon from '@mui/icons-material/AdminPanelSettings';
import DeliveryIcon from '@mui/icons-material/DeliveryDining';
import HelpIcon from '@mui/icons-material/HelpCenter';
import AnalyticsIcon from '@mui/icons-material/Analytics';




export const RouteNavigations = ({ user, role, branchId, isOwner }) => {
    // console.log("USER ROLE:", user, role)

    if (role === 'owner' || 'admin'){
        return [	      		
            {
                href: '/dashboard',
                key: 'dashboard',
                requiresAdmin: false,
                icon: <DashboardIcon className="icon" />,
                label: 'Dashboard'
            },
            {
                key: 'sales',
                requiresAdmin: true,
                label: 'Sales',
                icon: <SalesIcon className="icon" />,
                type: 'dropdown',
                children: [
                    {
                        href: '/menu',
                        key: 'menu',
                        requiresAdmin: false,
                        icon: <FastFoodIcon className="icon" />,
                        label: 'Food Menu'
                    },
                    {
                        href: '/orders',
                        key: 'orders',
                        requiresAdmin: true,
                        icon: <DeliveryIcon className="icon" />,
                        label: 'Orders'
                    },
                    {
                        href: '/coupons',
                        key: 'coupons',
                        requiresAdmin: true,
                        icon: <CouponIcon className="icon" />,
                        label: 'Coupons'
                    },
                    {
                        href: '/customers',
                        key: 'customers',
                        requiresAdmin: true,
                        icon: <GroupIcon className="icon" />,
                        label: 'Customers'
                    },
                    // {
                    //     href: '/qr-codes',
                    //     key: 'qr-codes',
                    //     requiresAdmin: true,
                    //     icon: <QRCodeIcon className="icon" />,
                    //     label: 'QR Codes'
                    // },
                ]
            },
            {
                key: 'management',
                requiresAdmin: true,
                label: 'Management',
                icon: <ManagementIcon className="icon" />,
                type: 'dropdown',
                children: [
                    {
                        href: '/branches',
                        key: 'branches',
                        requiresAdmin: true,
                        icon: <ShopsIcon className="icon" />,
                        label: 'Store Locations'
                    },
                    {
                        href: '/staff',
                        key: 'staff',
                        requiresAdmin: true,
                        icon: <StaffIcon className="icon" />,
                        label: 'Staff Accounts'
                    },
                    // {
                    //     href: '/billing',
                    //     key: 'billing',
                    //     requiresAdmin: true,
                    //     icon: <PaymentsIcon className="icon" />,
                    //     label: 'Billing and Payments'
                    // },
                    // {
                    //     href: '/analytics',
                    //     key: 'analytics',
                    //     requiresAdmin: true,
                    //     icon: <AnalyticsIcon className="icon" />,
                    //     label: 'Analytics'
                    // },
                    {
                        href: '/settings',
                        key: 'settings',
                        requiresAdmin: true,
                        icon: <SettingsIcon className="icon" />,
                        label: 'Settings'
                    },
                ]
            },
            {
                href: '/help',
                key: 'help',
                requiresAdmin: false,
                icon: <HelpIcon className="icon" />,
                label: 'Help'
            },
        ]
    }else{
        return [	      		
            {
                href: '/dashboard',
                key: 'dashboard',
                requiresAdmin: false,
                icon: <DashboardIcon className="icon" />,
                label: 'Dashboard'
            },
            {
                key: 'sales',
                requiresAdmin: true,
                label: 'Sales',
                icon: <SalesIcon className="icon" />,
                type: 'dropdown',
                children: [
                    {
                        href: '/menu',
                        key: 'menu',
                        requiresAdmin: false,
                        icon: <FastFoodIcon className="icon" />,
                        label: 'Food Menu'
                    },
                    {
                        href: '/orders',
                        key: 'orders',
                        requiresAdmin: true,
                        icon: <DeliveryIcon className="icon" />,
                        label: 'Orders'
                    },
                    {
                        href: '/coupons',
                        key: 'coupons',
                        requiresAdmin: true,
                        icon: <CouponIcon className="icon" />,
                        label: 'Coupons'
                    },
                    {
                        href: '/customers',
                        key: 'customers',
                        requiresAdmin: true,
                        icon: <GroupIcon className="icon" />,
                        label: 'Customers'
                    },
                ]
            },
            {
                href: '/help',
                key: 'help',
                requiresAdmin: false,
                icon: <HelpIcon className="icon" />,
                label: 'Help'
            },
        ]
    }

}