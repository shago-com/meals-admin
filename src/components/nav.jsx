// eslint-disable no-unused-vars
import ShopsIcon from '@mui/icons-material/Storefront';
import * as React from 'react';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select'
import Grow from '@mui/material/Grow'
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import FastFoodIcon from '@mui/icons-material/DonutLarge';
import GroupIcon from '@mui/icons-material/Group';
import MenuClosed from '@mui/icons-material/Menu';
import QRCodeIcon from '@mui/icons-material/QrCode';
import SalesIcon from '@mui/icons-material/PriceChange';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Person from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/BalconyRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import Close from '@mui/icons-material/Close';
import ContactsIcon from '@mui/icons-material/Work';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Notifications from '@mui/icons-material/Notifications';
import Search from '@mui/icons-material/Search';
import PaymentsIcon from '@mui/icons-material/Payments';
import StaffIcon from '@mui/icons-material/Badge';
import CouponIcon from '@mui/icons-material/LocalActivity';
import ManagementIcon from '@mui/icons-material/AdminPanelSettings';
import DeliveryIcon from '@mui/icons-material/DeliveryDining';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import {NavLink} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import GlobalStore, { BaseStore } from '../store';
import HelpIcon from '@mui/icons-material/HelpCenter';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CircularProgress from '@mui/material/CircularProgress';
import { ClickAwayListener, Slide } from '@mui/material';
import { useEffect } from 'react';
import { ExitToApp } from '@mui/icons-material';
import { RouteNavigations } from '../routes';
import { BackButton } from '.';




export function Searchbar({ onDataFetch, }){
	const [open, setState] = React.useState(false);
	const [typing, setTypingState] = React.useState(false);
	const [searching, setSearchState] = React.useState(false);
	const [sleepTimer, setSleepTimer] = React.useState(null);

	const [query, setQuery] = React.useState("");
	const [results, setResults] = React.useState(null);
	const text = React.useRef();
	const bar = React.useRef();
	const {notify, axios} = React.useContext(GlobalStore)

	function clearInput(){
		setQuery("");
		setResults(null)
		text.current.focus();
	}

	function onInput(){
		let {value} = text.current
		setQuery(value)
		performSearch(value)
		handleKeyUp()
	}

	function handleKeyUp(ev){
		if ((!query || query === "") && sleepTimer){
			clearTimeout(sleepTimer)
			setResults(null)
		}else{
			setTypingState(false)
			let _timer = setTimeout(() => performSearch(text.current.value), 300)
			setSleepTimer(_timer)
		}		
	}

	function handleKeyDown(ev){
		setTypingState(true)
		// ix
	}

	async function performSearch(){
		let res, data, results;
		setSearchState(true)

		try{
			res = await axios.get(`/find/?query=${text.current.value}`);
			data = await res.data;

			if (res.status === 200){
				console.log("Matches:", res.data)
				setResults(data.matches);

			}else{
				console.log("Error Searching:", data.message)
				notify('error', "An error occurred when searching");
			}
		}catch(err){
			notify('error', "Something went wrong");
		}

		setSearchState(false)

	}


	function toggleBar(){
		setState(!open);
		if(open){
			bar.current.classList.remove('open');
			setResults(null);
		}else{
			bar.current.classList.add('open');
			text.current.focus();
		}
	}

	return(
		<Box ref={bar} className="searchbar-wrapper">
			<Grid container wrap="nowrap" className="searchbar"
			 sx={{
			 	width: open ? '100%' : '45px'
			 }}
			 >
		    <Tooltip title="Toggle Searchbar">	
					<IconButton onClick={toggleBar} className="" sx={{mx: .3, mr: 0}}>
						<Search sx={{color: 'inherit'}}/>
					</IconButton>
				</Tooltip>

				<Grid container wrap="nowrap">
					<input
					 onInput={onInput}
					 onKeyUp={handleKeyUp}
					 onKeyDown={handleKeyDown}
					 ref={text}
					 value={query}
					 type="text"
					 className="search-input" />
			    
			    <Tooltip title="Clear input">	
						<IconButton className="" sx={{mx: .5}}>
							<Close onClick={clearInput} sx={{color: 'inherit'}}/>
						</IconButton>
					</Tooltip>
				</Grid>
			</Grid>

			 {/* <Image key={'' /> */}

			<div className="results-wrapper">
				<div className="search-results">
					<Grid>
						<h3> Results </h3>
						{searching && <CircularProgress variant="indeterminate" color="warning" size={10} />}
					</Grid>

					{results && 
						<div>

							<div> 
								<h4> Food Items </h4>
								{
									results?.food_items?.match?.map((item, idx) => <li> {item.name} </li>)
								}
							</div>
							
							<div> 
								<h4> Orders </h4>
								{
									results?.orders?.match?.map((order, idx) => <li> {order.order_id}</li>)
								}
							</div>

							<div> 
								<h4> Staff </h4>
								{
									results?.staff?.match?.map((staff, idx) => <li> {staff.user.first_name} {staff.user.last_name} </li>)
								}
							</div>
							
							<div> 
								<h4> Customers </h4>
								{
									results?.customers?.match?.map((person, idx) => <li> {person.user.first_name} {person.user.last_name} </li>)
								}
							</div>
						</div>
					}
				</div>
			</div>
		</Box>
	)
}


