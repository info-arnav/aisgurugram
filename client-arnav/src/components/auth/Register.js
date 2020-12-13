import React, { Component } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Recaptcha from "react-grecaptcha";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { Offline, Online } from "react-detect-offline";
import { Toast } from "react-bootstrap";
import classnames from "classnames";
import Navigation from "../../elements/Navigation";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      recapcha: false,
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  verifyCallback = (response) => {
    this.setState({ recapcha: true });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors, recapcha } = this.state;

    return (
      <div>
        <div>
          <Helmet>
            <link
              rel="manifest"
              href={`${process.env.PUBLIC_URL}/manifest.json`}
            />
            <link
              rel="apple-touch-icon"
              href={`${process.env.PUBLIC_URL}/logo.png`}
            />
            <header>
              <link
                rel="apple-touch-icon"
                href={`${process.env.PUBLIC_URL}/logo.png`}
              />
              <link
                rel="manifest"
                href={`${process.env.PUBLIC_URL}/manifest.json`}
              />
            </header>{" "}
            <meta charset="utf-8" />
            <meta name="copyright" content="Infinity" />
            <div hidden>71441</div>
            <meta name="author" content="Arnav Gupta" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <meta name="theme-color" content="#000000" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@InfinityByArnav" />
            <meta name="twitter:creator" content="@arnav95600" />
            <meta property="og:site_name" content="Infinity" />
            <meta property="fb:app_id" content="807904256677081" />
            <title>{`Infinity - Registeration page`}</title>
            <meta
              name="twitter:title"
              content={`Infinity - Registeration page`}
            />
            <meta
              name="description"
              content="Infinity - Register here now for additional features"
            />
            <meta
              property="og:description"
              content="Infinity - Register here now for additional features"
            />
            <meta
              name="twitter:description"
              content={`Infinity - Register here now for additional features`}
            />
            <meta
              property="og:url"
              content={`https://www.arnavgupta.net/Registeration`}
            />
            <meta
              name="twitter:image"
              content="https://www.arnavgupta.net/logo.png"
            />
            <meta property="og:title" content={`Infinity - Registeration`} />
            <meta property="og:type" content={`website`} />
            <meta
              property="og:image"
              content="https://www.arnavgupta.net/logo.png"
            />
          </Helmet>
          <link
            rel="apple-touch-icon"
            href={`${process.env.PUBLIC_URL}/logo.png`}
          />
          <link
            rel="apple-touch-icon"
            href={`${process.env.PUBLIC_URL}/logo.png`}
          />
          <header>
            <link
              rel="apple-touch-icon"
              href={`${process.env.PUBLIC_URL}/logo.png`}
            />
            <link
              rel="manifest"
              href={`${process.env.PUBLIC_URL}/manifest.json`}
            />
          </header>
          <link
            rel="manifest"
            href={`${process.env.PUBLIC_URL}/manifest.json`}
          />
        </div>
        <Navigation />

        <main className="page registration-page">
          <section className="clean-block clean-form dark">
            <div className="container">
              <div className="block-heading">
                <h2 className="text-info">Registration</h2>
              </div>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label for="name">Username</label>
                  <input
                    onKeyDown={this.handleKeyDown}
                    onChange={this.onChange}
                    value={this.state.name}
                    error={errors.name}
                    className="form-control item"
                    type="text"
                    required
                    id="name"
                  />

                  <span className="red-text">{errors.name}</span>
                </div>
                <div className="form-group">
                  <label for="email">Email</label>
                  <input
                    className="form-control item"
                    onChange={this.onChange}
                    value={this.state.email}
                    required
                    error={errors.email}
                    type="email"
                    id="email"
                  />

                  <span className="red-text">{errors.email}</span>
                </div>
                <div className="form-group">
                  <label for="password">Password</label>
                  <input
                    onKeyDown={this.handleKeyDown}
                    className="form-control item"
                    type="password"
                    id="password"
                    onChange={this.onChange}
                    value={this.state.password}
                    required
                    error={errors.password}
                  />

                  <span className="red-text">{errors.password}</span>
                </div>

                <div className="form-group">
                  <label for="password2">Confirm Password</label>
                  <input
                    className="form-control item"
                    onChange={this.onChange}
                    value={this.state.password2}
                    error={errors.password2}
                    type="password"
                    id="password2"
                    required
                  />

                  <span className="red-text">{errors.password2}</span>
                </div>

                <Recaptcha
                  sitekey="6LdwXMQZAAAAAK_UK_Brkw_u_bsmL0hHsDLFpTUy"
                  callback={this.verifyCallback}
                  locale="zh-TW"
                  className="customClassName"
                />

                {recapcha ? (
                  <button className="btn btn-primary btn-block" type="submit">
                    Sign Up
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-block"
                    type="submit"
                    disabled
                  >
                    Sign Up
                  </button>
                )}
              </form>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
