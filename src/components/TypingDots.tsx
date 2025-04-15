import { Card, CardContent } from "@/components/ui/card";

export default function TypingDots() {
  return (
    <Card className="w-fit bg-muted px-4 py-2 rounded-2xl shadow">
      <CardContent className="flex items-center gap-1 p-0">
        <span className="typing-dot" />
        <span className="typing-dot animation-delay-200" />
        <span className="typing-dot animation-delay-400" />
      </CardContent>
    </Card>
  );
}