export function Navbar({ toggleNav }){
	const {theme, switchTheme} = React.useContext(GlobalStore)
	const anchor = React.useRef();
	const [open, setMenuState] = React.useState(false);
	const [navOpen, setNavState] = React.useState(false);

	function onDataFetch(){

	}

	function openMenu(){
		setMenuState(!open)
	};

	return(
		<Box className="navbar no-print">
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 2}}>
				<Tooltip title="Toggle Sidebar">
					<IconButton onClick={toggleNav} className="navbar-toggler">
						<MenuClosed sx={{ color: 'inherit'}} />
					</IconButton>
				</Tooltip>
			</Box>

			<Searchbar onDataFetch={onDataFetch} />

			<Box sx={{ display: 'flex', padding: '0px 10px'}}>
				<Tooltip title="Notifications" size="medium">
					<NavLink to={'/notifications'}>
						<IconButton className="" sx={{mx: 1}}>
							<Notifications sx={{color: 'inherit'}}/>
						</IconButton>
					</NavLink>
				</Tooltip>

				<Tooltip title="Account settings">
					<IconButton id="account-toggle" ref={anchor} onClick={openMenu} className="" sx={{mx: 1}}>
						<Person sx={{color: 'inherit'}}/>
						<AccountMenu open={open} setMenuState={setMenuState} anchor={anchor} />
					</IconButton>
				</Tooltip>

			</Box>
		</Box>
	)
}


