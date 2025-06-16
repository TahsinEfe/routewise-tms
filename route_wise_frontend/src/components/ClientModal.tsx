import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createClient, updateClient } from '../api/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

interface Client {
  clientId?: number;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  billingAddress: string;
  shippingAddress: string;
  accountManagerId?: number;
  userId?: number;
  companyId?: number;
}

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSuccess: () => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, client, onSuccess }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Client>({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    billingAddress: '',
    shippingAddress: '',
    companyId: user?.companyId || 1
  });

  useEffect(() => {
    if (client) {
      setFormData({
        ...client
      });
    } else {
      setFormData({
        companyName: '',
        contactName: '',
        phone: '',
        email: '',
        billingAddress: '',
        shippingAddress: '',
        companyId: user?.companyId || 1
      });
    }
  }, [client, isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (client?.clientId) {
        await updateClient(client.clientId, formData);
        toast({
          title: "Success",
          description: "Client updated successfully",
        });
      } else {
        await createClient(formData);
        toast({
          title: "Success",
          description: "Client created successfully",
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

  const handleInputChange = (field: keyof Client, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {client ? 'Update client information' : 'Fill in the details to add a new client'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="contactName">Contact Person</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="billingAddress">Billing Address</Label>
            <Textarea
              id="billingAddress"
              value={formData.billingAddress}
              onChange={(e) => handleInputChange('billingAddress', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="shippingAddress">Shipping Address (Optional)</Label>
            <Textarea
              id="shippingAddress"
              value={formData.shippingAddress}
              onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
              rows={3}
              placeholder="Leave empty to use billing address"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (client ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientModal; 