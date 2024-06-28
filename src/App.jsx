import './styles/loader.css';
import './styles/global.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { 
  BrowserRouter, Link, Route, Routes,
  useNavigate, useParams
} from 'react-router-dom';
import {GlobalStore, BaseStore} from './store';
import {Navbar, Sidebar} from './components/nav';
import { Page, MessageBar, AskConfirmationModal, ErrorUI } from '../src/components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Helmet} from 'react-helmet'
// Pages
import LoginPage from './templates/auth/Login';
import SignupPage from './templates/auth/Signup';

import DashboardPage from './templates/Dashboard';

import MenuAddPage from './templates/menu/Create';
import MenuDetailPage from './templates/menu/Detail';
import MenuListPage from './templates/menu/Home';
import CategoryManagePage from './templates/menu/Categories';

import OrderAddPage from './templates/order/Create';
import OrderDetailPage from './templates/order/Detail';
import OrderListPage from './templates/order/Home';

import StaffAddPage from './templates/staff/Create';
import StaffDetailPage from './templates/staff/Detail';
import StaffListPage from './templates/staff/Home';
import StaffRolesListPage from './templates/staff/roles/Home';

import CustomerAddPage from './templates/customers/Create';
import CustomerListPage from './templates/customers/Home';

import BranchAddPage from './templates/branches/Create';
import BranchDetailPage from './templates/branches/Detail';
import BranchHomePage from './templates/branches/Home';

import SettingsPage from './templates/settings/Home';
import AccountPage from './templates/account/Home';
import ChangePasswordPage from './templates/account/ChangePassword';
import { Grid } from '@mui/material';
import NotificationsHomePage from './templates/notifications/Home';
import QRCodeHomePage from './templates/qr-codes/Home';
import CouponHomePage from './templates/coupons/Home';


const { localStorage } = window;
const apiUrl = `http://localhost/api/admin`;
// const apiUrl = `http://192.168.43.21:80/api/dashboard`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.setState({ ...this.state, error: error })
    console.log(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Render Error UI
      // Use Error Codes for Dynamic error messages
      return (
        <ErrorUI error={this.state.error} />
      );
    }

    return this.props.children;
  }
}

export const CurrencyMaps = {
  'NGN': '₦',
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
}

