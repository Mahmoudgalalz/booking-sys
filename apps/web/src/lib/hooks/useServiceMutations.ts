import { useMutation, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '../api/services-api';
import type { ServiceCreateData } from '../api/services-api';

export const useServiceMutations = () => {
  const queryClient = useQueryClient();

  const createService = useMutation({
    mutationFn: (data: ServiceCreateData) => servicesApi.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const updateService = useMutation({
    mutationFn: ({ serviceId, data }: { serviceId: number; data: Partial<ServiceCreateData> }) => 
      servicesApi.updateService(serviceId, data),
    onSuccess: (updatedService) => {
      queryClient.setQueryData(['services', updatedService.id], updatedService);
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  const deleteService = useMutation({
    mutationFn: (serviceId: number) => servicesApi.deleteService(serviceId),
    onSuccess: (_, serviceId) => {
      queryClient.removeQueries({ queryKey: ['services', serviceId] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  return {
    createService,
    updateService,
    deleteService,
  };
};
