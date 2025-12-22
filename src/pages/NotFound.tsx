import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 items-center justify-center py-5 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <SearchX className="h-12 w-12" />
        </div>
        <div className="mb-8">
          <div className="flex flex-col gap-2 p-4">
            <p className="text-teal-500 text-8xl font-black leading-tight tracking-[-0.033em]">404</p>
            <p className="text-teal-900 text-2xl font-bold leading-normal">Page Not Found</p>
          </div>
          <p className="text-red-800 text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
            Oops! The page you are looking for doesn't exist. It might have been moved, deleted, or you may have mistyped the address. Let's get you back on track.
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex w-full max-w-xs px-4 py-3 justify-center">
            <Button 
              onClick={() => navigate("/")}
              className="w-full h-12 bg-red-800 hover:bg-red-900 text-white font-bold shadow-sm"
            >
              Go to Homepage
            </Button>
          </div>
          <div className="flex justify-center w-full">
            <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-xs justify-center">
              <Button 
                variant="ghost"
                onClick={() => navigate("/admin/properties")}
                className="text-teal-500 hover:text-red-800 font-bold grow"
              >
                View Properties
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate("/admin/support")}
                className="text-teal-500 hover:text-red-800 font-bold grow"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;