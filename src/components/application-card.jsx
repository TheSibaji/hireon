import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import useFetch from "@/hooks/use-fetch";
import { updateApplications } from "@/api/apiApplications";
import { BarLoader } from "react-spinners";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const ApplicationCard = ({application, isCandidate=false}) => {
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = application?.resume;
        link.target = "_blank";
        link.click();
    };
    
    const {
        loading: loadingHiringStatus,
        fn: fnHiringStatus
    } = useFetch(
        updateApplications,
        {
            job_id: application?.job_id,
        }
    );

    const handleStatusChange = (status)=>{
        fnHiringStatus(status);
    }

  return (

    <Card className="">
        {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
        <CardHeader>
            <CardTitle className="flex justify-between font-bold">
                {isCandidate
                    ? `${application?.job?.title} at ${application?.job?.company?.name}`
                    : application.name
                }
                <Download
                    size={18} 
                    className="bg-white text-black rounded-full w-25 h-6 cursor-pointer"
                    onClick={handleDownload}    
                />
            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col md:flex-row justify-between">
                <div className="flex gap-2 items-center font-extralight">
                    <BriefcaseBusiness size={15} />
                    {application?.experience} years of experience
                </div>
                <div className="flex gap-2 items-center font-extralight">
                    <School size={15} />
                    {application?.education} years of experience
                </div>
                <div className="flex gap-2 items-center font-extralight">
                    <Boxes size={15} />
                    Skills: {application?.skills}
                </div>
            </div>
            <hr />
        </CardContent>
        <CardFooter className="flex justify-between">
            <span className="font-extralight" >{new Date(application?.created_at).toLocaleString()}</span>
            {isCandidate? (
                <span className="capitalize font-bold">
                    Status: {application?.status}
                </span>
            ) : (
                <Select 
                    onValueChange={handleStatusChange} 
                    defaultValue={application?.status} 
                >
                    <SelectTrigger className="w-52">
                    <SelectValue 
                        placeholder="Application Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="interviewing">Interviewing</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
              </Select>
            )}
        </CardFooter>
    </Card>
    
  );
};

export default ApplicationCard;