export const AppLoadScreen =()=>{
  const [isLoggedIn, setLoginState] = useState(false);
  const [isLoading, setLoadingState] = useState(true);
  // eslint-disable-next-line
  const [workspace, setWorkspace] = useState(null)
  const [authData, setAuthData] = useState(null)
  const redirect = (href) => {document.location.href = href}
  const {store} = useParams()

  function getLoginState(){
    const authState = localStorage.getItem('shago-auth-user');
    if(authState === undefined || authState === null){
      return false
    }else{
      return true
    }
  }

  function logoutUser(){
    localStorage.removeItem('shago-auth-user');
    setLoadingState(true)
    setLoginState(false)
    redirect('/login')
  }

  async function createAppManifest(_data){
    const {place} = JSON.parse(_data)
    document.title = place?.name
    const data = JSON.stringify({
      "short_name": place.name,
      "name": place.name,
      "icons": [
        {
          "src": place?.logo || "favicon.ico",
          "sizes": "64x64 32x32 24x24 16x16",
          "type": "image/x-icon"
        },
        {
          "src": place?.logo || "logo192.png",
          "type": "image/png",
          "sizes": "192x192"
        },
        {
          "src": place?.logo || "logo512.png",
          "type": "image/png",
          "sizes": "512x512"
        }
      ],
      "start_url": ".",
      "display": "standalone",
      "theme_color": "#000000",
      "background_color": "#ffffff"
    })
    const file = new Blob([data,], {
      type: 'text/json'
    })

    const element = document.createElement("meta", {})
    let url = URL.createObjectURL(file)
    // .replace('blob:', '')
    // console.log("Loading Manifest...", (data) )
    element.content = `${url}.json`;
    element.name = "manifest"
    const text = await file.text()
    console.log("Manifest:", JSON.parse(text))
    

    // // return element
    document.head.insertAdjacentElement(
      'beforeend',
      element
    )
    return {element, url: `${url}.json`}
  }

  function onLoginSuccess({ user, token, role, ...data}){
    localStorage.setItem('shago-auth-user', JSON.stringify({user, token, role}));
    localStorage.setItem('shago-place-id', data.place.slug)
    localStorage.setItem('shago-branch-id', JSON.stringify(data.main_branch))
    localStorage.setItem('shago-auth-data', JSON.stringify({...data}))

    document.title = data.place.name;

    setWorkspace(data.place);
    setAuthData(data)
    setLoginState(true);
  }

  // useEffect((effect, deps) => {
  //   const _store = JSON.parse(localStorage.getItem('store'));
  //   const storeInLocalStorage = (_store !== '' || store !== null); // make sure store is not null or empty

  //   console.log("Effect:", effect);
  //   console.log("Deps:", deps);
  //   if (storeInLocalStorage){
  //     return redirect('/')
  //   }else{
  //     localStorage.setItem('store', store)
  //     setTimeout(() => redirect('/'), 2000)
  //   }
  // })

  useEffect(() => {
    setLoginState(getLoginState())
    if (authData === null){
      let _data = JSON.parse(localStorage.getItem('shago-auth-data'))
      setAuthData(_data)
    }
    setTimeout(() => setLoadingState(false), 2000)
    //eslint-disable-next-line
  }, [isLoggedIn])


  const ctx = {
    apiUrl,
    authData,
    onLoginSuccess,
    getLoginState,
    logoutUser,
    createAppManifest,
    store,
  }

  if (isLoading){
    return null;
  }

  return(
    <ErrorBoundary>
    <BaseStore.Provider value={ctx}>
    <BrowserRouter>
      {
        isLoggedIn?
          <Application
            isLoggedIn={isLoggedIn}
            logout={() => logoutUser()}
          />
        :
          <Authenticator
            apiUrl={apiUrl}
            onLoginSuccess={onLoginSuccess}
          />
      }
      </BrowserRouter>
      </BaseStore.Provider>
      </ErrorBoundary>
    )
}


