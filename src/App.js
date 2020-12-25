import 'react-perfect-scrollbar/dist/css/styles.css';
import React,{useEffect} from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';
import Cookies from 'js-cookie'
import axios from 'axios'
import store from './store'
import withAuth from './components/withAuth'




const App = () => {
  const routing = useRoutes(routes);


  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

export default withAuth(App);
