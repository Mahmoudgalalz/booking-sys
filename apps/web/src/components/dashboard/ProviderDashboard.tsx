import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ServicesTab } from '../../components/provider/ServicesTab';
import { BookingsTab } from '../../components/provider/BookingsTab';
import { DashboardHeader } from '../../components/provider/DashboardHeader';
import { useUserStore } from '../../store/userStore';
import { ProviderProvider } from '../../contexts/ProviderContext';
import { ProviderInfoModal } from '../provider/ProviderInfoModal';

type Tab = 'services' | 'bookings';

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('services');
  
  // Get current user from localStorage
  const {user} = useUserStore();
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Provider';

  return (
    <ProviderProvider>

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
        </TabsList>
        
        <TabsContent value="services">
          <ServicesTab onEditService={() => {}} />
        </TabsContent>
        
        <TabsContent value="bookings">
          <BookingsTab />
        </TabsContent>
      </Tabs>
    </div>
    <ProviderInfoModal />
    </ProviderProvider>
  );
}