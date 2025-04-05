import { getApplications } from "@/api/apiApplications";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./application-card";
import { useUser } from "@clerk/clerk-react";

const CreatedApplications = () => {
  const { user, isLoaded } = useUser(); // isLoaded tells if user is ready

  const {
    loading: loadingApplications,
    data: applications,
    fn: fetchApplications,
  } = useFetch(getApplications, {
    user_id: user?.id, // safe access
  });

  useEffect(() => {
    if (user?.id) {
      fetchApplications();
    }
  }, [user?.id]); // call only when user.id is available

  // Show loader while user is loading
  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  // Show loader while fetching applications
  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {applications?.length > 0 ? (
        applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        ))
      ) : (
        <p className="text-muted-foreground">No applications found.</p>
      )}
    </div>
  );
};

export default CreatedApplications;
