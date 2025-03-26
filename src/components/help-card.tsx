import Link from "next/link";
import type { BookOpen, CircleHelp } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HelpLink {
  icon: typeof BookOpen | typeof CircleHelp;
  label: string;
  href: string;
}

interface HelpCardProps {
  links: HelpLink[];
}

export default function HelpCard({ links }: HelpCardProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Need Help?</CardTitle>
        <CardDescription>Resources for this level</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="flex items-center gap-2 text-sm text-primary hover:underline">
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
