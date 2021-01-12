import React, { Component } from "react";

import Cookies from "js-cookie";
import axios from "axios";

import store from "../store";

const configureAxiosHeader = () => {
    axios.defaults.baseURL = process.env.REACT_APP_API
  const token = Cookies.get("fb_admin_token");
  axios.defaults.headers.common = {
    Authorization: token,
  };
};

const withAuth = (AuthComponent) => {
  return class Authenticated extends Component {
    static async getInitialProps(ctx) {
      // Ensures material-ui renders the correct css prefixes server-side
      let userAgent;
      // eslint-disable-next-line no-undef
      if (process.browser) {
        // eslint-disable-next-line prefer-destructuring
        userAgent = navigator.userAgent;
      } else {
        userAgent = ctx.req.headers["user-agent"];
      }

      // Check if Page has a `getInitialProps`; if so, call it.
      const pageProps =
        AuthComponent.getInitialProps &&
        (await AuthComponent.getInitialProps(ctx));
      // Return props.
      return { ...pageProps, userAgent };
    }

    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        userData: [],
      };
    }

    componentDidMount() {
      this.setState({ isLoading: true });
      configureAxiosHeader();
      axios
        // eslint-disable-next-line no-undef
        .post(`${process.env.REACT_APP_API}/user/verify`, {})
        .then((res) => {
          if (res.status === 200 && res.data.success) {
            //do some change state
            console.log(res.data.user);
            this.setState({ userData: res.data.user });
            this.setState({ isLoading: false });
            store.dispatch({
                type:"SET_USER",
                payload:res.data.user
            })
          }
        })
        .catch((err) => {
            this.setState({ isLoading: false });
          Cookies.remove("fb_admin_token");
          console.log(err.message);
          store.dispatch({
              type:"LOGOUT"
          })
          //console.log(window.location.pathname)
          if(window.location.pathname !== '/login'){
            window.location.pathname='/login'
          }
           //window.location.pathname='/login'
        });
    }

    render() {
      return (
        <div>
          {this.state.isLoading ? (
            <div>LOADING....</div>
          ) : (
            <AuthComponent {...this.props} userData={this.state.userData} />
          )}
        </div>
      );
    }
  };
};
export default withAuth;
