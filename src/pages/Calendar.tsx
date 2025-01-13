import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface Event {
  id: number;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
}

const getEventColor = (type: string) => {
  // High contrast colors for different event types
  switch (type) {
    case "Sitewide Markdown Sale":
      return "bg-[#9b87f5]";
    case "Sitewide Discount Code Sale":
      return "bg-[#F97316]";
    case "Collection Sale":
      return "bg-[#0EA5E9]";
    case "Bogo Sale":
      return "bg-[#D946EF]";
    case "Free Shipping Sale":
      return "bg-[#10B981]";
    case "Shipping Update":
      return "bg-[#6366F1]";
    case "Influencer":
      return "bg-[#EC4899]";
    case "Event":
      return "bg-[#8B5CF6]";
    case "Loyalty Bonus":
      return "bg-[#F59E0B]";
    case "A/B Test":
      return "bg-[#EF4444]";
    default:
      return "bg-gray-500";
  }
};

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const { data: promotions } = useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      // This would be replaced with actual API call
      const response = await fetch("/api/promotions");
      return response.json();
    },
    enabled: false, // Disable actual API call for now
  });

  const { data: experiments } = useQuery({
    queryKey: ["experiments"],
    queryFn: async () => {
      // This would be replaced with actual API call
      const response = await fetch("/api/experiments");
      return response.json();
    },
    enabled: false, // Disable actual API call for now
  });

  // Mock data for demonstration
  const mockEvents: Event[] = [
    {
      id: 1,
      name: "Summer Sale",
      type: "Sitewide Markdown Sale",
      startDate: "2024-03-15",
      endDate: "2024-03-20",
      status: "Scheduled",
    },
    {
      id: 2,
      name: "Price Testing",
      type: "A/B Test",
      startDate: "2024-03-18",
      endDate: "2024-03-25",
      status: "Scheduled",
    },
    // Add more mock events as needed
  ];

  const events = [...(promotions || []), ...(experiments || []), ...mockEvents];

  const handleDayClick = (day: Date | undefined) => {
    if (!day) return;

    const clickedDate = format(day, "yyyy-MM-dd");
    const dayEvents = events.filter(
      (event) =>
        new Date(event.startDate) <= new Date(clickedDate) &&
        new Date(event.endDate) >= new Date(clickedDate)
    );

    if (dayEvents.length > 0) {
      // Navigate to the first event's details page
      const event = dayEvents[0];
      if (event.type === "A/B Test") {
        navigate(`/experiments/${event.id}`);
      } else {
        navigate(`/promotions/${event.id}`);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      <div className="flex flex-col gap-8">
        <Card className="w-full">
          <CardContent className="p-4">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full"
              modifiers={{
                booked: (date) => {
                  const dateStr = format(date, "yyyy-MM-dd");
                  return events.some(
                    (event) =>
                      new Date(event.startDate) <= new Date(dateStr) &&
                      new Date(event.endDate) >= new Date(dateStr)
                  );
                },
              }}
              modifiersStyles={{
                booked: {
                  border: "2px solid #e5e7eb",
                  backgroundColor: "#f3f4f6",
                },
              }}
              components={{
                DayContent: ({ date }) => {
                  const dateStr = format(date, "yyyy-MM-dd");
                  const dayEvents = events.filter(
                    (event) =>
                      new Date(event.startDate) <= new Date(dateStr) &&
                      new Date(event.endDate) >= new Date(dateStr)
                  );

                  return (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                      onClick={() => handleDayClick(date)}
                    >
                      <span className="mb-1">{format(date, "d")}</span>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {dayEvents.map((event) => (
                          <Badge
                            key={event.id}
                            className={`${getEventColor(
                              event.type
                            )} text-white text-xs px-1 py-0`}
                            variant="outline"
                          >
                            •
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                "Sitewide Markdown Sale",
                "Sitewide Discount Code Sale",
                "Collection Sale",
                "Bogo Sale",
                "Free Shipping Sale",
                "Shipping Update",
                "Influencer",
                "Event",
                "Loyalty Bonus",
                "A/B Test",
              ].map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${getEventColor(type)}`} />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
