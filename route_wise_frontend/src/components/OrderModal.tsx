import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createOrder, updateOrder } from '../api/order';
import { getAllClients } from '../api/client';
import { getAllVehicles } from '../api/vehicle';
import { getAllEmployees } from '../api/employee';
import { getAllStatuses } from '../api/status';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface Order {
  orderId?: number;
  clientId: number;
  orderDate: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupDate: string;
  deliveryDate: string;
  statusId: number;
  assignedVehicleId?: number;
  assignedDriverId?: number;
  companyId: number;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  onSuccess: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, order, onSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [pickupCalendarOpen, setPickupCalendarOpen] = useState(false);
  const [deliveryCalendarOpen, setDeliveryCalendarOpen] = useState(false);
  
  const [formData, setFormData] = useState<Order>({
    clientId: 0,
    orderDate: new Date().toISOString().split('T')[0],
    pickupAddress: '',
    destinationAddress: '',
    pickupDate: '',
    deliveryDate: '',
    statusId: 1, // Default to first status
    assignedVehicleId: undefined,
    assignedDriverId: undefined,
    companyId: user?.companyId || 1
  });

  // Load dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [clientsData, vehiclesData, employeesData, statusesData] = await Promise.all([
          getAllClients(),
          getAllVehicles(),
          getAllEmployees(),
          getAllStatuses()
        ]);
        setClients(clientsData);
        setVehicles(vehiclesData);
        setEmployees(employeesData);
        setStatuses(statusesData);
      } catch (error) {
        console.error('Error loading dropdown data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data",
          variant: "destructive",
        });
      }
    };

    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen, toast]);

  // Initialize form data when order prop changes
  useEffect(() => {
    if (order) {
      setFormData({
        ...order,
        assignedVehicleId: order.assignedVehicleId || undefined,
        assignedDriverId: order.assignedDriverId || undefined
      });
    } else {
      setFormData({
        clientId: 0,
        orderDate: new Date().toISOString().split('T')[0],
        pickupAddress: '',
        destinationAddress: '',
        pickupDate: '',
        deliveryDate: '',
        statusId: statuses.length > 0 ? statuses[0].statusId : 1,
        assignedVehicleId: undefined,
        assignedDriverId: undefined,
        companyId: user?.companyId || 1
      });
    }
  }, [order, isOpen, user, statuses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.clientId || formData.clientId === 0) {
        throw new Error("Please select a client");
      }
      if (!formData.pickupAddress.trim()) {
        throw new Error("Pickup address is required");
      }
      if (!formData.destinationAddress.trim()) {
        throw new Error("Destination address is required");
      }
      if (!formData.pickupDate) {
        throw new Error("Pickup date is required");
      }
      if (!formData.deliveryDate) {
        throw new Error("Delivery date is required");
      }

      // Create order payload
      const orderData = {
        ...formData,
        assignedVehicleId: formData.assignedVehicleId || null,
        assignedDriverId: formData.assignedDriverId || null,
      };

      if (order?.orderId) {
        await updateOrder(order.orderId, orderData);
        toast({
          title: "Success",
          description: "Order updated successfully",
        });
      } else {
        await createOrder(orderData);
        toast({
          title: "Success",
          description: "Order created successfully",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Order, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateSelect = (date: Date | undefined, field: 'pickupDate' | 'deliveryDate') => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      handleInputChange(field, formattedDate);
      if (field === 'pickupDate') {
        setPickupCalendarOpen(false);
      } else {
        setDeliveryCalendarOpen(false);
      }
    }
  };

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.clientId === clientId);
    return client ? client.companyName : 'Select Client';
  };

  const getVehicleName = (vehicleId: number) => {
    const vehicle = vehicles.find(v => v.vehicleId === vehicleId);
    return vehicle ? vehicle.licensePlate : 'No Vehicle';
  };

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(e => e.employeeId === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'No Driver';
  };

  const getStatusName = (statusId: number) => {
    const status = statuses.find(s => s.statusId === statusId);
    return status ? status.statusName : 'Select Status';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto" aria-describedby="order-dialog-description">
        <DialogHeader>
          <DialogTitle>{order ? 'Edit Order' : 'Create New Order'}</DialogTitle>
          <DialogDescription id="order-dialog-description">
            {order ? 'Update order information' : 'Fill in the details to create a new order'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Selection */}
          <div>
            <Label htmlFor="clientId">Client *</Label>
            <Select
              value={formData.clientId > 0 ? formData.clientId.toString() : ""}
              onValueChange={(value) => handleInputChange('clientId', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.clientId} value={client.clientId.toString()}>
                    {client.companyName} - {client.contactName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order Date */}
          <div>
            <Label htmlFor="orderDate">Order Date</Label>
            <Input
              id="orderDate"
              type="date"
              value={formData.orderDate}
              onChange={(e) => handleInputChange('orderDate', e.target.value)}
              required
            />
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickupAddress">Pickup Address *</Label>
              <Textarea
                id="pickupAddress"
                value={formData.pickupAddress}
                onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                placeholder="Enter pickup address"
                required
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="destinationAddress">Destination Address *</Label>
              <Textarea
                id="destinationAddress"
                value={formData.destinationAddress}
                onChange={(e) => handleInputChange('destinationAddress', e.target.value)}
                placeholder="Enter destination address"
                required
                rows={3}
              />
            </div>
          </div>

          {/* Pickup and Delivery Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Pickup Date *</Label>
              <Popover open={pickupCalendarOpen} onOpenChange={setPickupCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.pickupDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.pickupDate ? format(new Date(formData.pickupDate), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.pickupDate ? new Date(formData.pickupDate) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'pickupDate')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Delivery Date *</Label>
              <Popover open={deliveryCalendarOpen} onOpenChange={setDeliveryCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deliveryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deliveryDate ? format(new Date(formData.deliveryDate), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.deliveryDate ? new Date(formData.deliveryDate) : undefined}
                    onSelect={(date) => handleDateSelect(date, 'deliveryDate')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="statusId">Status</Label>
            <Select
              value={formData.statusId > 0 ? formData.statusId.toString() : ""}
              onValueChange={(value) => handleInputChange('statusId', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.statusId} value={status.statusId.toString()}>
                    {status.statusName} {status.description && `- ${status.description}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional Assignments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignedVehicleId">Assigned Vehicle (Optional)</Label>
              <Select
                value={formData.assignedVehicleId?.toString() || "none"}
                onValueChange={(value) => handleInputChange('assignedVehicleId', value === "none" ? undefined : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No vehicle assigned</SelectItem>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.vehicleId} value={vehicle.vehicleId.toString()}>
                      {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignedDriverId">Assigned Driver (Optional)</Label>
              <Select
                value={formData.assignedDriverId?.toString() || "none"}
                onValueChange={(value) => handleInputChange('assignedDriverId', value === "none" ? undefined : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No driver assigned</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.employeeId} value={employee.employeeId.toString()}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {loading ? 'Saving...' : (order ? 'Update Order' : 'Create Order')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal; 