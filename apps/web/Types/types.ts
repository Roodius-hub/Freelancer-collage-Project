
//------- BIDS TYPES FOR NOTIFICATION
export type BIDS_TYPE = {
  id: string;
  amount: number;
  deliveryDays: number;
  proposal: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: Date;
  updatedAt: Date;
  freelancerId: string;

  freelancer: {
    id: string;
    name: string;
    picture: string;
  };

  job: {
    id: string;
    description: string;
      clientId: string;
      status: "OPEN" | "ASSIGNED" | "COMPLETED" | "CANCELLED" 
  };
};

// Reviews
export type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  client?: {
    id: string;
    name: string | null;
    picture?: string | null;
  };
  job?: {
    id: string;
    title: string;
  };
};