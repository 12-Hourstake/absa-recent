import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const AvailabilityCalendar = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Availability Calendar</h1>
          <p className="text-muted-foreground">All times are in GMT</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90"><Plus className="h-4 w-4 mr-2" />Set Availability</Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
              </div>
              <h3 className="text-lg font-bold">August 2024</h3>
            </div>
            <div className="flex h-10 items-center rounded-lg bg-muted p-1">
              <Button variant="ghost" size="sm" className="bg-background shadow-sm">Month</Button>
              <Button variant="ghost" size="sm">Week</Button>
              <Button variant="ghost" size="sm">Day</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div key={day} className="text-center py-4 text-sm font-bold text-muted-foreground border-b">{day}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 3;
              const isCurrentMonth = day >= 1 && day <= 31;
              return (
                <div key={i} className={`border-r border-b p-2 h-32 ${!isCurrentMonth ? "text-muted-foreground" : ""}`}>
                  <span className="font-medium">{isCurrentMonth ? day : day < 1 ? 28 + day : day - 31}</span>
                  {day === 5 && <div className="mt-1 bg-primary/20 text-primary p-1 rounded text-xs">Available</div>}
                  {day === 11 && <div className="mt-1 bg-red-900 text-white p-1 rounded text-xs truncate">AC Fix at Labadi</div>}
                  {day === 12 && <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center font-bold">{day}</div>}
                  {day === 20 && <div className="mt-1 bg-muted text-muted-foreground p-1 rounded text-xs">Unavailable</div>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityCalendar;
