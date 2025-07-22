import { useState } from "react";
import RewardClaimModal from "./reward-claim-modal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Award } from "lucide-react";
import { Button } from "./ui/button";
interface RewardCardProps {
  badge: string;
  money: number;
  isCompleted: boolean;
  onClaim: () => void;
}

export default function RewardCard({
  badge,
  money,
  isCompleted,
  onClaim,
}: RewardCardProps) {
  const [showModal, setShowModal] = useState(false);

  const handleClaim = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    onClaim();
    setShowModal(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Level Reward</CardTitle>
          <CardDescription>
            Complete all tasks to earn this reward
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-medium">{badge}</h3>
              <p className="text-sm text-muted-foreground">Badge</p>
            </div>
            <div className="text-center">
              <h3 className="font-medium">₹{money.toLocaleString()}</h3>
              <p className="text-sm text-muted-foreground">Virtual Money</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={!isCompleted}
            onClick={handleClaim}>
            {isCompleted ? "Claim Reward" : "Complete All Tasks"}
          </Button>
        </CardFooter>
      </Card>

      <RewardClaimModal show={showModal} onClose={() => handleCloseModal()} />
    </>
  );
}
