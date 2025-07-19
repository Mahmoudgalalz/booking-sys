import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ServicesTab } from '../../components/provider/ServicesTab';
import { BookingsTab } from '../../components/provider/BookingsTab';
import { TimeSlotsTab } from '../../components/provider/TimeSlotsTab';
import { DashboardHeader } from '../../components/provider/DashboardHeader';
import { authApi } from '../../lib/api/auth-api';

type Tab = 'services' | 'bookings' | 'timeslots';

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('services');
  
  // Get current user from localStorage
  const user = authApi.getCurrentUser();
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Provider';

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader userName={userName} />
      
      <Tabs 
        defaultValue="services" 
        value={activeTab} 
        onValueChange={(value: string) => setActiveTab(value as Tab)}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="timeslots">Time Slots</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services">
          <ServicesTab onEditService={() => {}} />
        </TabsContent>
        
        <TabsContent value="bookings">
          <BookingsTab />
        </TabsContent>
        
        <TabsContent value="timeslots">
          <TimeSlotsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}