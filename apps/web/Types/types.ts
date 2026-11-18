
//------- BIDS TYPES FOR NOTIFICATION
export type BIDS_TYPE = {
  id: string;
  amount: number;
  deliveryDays: number;
  proposal: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  freelancerId: string;

  freelancer: {
    id: string;
    name: string;
    picture: string;
  };

  job: {
    id: string;
    title: string;
    clientId: string;
  };
};
