import { getCompanies } from '@/api/apiCompanies'
import { getJobs } from '@/api/apiJobs'
import JobCard from '@/components/job-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useFetch from '@/hooks/use-fetch'
import { useUser } from '@clerk/clerk-react'
import { State } from 'country-state-city'
import { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination'

const JOBS_PER_PAGE = 9;

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoaded } = useUser();

  const {
    fn: fnJobs, 
    data: jobs = [], 
    loading: loadingJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  const {
    fn: fnCompanies, 
    data: companies = [],
  } = useFetch(getCompanies);

  useEffect(()=> {
    if(isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(()=> {
    if(isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("search-query");
    if(query) setSearchQuery(query);
  }

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
    setCurrentPage(1);
  }

  if(!isLoaded){
    return <BarLoader className='mb-4' width={'100%'} color='#36d7b7' />
  }

  // Pagination Logic
  const indexOfLastJob = currentPage * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);

  return (
    <div>
      <h1 className='text-transparent bg-clip-text bg-gradient-to-b from-gray-500 via-gray-200 to-white font-extrabold text-6xl sm:text-7xl text-center pb-8'>
        Latest Jobs
      </h1>
    
      <div className="flex items-center justify-center">
        <form onSubmit={handleSearch} className='h-14 flex w-2xl gap-2 items-center mb-3'>
          <Input 
            type="text" 
            placeholder="Search Jobs by Title.." 
            name="search-query"
            className="h-full flex-1 px-4 text-md"
            />
            <Button type="submit" className="h-full sm:w-28 text-lg" variant="blue">
              Search
            </Button>
        </form>
      </div>
             
      <div className="flex flex-col items-center justify-center sm:flex-row gap-2">
          <Select value={location} onValueChange={(value)=>setLocation(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {State.getStatesOfCountry("IN").map((state)=> (
                  <SelectItem key={state.name} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={company_id} onValueChange={(value)=>setCompany_id(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
              {companies?.length > 0 ? (
                companies.map(({ name, id }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>No Companies Available</SelectItem>
              )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={clearFilters} variant="destructive" className="h-full w-auto px-4">Clear Filters</Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4" width={'100%'} color="#36d7d7" />
      )}

      {!loadingJobs && (
        <>
          <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <JobCard key={job.id} job={job} savedInit={job?.saved?.length>0} />
              ))
            ) : (
              <div>No Jobs Found 🙂‍↕</div>
            )}
          </div>
          {totalPages > 1 && (
            <Pagination className='mt-8 flex justify-center'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default JobListing;
