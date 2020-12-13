import React from "react";
import { Helmet } from "react-helmet";
import Footer from "../elements/Footer";
import { Offline, Online } from "react-detect-offline";
import { Toast } from "react-bootstrap";
import Navigation from "../elements/Navigation";

const About = () => {
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
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@InfinityByArnav" />
          <meta name="twitter:creator" content="@arnav95600" />
          <meta property="og:site_name" content="Infinity" />
          <meta property="fb:app_id" content="807904256677081" />
          <title>{`Infinity - About`}</title>
          <meta name="twitter:title" content={`Infinity - About`} />
          <meta
            name="description"
            content="Infinity here is a platform for various people to discuss about their social problems and henceforth come towards a rational solution"
          />
          <meta
            property="og:description"
            content="Infinity here is a platform for various people to discuss about their social problems and henceforth come towards a rational solution"
          />
          <meta
            name="twitter:description"
            content={`Infinity here is a platform for various people to discuss about their social problems and henceforth come towards a rational solution`}
          />
          <meta property="og:url" content={`https://www.futureal.ml/about`} />
          <meta
            name="twitter:image"
            content="https://www.futureal.ml/logo.png"
          />
          <meta property="og:title" content={`Infinity - About`} />
          <meta property="og:type" content={`website`} />
          <meta
            property="og:image"
            content="https://www.futureal.ml/logo.png"
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
        <link rel="manifest" href={`${process.env.PUBLIC_URL}/manifest.json`} />
      </div>
      <Navigation />

      <main className="page landing-page">
        <section className="clean-block clean-hero" id="homeImage">
          <div className="text">
            <h2>Sicual help groups </h2>
            <p>Discuss your problems with the world</p>
            <a
              href="/register"
              className="btn btn-outline-light btn-lg"
              type="button"
            >
              Callaborate
            </a>
          </div>
        </section>
        <section className="clean-block about-us">
          <div className="container">
            <div className="block-heading">
              <h2 className="text-info">About</h2>
              <p>
                Infinity here is a platform for various people to discuss about
                their social problems and henceforth come towards a rational
                solution
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
