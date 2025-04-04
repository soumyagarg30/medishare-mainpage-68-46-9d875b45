
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserCircle,
  Gift,
  Clock,
  FileText,
  TrendingUp,
  Settings,
  BarChart3,
  MapPin,
  Bell
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const tabs = [
    {
      name: "profile",
      label: "Profile",
      icon: <UserCircle size={18} />,
      externalLink: false,
    },
    {
      name: "donate",
      label: "Donate Medicines",
      icon: <Gift size={18} />,
      externalLink: false,
    },
    {
      name: "history",
      label: "Donation History",
      icon: <Clock size={18} />,
      externalLink: false,
    },
    {
      name: "nearby",
      label: "NGOs Near Me",
      icon: <MapPin size={18} />,
      externalLink: false,
    },
    {
      name: "notifications",
      label: "Notifications",
      icon: <Bell size={18} />,
      externalLink: false,
    },
    {
      name: "impact",
      label: "Impact",
      icon: <TrendingUp size={18} />,
      externalLink: false,
    },
    {
      name: "analytics",
      label: "Analytics",
      icon: <BarChart3 size={18} />,
      externalLink: false,
    },
    {
      name: "tax",
      label: "Tax Benefits",
      icon: <FileText size={18} />,
      externalLink: false,
    },
    {
      name: "settings",
      label: "Settings",
      icon: <Settings size={18} />,
      externalLink: false,
    },
  ];

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col h-auto items-stretch gap-2 bg-transparent p-1">
          {tabs.map((tab) => (
            <button 
              key={tab.name}
              onClick={() => setActiveTab(tab.name)} 
              className={`flex items-center justify-start gap-2 px-4 py-3 rounded-sm ${activeTab === tab.name ? "bg-medishare-blue/10 text-medishare-blue" : "text-foreground"}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Sidebar;
