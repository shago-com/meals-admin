import React, {Fragment, useEffect, useState, useContext} from 'react';
import {BarChart} from '../../components'
import GlobalStore from '../../store';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {DashboardLoader} from '../../components/loaders';
import {Page} from '../../components/index';
import Stack from '@mui/material/Stack';
import TabBar from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BillingControls from './Billing';
import BusinessControls from './Business';
import SiteControls from './Site';

const TabView = ({ children, value, label, id, tabProps, ...props }) => {
	return(
		<div
	      role="tabpanel"
	      hidden={value !== id}
	      id={`simple-tabpanel-${label}`}
	      aria-labelledby={`simple-tab-${label}`}
	      {...props}
	    >
	    { value === id &&

			<Box {...tabProps}>
				{children}
			</Box>
	    }
		</div>
	)
}

export const SettingsPage = ({ ...props }) => {
	const {axios, notify, parseDate} = useContext(GlobalStore);
	const [data, setData] = useState(null);
	const [selectedTab, setTab] = useState(0);
	const [chosenTab, setChosenTab] = useState(null);
	const [loading, setLoadingState] = useState(true);

	async function getData(){
		try{
			const res = await axios.get(`/manage/`);
			
			if (res.status === 200){
				setData(res.data.data);
				console.log("STORE DATA:", res.data)
				notify('success', "Got Data")
			}else{
				console.log("Error fetching data:")
				notify('error', res.data.message)
			}
		}catch(err){
			notify('error', err.message)
			console.log("Error fetching data:", err)
		}
	}

	function init(){
		if(!loading){
			setLoadingState(true)
		}
		getData();
		setTimeout(() => setLoadingState(false), 1200);
	}

	useEffect(() => {
		init();
	}, [])

	function changeTab(event, newTab){
		setTab(newTab)
		setChosenTab(newTab)
	}

	if (loading){
		return(
			<Page>
				<DashboardLoader loading={loading} />
			</Page>
		)
	}

	return(
		<Page>
			<Box className="titlebar" sx={{my: 2, mb: 4}}>
				<Typography component="h2" className="title"> Settings & Preferences </Typography>
			</Box>

			<Box className=""
				sx={{
					width: '100% !important',
					pb: 7, pt: 0,
				}}
			>
				<TabBar 
					variant="scrollable"
					value={selectedTab}
					allowScrollButtonsMobile
					textColor="secondary"
					onChange={changeTab}
					sx={{backgroundColor: '#fff', mx: 'auto', width: '100%', borderRadius: 5, mb: 3}}
				 >
					<Tab label="Business info" id="biz-info"/>
					<Tab label="Billing and Payments" id="billing"/>
					<Tab label="Site Configurations" id="site"/>
				</TabBar>

				<Box sx={{ py: 2, mx: 'auto', width: '100%', }}>
					<TabView id={0} value={selectedTab} label={'biz-info'}>
						<BusinessControls initFunction={init} data={data} sx={{px: 2,}} />
					</TabView>

					<TabView id={1} value={selectedTab} label={'billing'}>
						<BillingControls initFunction={init} data={data} sx={{px: 2,}} />
					</TabView>

					<TabView id={2} value={selectedTab} label={'site'}>
						<SiteControls initFunction={init} data={data} sx={{px: 2,}} />
					</TabView>
				</Box>
			</Box>
		</Page>
	)
}


export default SettingsPage;