const Application =({ ...props })=> {
  // const apiUrl = "http://localhost/api/dashboard";

  const {token, role} = getUserData();
  const branch = JSON.parse(localStorage.getItem('shago-branch-id'));
  const place = localStorage.getItem('shago-place-id');

  // eslint-disable-next-line
  const {createAppManifest} = useContext(BaseStore);
  const [showOverlay, setOverlayState] = useState(false);
  const [alertVisibility, setAlertVisibility] = useState(false);
  const [alert, setAlert] = useState(null);

  // eslint-disable-next-line
  const [storeBranches, setStoreBranches] = useState([]);
  // eslint-disable-next-line
  const [metaUrl, setMetaUrl] = useState([]);
  const [confirmationOptions, setConfirmationOptions] = useState(null);
  const [navIsOpen, setNavState] = useState(false);
  const [navView, setNavView] = useState('overview');
  const [activeBranch, setActiveBranch] = useState(role === 'owner' || 'admin' ? null : branch);

  const app = useRef();
  const sidebarRef = useRef();
  const sidebarInnerRef = useRef();
  const router = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  /**
   * gets the default branch from local storage
   * if user has access to more than one branch, the defaultBranch
   * @returns `defaultBranch` : `String` -> The default branch as selected by the user
   */
  function getBranches(){
    axiosClient.get('/branches/')
    .then(
      res => console.log("Branches:", res.data),
      error => console.error(error)
    ).catch(err => console.log("Error getting branches", err))
  }

  function switchNavView(){
    if (navView === 'branch-view'){
      setNavView('overview')
    }else{
      setNavView('branch-view')
    }
  }

  
  function getUserData(){
    const data = JSON.parse(localStorage.getItem('shago-auth-user'));
    return(data)
  }

  const axiosClient = axios.create({
    baseURL: apiUrl,
    headers: {'Authorization': `Token ${token}`},
    params: {
      place,
    }
  })

  function AskConfirmation(options){
    if(!options) return notify('warning',"Cannot call confirmation without support params.")

    const {title, message, onApprove, onCancel} = options;
    setConfirmationOptions({ title, message, onApprove, onCancel, setOverlayState });
    setOverlayState(true);
  }

  function notify(level='info', message, timeout=3000){
    setAlertVisibility(true)
    setAlert({
      level,
      message
    })
    
    setTimeout(() =>{
      setAlert(null)
      setAlertVisibility(false)
    }, timeout)
  }

  function toggleNav(){
    if(navIsOpen){
      closeNav()
    }else{
      openNav()
    }
  }
  
  function openNav(){
		const activeNav = document.querySelector('.nav-link-wrapper.active');
    app.current.classList.replace('sidebar-closed', 'sidebar-open');
    setNavState(true);

    window.sidebarRef = sidebarInnerRef;
    window.activeNav = activeNav;
    const sidebar = sidebarRef.current;
		setTimeout(() => {
      sidebar.scrollTo({
        top: activeNav.offsetTop - 150,
        behavior: 'smooth',
      })
    }, 700)
  }

  function closeNav(){
    app.current.classList.replace('sidebar-open', 'sidebar-closed')
    setNavState(false)
  }

  function normalizeDigits(val) {
    let number = val;
    if (typeof val === Number){
      number = val.toString();
    }
    let _num = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return _num;
  }

  useEffect(() => {
    // const storeData = localStorage.getItem('shago-auth-data')
    // const { url} = createAppManifest(storeData)
    // setMetaUrl(url)
  }, [activeBranch])
  
  const context = {
    // app state
    apiUrl,
    axios: axiosClient,
    place,
    branch,
    activeBranch,
    setActiveBranch,
    navIsOpen,
    navView,
    
    // methods
    switchNavView,
    AskConfirmation,
    setConfirmationOptions,
    getUserData,
    normalizeDigits,
    getBranches,
    notify,
    redirect: (path) =>{
      router(path)
    },
    clipboardCopy: (text) => {
      navigator.clipboard.writeText(text)
      notify('info', "Copied to clipboard", 1200)
    },
  }



  return (
    <GlobalStore.Provider value={context}>
      <Helmet>
        <meta name="description" content={"Shago Meals Admin"} />
        <meta name="manifest" content={metaUrl} />
      </Helmet>
      <Box ref={app} className="App sidebar-closed">
        <Box className="page-wrapper" container wrap="nowrap">
          <Sidebar sidebarRef={sidebarRef} sidebarInnerRef={sidebarInnerRef} closeNav={closeNav} navIsOpen={navIsOpen} toggleNav={toggleNav} />

          <Box className="content">
            <Navbar toggleNav={toggleNav} />
            <div>
              <Routes>
                <Route path="/menu/add" element={<MenuAddPage />} />
                <Route path="/menu/categories" element={<CategoryManagePage />} />
                <Route path="/menu/:itemId" element={<MenuDetailPage />} /> 
                <Route path="/menu" element={<MenuListPage />} />

                <Route path="/orders/add" element={<OrderAddPage />} />
                <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                <Route path="/orders" element={<OrderListPage />} />

                <Route path="/customers/add" element={<CustomerAddPage />} />
                <Route path="/customers" element={<CustomerListPage />} />

                <Route path="/staff/add" element={<StaffAddPage />} />
                <Route path="/staff/roles" element={<StaffRolesListPage />} />
                <Route path="/staff/:staffId" element={<StaffDetailPage />} />
                <Route path="/staff" element={<StaffListPage />} />

                <Route path="/branches/add" element={<BranchAddPage />} />
                <Route path="/branches/:branchId" element={<BranchDetailPage />} />
                <Route path="/branches" element={<BranchHomePage />} />

                <Route path="/coupons/add" element={<BranchAddPage />} />
                <Route path="/coupons/:branchId" element={<BranchDetailPage />} />
                <Route path="/coupons" element={<CouponHomePage />} />

                <Route path="/qr-codes/add" element={<BranchAddPage />} />
                <Route path="/qr-codes/:branchId" element={<BranchDetailPage />} />
                <Route path="/qr-codes" element={<QRCodeHomePage />} />
                
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/account/change-password" element={<ChangePasswordPage />} />
                <Route path="/account" element={<AccountPage />} />

                <Route path="/notifications/:noticeId" element={<AccountPage />} />
                <Route path="/notifications" element={<NotificationsHomePage />} />
                {/* <Route path="/apps/:appId" element={<DashboardPage />} />
                <Route path="/apps" element={<DashboardPage />} /> */}
                
                <Route path="/dashboard" element={<DashboardPage />} />
                
                <Route path="/*" element={<RedirectElement location={'/dashboard'} />} />
              </Routes>
            </div>

            <Box sx={{p: 3, borderTop: '1px solid lavender'}}>
                <Grid container>
                  <Grid item sx={{mr: 2}}> 
                    <Typography> &copy; 2023 - All rights reserved </Typography>
                  </Grid>

                  <Grid item sx={{mr: 2}}> 
                    <Link to={'https://shagomeals.com/privacy-policy/'}> <Typography> Privacy Policy </Typography> </Link>
                  </Grid>

                  <Grid item sx={{mr: 2}}> 
                    <Link to={'https://shagomeals.com/privacy-policy'}> <Typography> Terms </Typography> </Link>
                  </Grid>

                  <Grid item sx={{mr: 2}}> 
                    <Link to={'https://shagomeals.com/privacy-policy/'}> <Typography> Support </Typography> </Link>
                  </Grid>

                </Grid>
            </Box>
          </Box>
        </Box>

        {/* Notifications bar */}
        <Snackbar
         anchorOrigin={{
          vertical: 'bottom',
          horizontal: isDesktop ? 'center': 'left'
        }}
          className='no-print'
         open={alertVisibility}
         autoHideDuration={5000}
         sx={{zIndex: '2000 !important', bottom: '50px !important', transition: 'bottom .7s'}}
         >
          {
            alert && 
            <Alert className="alert" severity={alert?.level} sx={{ bottom: '120px', width: '90vw', maxWidth: 350, opacity: 1, boxShadow: 'rgba(6, 6, 6, 0.36) 1px 1px 3px 0px !important' }}>
             <Typography component="p"> {alert?.message} </Typography>
           </Alert>
          }
        </Snackbar>

      </Box>

      {
        showOverlay && 
        <Backdrop
          sx={{transition: 'ease-in-out .3s'}}
          className="overlay"
          open={showOverlay} // show the component 
          invisibe="true" // show the backdrop i.e overlay
        >
          <AskConfirmationModal
           title={confirmationOptions?.title}
           message={confirmationOptions?.message}
           onCancel={confirmationOptions?.onCancel}
           onApprove={confirmationOptions?.onApprove}
           setOverlayState={setOverlayState}
          /> 
        </Backdrop>
      }
    </GlobalStore.Provider>
  );
}


const RedirectElement =({ location })=> {
  const redirect = useNavigate()
  useEffect(() => {
    redirect(location)
  }, [])
  return null
}


const Authenticator =({ props })=> {
  return(
    <Routes>
      <Route path='/login' element={<LoginPage props={props} />} />
      <Route path='/auth' element={<SignupPage props={props} />} />
      <Route path='/*' element={<RedirectElement location='/login' />} />
      
    </Routes>
  )
}


export default AppLoadScreen;

