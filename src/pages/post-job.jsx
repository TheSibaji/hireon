import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "", // Default value for Job Title
      description: "",
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) {
      alert("Job Created Successfully!");
      navigate("/jobs");
    }
  }, [dataCreateJob]);

  const {
    fn: fnCompanies,
    data: companies = [],
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div>
      <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-gray-500 via-gray-200 to-white font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
        {/* Job Title Field */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="Job Title" />
          )}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        {/* Job Description Field */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea {...field} placeholder="Job Description" />
          )}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        {/* Location and Company Fields */}
        <div className="flex gap-4 items-center justify-center sm:flex-row">
          {/* Location */}
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map((state) => (
                      <SelectItem key={state.name} value={state.name}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {/* Company */}
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))?.name
                      : "Company"}
                  </SelectValue>
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
            )}
          />
          {/* have to add comapy drawer */}
          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </div>
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}
        {errors.company_id && <p className="text-red-500">{errors.company_id.message}</p>}

        {/* Requirements Field */}
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value || ""} onChange={(value) => field.onChange(value || "")} />
          )}
        />
        {errors.requirements && <p className="text-red-500">{errors.requirements.message}</p>}

        {/* Form Submission and Loading State */}
        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )}
        {loadingCreateJob && <BarLoader width={"100%"} color="#36d7b7" />}

        <Button type="submit" variant="blue" size="lg" className="mt-2">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
