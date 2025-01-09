import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { addDays, format, isSameDay, isWithinInterval } from "date-fns";

// Event types and their corresponding colors
const eventTypes = {
  "Sitewide Markdown Sale": "#F97316",
  "Sitewide Discount Code Sale": "#8B5CF6",
  "Collection Sale": "#0EA5E9",
  "Bogo Sale": "#D946EF",
  "Free Shipping Sale": "#33C3F0",
  "Shipping Update": "#8E9196",
  "Influencer": "#9b87f5",
  "Event": "#6E59A5",
  "Loyalty Bonus": "#F2FCE2"
} as const;

type EventType = keyof typeof eventTypes;

interface MarketingEvent {
  id: number;
  name: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
}

// Mock events data
const marketingEvents: MarketingEvent[] = [
  {
    id: 1,
    name: "Summer dresses sale",
    type: "Sitewide Markdown Sale",
    startDate: new Date(2024, 5, 1),
    endDate: new Date(2024, 5, 14)
  },
  {
    id: 2,
    name: "Spring collection launch",
    type: "Collection Sale",
    startDate: new Date(2024, 4, 15),
    endDate: new Date(2024, 4, 30)
  },
  {
    id: 3,
    name: "Memorial Day special",
    type: "Bogo Sale",
    startDate: new Date(2024, 4, 27),
    endDate: new Date(2024, 5, 1)
  },
  {
    id: 4,
    name: "Free shipping week",
    type: "Free Shipping Sale",
    startDate: new Date(2024, 5, 10),
    endDate: new Date(2024, 5, 17)
  },
  {
    id: 5,
    name: "International shipping update",
    type: "Shipping Update",
    startDate: new Date(2024, 5, 20),
    endDate: new Date(2024, 5, 20)
  },
  {
    id: 6,
    name: "Summer influencer campaign",
    type: "Influencer",
    startDate: new Date(2024, 6, 1),
    endDate: new Date(2024, 6, 14)
  },
  {
    id: 7,
    name: "Summer fashion show",
    type: "Event",
    startDate: new Date(2024, 6, 15),
    endDate: new Date(2024, 6, 15)
  },
  {
    id: 8,
    name: "VIP customer bonus",
    type: "Loyalty Bonus",
    startDate: new Date(2024, 6, 20),
    endDate: new Date(2024, 6, 27)
  },
  {
    id: 9,
    name: "Flash sale",
    type: "Sitewide Discount Code Sale",
    startDate: new Date(2024, 7, 1),
    endDate: new Date(2024, 7, 3)
  }
];

export default function Marketing() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvents, setSelectedEvents] = useState<MarketingEvent[]>([]);

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return marketingEvents.filter(event =>
      isWithinInterval(date, { start: event.startDate, end: event.endDate })
    );
  };

  // Custom day render function
  const renderDay = (day: Date) => {
    const dayEvents = getEventsForDate(day);
    const hasEvents = dayEvents.length > 0;

    return (
      <div className="relative w-full h-full">
        <div className={`text-center ${hasEvents ? 'font-bold' : ''}`}>
          {format(day, 'd')}
        </div>
        {hasEvents && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: eventTypes[event.type] }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background p-8">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Marketing Calendar</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Event Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      if (newDate) {
                        setSelectedEvents(getEventsForDate(newDate));
                      }
                    }}
                    components={{
                      Day: ({ day }) => renderDay(day)
                    }}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Events for {date ? format(date, 'MMM d, yyyy') : 'Selected Date'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedEvents.length > 0 ? (
                      selectedEvents.map(event => (
                        <div key={event.id} className="space-y-2">
                          <h3 className="font-medium">{event.name}</h3>
                          <Badge style={{ backgroundColor: eventTypes[event.type] }}>
                            {event.type}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {format(event.startDate, 'MMM d')} - {format(event.endDate, 'MMM d, yyyy')}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No events for this date</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}