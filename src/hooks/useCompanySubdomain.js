import { useState, useEffect } from "react";
import {
  getCompanyFromSubdomain,
  isValidCompany,
} from "../services/logoService";

/**
 * Custom hook to handle company detection from subdomain
 * @param {Object} sampleOrders - Order data for different companies
 * @returns {Object} Company info and methods
 */

const useCompanySubdomain = (sampleOrders) => {
  const [company, setCompany] = useState("daraz"); // Default company
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get company name from subdomain or URL params
    const detectedCompany = getCompanyFromSubdomain();

    if (isValidCompany(detectedCompany, sampleOrders)) {
      setCompany(detectedCompany);
    } else {
      // If not valid, use first available company
      const firstCompany = Object.keys(sampleOrders)[0];
      setCompany(firstCompany);
    }

    setIsLoading(false);
  }, [sampleOrders]);

  // For development and testing - allow manual company switching
  const switchCompany = (newCompany) => {
    if (isValidCompany(newCompany, sampleOrders)) {
      setCompany(newCompany);

      // Update URL param for development
      const params = new URLSearchParams(window.location.search);
      params.set("company", newCompany);
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`
      );

      return true;
    }
    return false;
  };

  return {
    company,
    switchCompany,
    isLoading,
  };
};

export default useCompanySubdomain;
