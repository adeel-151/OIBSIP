import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
  const defaultTitle = "Pizzaro - Crafted Your Way | Premium Pizza Delivery";
  const defaultDescription = "Order premium, customizable pizzas online with Pizzaro. Build your own pizza or choose from our featured menu.";
  const defaultKeywords = "pizza, online pizza delivery, custom pizza, food delivery, premium pizza";

  return (
    <Helmet>
      <title>{title ? `${title} | Pizzaro` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      {/* Open Graph / Social Media Meta Tags */}
      <meta property="og:title" content={title ? `${title} | Pizzaro` : defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEO;