export function AccountMenu({ anchor, open, setMenuState }) {
	const {logoutUser} = React.useContext(BaseStore)
	const {redirect, getUserData} = React.useContext(GlobalStore)
	const {user} = getUserData();


	const handleClose = () => {
		setMenuState(false);
	};

	return (
		<Grow>
			<Box className="card">
			<Menu
				anchorEl={anchor.current}
				id="account-menu"
				open={open}
				onClick={handleClose}
				PaperProps={{
				elevation: 0,
				sx: {
					overflow: 'visible',
					mt: 2.5,
					minWidth: '250px',
				},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>

				<Box>
					{/* <Tooltip title="Account settings">
						<Avatar 
							sx={{ 
									mx: 'auto', mb: 3, width: '70px',
									height: '70px', fontWeight: 600, 
									fontSize: '32px'
								}}
							> {`${user?.first_name[0] || ""}${user?.last_name[0]}` || ""} </Avatar>
					</Tooltip> */}
				</Box>

				<MenuItem onClick={() => redirect('/account')} sx={{py: 1.5}}>
					<ListItemIcon>
						<SettingsIcon />
					</ListItemIcon>
					My Account
				</MenuItem>

				<MenuItem onClick={logoutUser} sx={{py: 1.5}}>
					<ListItemIcon>
						<Logout />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
			</Box>
		</Grow>
	);
}


export function Sidebar({ toggleNav, closeNav, brand, ...props }){
	const mobileView = useMediaQuery('(max-width: 768px)');
	const {activeBranch, setActiveBranch, navIsOpen, navView, switchNavView} = React.useContext(GlobalStore);
	const [currentBranch, setCurrentBranch] = React.useState(activeBranch?.branch_id);
	const {authData} = React.useContext(BaseStore);
	const {branches, is_owner, role} = authData;
	const routes = RouteNavigations({ user: authData, role, is_owner, branchId: activeBranch});
	const [Navigations, setNavigations] = React.useState(routes);
	

	function setupNavigation(){
		// determine what navigation links to show
		// fetch the user perms
		// check if user has view permissions for each resource
		// render links if the user can at least view the resource
	}

	React.useEffect(() => {
		setupNavigation()
	}, [activeBranch])

	function switchBranch(branch){
		let toBranch = branches.find((_branch) => _branch.branch_id === branch)
		localStorage.setItem('shago-branch-id', JSON.stringify(toBranch))

		setActiveBranch(toBranch);
		setCurrentBranch(branch)
		setTimeout(() => {window.location.reload()}, 100)
	}

	return(
		<Box ref={props.sidebarRef} className="sidebar no-print">
			<Stack ref={props.sidebarHeaderRef} className="sidebar-header" sx={{
				backgroundColor: 'papayawhip',
				padding: navIsOpen ? '20px 10px' : '5px 10px',
			}}>
				<Box className="brand">
					{ navIsOpen ? 
						<Typography fontWeight={'800'} component="h3" className="navbar-brand link-text"> Shago Meals </Typography>
						: <Avatar sx={{color: 'orange', background: 'lavenderblush', px: 1, py: 1, fontWeight: '800'}}>SM</Avatar>
					}
				</Box>
			</Stack>

			<Slide direction={'left'} in={true}>
				<Stack ref={props.sidebarInnerRef} className="sidebar-inner">
					{
						activeBranch ? 
						<React.Fragment>
							<BackButton label={navIsOpen ? 'Back to Overview' : ''} onClick={console.log} sx={{ mx: 0, }} />
							<BranchSelector onChange={switchBranch} currentBranch={currentBranch} />
							<hr />
						</React.Fragment>
						: null
					}



					{
						Navigations.map(
						({icon, href, label, key, children}) => {
							return (
								<>
									{children ?
										<Stack>
											<hr />
											{navIsOpen && 
												<Typography
													id={key} onClick={mobileView? () => closeNav() : null}
													className={`d-flex`} sx={{background: "lavender !important", borderRadius: 3}}
													px={2}	py={2}
												>
													{icon && icon}
													<Typography ml={2} component="h2" className="link-text"> {label} </Typography>
												</Typography>
											}

											<Stack px={navIsOpen && 1} py={2}>
												{
													children.map(({ icon, href, label, key }) => 
														<Tooltip sx={{ display: navIsOpen ? 'none' : 'initial'}} arrow title={label} placement="right">
															<NavLink className='nav-link-wrapper' to={href}>
																<Button id={key} onClick={mobileView? () => closeNav() : null} className={`nav-link `}>
																	{icon && icon}
																	<Typography component="h2" className="link-text"> {label} </Typography>
																</Button>
															</NavLink>
														</Tooltip>
													)
												}
											</Stack>
										</Stack>
										: 
										<Tooltip sx={{ display: navIsOpen ? 'none' : 'initial'}} arrow title={label} placement="right">
											<NavLink className='nav-link-wrapper' to={href}>
												<Button id={key} onClick={mobileView? () => closeNav() : null} className={`nav-link `}>
													{icon && icon}
													<Typography component="h2" className="link-text"> {label} </Typography>
												</Button>
											</NavLink>
										</Tooltip>
									}
						
								</>
							)
						}
					)}
				</Stack>
			</Slide>

			{mobileView &&
				<IconButton className="nav-btn" onClick={toggleNav}>
					{navIsOpen ?
					<ChevronLeft sx={{m: 0}} className="" />
					:
					<ChevronRight sx={{m: 0}} className="" />
					}
				</IconButton>
			}
		</Box>
	)
}


export const BranchSelector = ({ onChange, currentBranch }) =>{
	const {authData} = React.useContext(BaseStore)
	const {branches, is_owner} = authData;

	return(
		<Select
			value={currentBranch}
			size='small'
			sx={{
				fontSize: '15px',
				fontWeight: 'bold',
				textAlign: 'center',
			}}
			onChange={(ev) => onChange(ev.target.value)}
		>
			{
				branches.map((branch, idx) =>
					<MenuItem
						size="small"
						sx={{fontSize: '15px', fontWeight: 'bold', mb: .25, textWrap: 'wrap', textOverflow: 'ellipsis'}}
						id={branch} value={branch.branch_id}
					> {branch.branch_name} </MenuItem>
				)
			}
		</Select>
	)
}


// <ClickAwayListener onClickAway={navIsOpen ? closeNav : null}>
