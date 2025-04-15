/**
 * Service to handle company logo related functionality
 */

// Map of company logos - in a real app, these would be properly imported or from a CDN
const companyLogos = {
  daraz: "/logos/daraz-logo.png",
  foodpanda: "/logos/foodpanda-logo.png",
  amazon: "/logos/amazon-logo.png",
};

// Fallback logo if company isn't found
const DEFAULT_LOGO = "/logos/default-logo.png";

/**
 * Get the logo URL for a specific company
 * @param {string} company - Company name
 * @returns {string} Logo URL
 */
export const getCompanyLogo = (company) => {
  return companyLogos[company.toLowerCase()] || DEFAULT_LOGO;
};

/**
 * Get company name from subdomain
 * @returns {string} Company name
 */
export const getCompanyFromSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  // For development environments like localhost
  if (hostname === "localhost" || hostname.includes("127.0.0.1")) {
    // Try to get company from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const companyParam = urlParams.get("company");
    if (companyParam && companyParam in companyLogos) {
      return companyParam.toLowerCase();
    }
    return "daraz"; // Default
  }

  // For production with actual subdomains
  if (parts.length > 2) {
    const subdomain = parts[0].toLowerCase();
    if (subdomain in companyLogos) {
      return subdomain;
    }
  }

  return "daraz"; // Default to daraz if no valid subdomain
};

/**
 * Check if a company is valid (exists in our data)
 * @param {string} company - Company name to check
 * @param {Object} sampleOrders - Object containing order data for companies
 * @returns {boolean} True if company exists
 */
export const isValidCompany = (company, sampleOrders) => {
  return company && sampleOrders && company in sampleOrders;
};

export default {
  getCompanyLogo,
  getCompanyFromSubdomain,
  isValidCompany,
};
