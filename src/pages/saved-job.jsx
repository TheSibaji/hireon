import { getSavedJobs } from "@/api/apiJobs"
import JobCard from "@/components/job-card";
import useFetch from "@/hooks/use-fetch"
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const {isLoaded} = useUser();
  
  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded){
      fnSavedJobs();
    }
  }, [isLoaded]);

  if(!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-gray-500 via-gray-200 to-white font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {!loadingSavedJobs && (
          <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {savedJobs?.length > 0 ? (
              savedJobs.map((saved) => (
                <JobCard 
                  key={saved.id} 
                  job={saved?.job} 
                  savedInit={true} 
                  onJobSaved={fnSavedJobs}
                />
              ))
            ) : (
              <div>No Saved Jobs Found 👀</div>
            )}
          </div>
        )}
    </div>
  )
}

export default SavedJobs
