import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const {isSignedIn, user, isLoaded} = useUser();
    const {pathname} = useLocation();

    //checking the  login status
    if(isLoaded && !isSignedIn && isSignedIn!==undefined){
        return <Navigate to="/?sign-in=true" />
    }

    //onboarding status check
    if(
      user !== undefined && 
      !user?.unsafeMetadata?.role &&
      pathname !== "/onboarding"
    ){
      return <Navigate to="/onboarding" />;
    }
    
  return children;
}

export default ProtectedRoute