import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const calculateAge = (dob) => {

    if (!dob) return null;

    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return null; // invalid date

    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    // if birthday not yet reached this year → subtract 1
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    // prevent negative age (future DOB)
    if (age < 0) return null;

    return age;
  };

 const currency='$';
  const value = {
    calculateAge,currency
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
