
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Activity, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { EndpointDetailsModal } from "../EndpointDetailsModal";

interface Endpoint {
  id: string;
  name: string;
  url: string;
  status: "up" | "down" | "warning";
  responseTime: number;
  lastCheck: string;
  team: string;
}

const teams = [
  "Team Alpha", "Team Beta", "Team Gamma", "Team Delta", "Team Echo",
  "Team Foxtrot", "Team Golf", "Team Hotel", "Team India", "Team Juliet"
];

const CARDS_PER_PAGE = 8;

export function EndpointsMonitor() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([
    // Sample data for 10 teams - adding more endpoints for pagination demo
    { id: "1", name: "TSDM API", url: "https://api.tsdm.example.com", status: "up", responseTime: 245, lastCheck: "2 minutes ago", team: "Team Alpha" },
    { id: "2", name: "Navigator API", url: "https://api.navigator.example.com", status: "up", responseTime: 187, lastCheck: "1 minute ago", team: "Team Beta" },
    { id: "3", name: "Auth Service", url: "https://auth.example.com", status: "warning", responseTime: 892, lastCheck: "3 minutes ago", team: "Team Gamma" },
    { id: "4", name: "Database Connector", url: "https://db.example.com", status: "down", responseTime: 0, lastCheck: "5 minutes ago", team: "Team Delta" },
    { id: "5", name: "Payment Gateway", url: "https://pay.example.com", status: "up", responseTime: 320, lastCheck: "1 minute ago", team: "Team Echo" },
    { id: "6", name: "Analytics API", url: "https://analytics.example.com", status: "warning", responseTime: 650, lastCheck: "4 minutes ago", team: "Team Foxtrot" },
    { id: "7", name: "File Storage", url: "https://files.example.com", status: "up", responseTime: 150, lastCheck: "2 minutes ago", team: "Team Golf" },
    { id: "8", name: "Notification Service", url: "https://notify.example.com", status: "down", responseTime: 0, lastCheck: "6 minutes ago", team: "Team Hotel" },
    { id: "9", name: "Search Engine", url: "https://search.example.com", status: "up", responseTime: 410, lastCheck: "1 minute ago", team: "Team India" },
    { id: "10", name: "Logging Service", url: "https://logs.example.com", status: "warning", responseTime: 780, lastCheck: "3 minutes ago", team: "Team Juliet" },
    { id: "11", name: "Cache Service", url: "https://cache.example.com", status: "up", responseTime: 89, lastCheck: "1 minute ago", team: "Team Alpha" },
    { id: "12", name: "Media API", url: "https://media.example.com", status: "up", responseTime: 234, lastCheck: "2 minutes ago", team: "Team Beta" },
    { id: "13", name: "Backup Service", url: "https://backup.example.com", status: "down", responseTime: 0, lastCheck: "7 minutes ago", team: "Team Gamma" },
    { id: "14", name: "Config API", url: "https://config.example.com", status: "warning", responseTime: 567, lastCheck: "3 minutes ago", team: "Team Delta" },
    { id: "15", name: "Monitoring API", url: "https://monitor.example.com", status: "up", responseTime: 123, lastCheck: "1 minute ago", team: "Team Echo" }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === "all" || endpoint.team === selectedTeam;
    const matchesStatus = statusFilter === "all" || endpoint.status === statusFilter;
    
    return matchesSearch && matchesTeam && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEndpoints.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const paginatedEndpoints = filteredEndpoints.slice(startIndex, startIndex + CARDS_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTeam, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "up":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "down":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      up: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      down: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case "up":
        return "shadow-lg shadow-green-500/20 border-green-200 dark:border-green-800";
      case "down":
        return "shadow-lg shadow-red-500/20 border-red-200 dark:border-red-800";
      case "warning":
        return "shadow-lg shadow-yellow-500/20 border-yellow-200 dark:border-yellow-800";
      default:
        return "shadow-lg shadow-gray-500/20";
    }
  };

  const getStatusCounts = () => {
    const filtered = filteredEndpoints;
    return {
      up: filtered.filter(e => e.status === "up").length,
      warning: filtered.filter(e => e.status === "warning").length,
      down: filtered.filter(e => e.status === "down").length
    };
  };

  const statusCounts = getStatusCounts();

  const handleCardClick = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEndpoint(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Endpoints Monitor</h1>
          <p className="text-muted-foreground">Real-time health monitoring for all endpoints across teams</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live Monitoring</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="up">Up</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="down">Down</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedEndpoints.map((endpoint) => (
          <Card 
            key={endpoint.id} 
            className={`hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 transform relative ${getStatusGlow(endpoint.status)}`}
            onClick={() => handleCardClick(endpoint)}
          >
            {/* Heartbeat indicator */}
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{endpoint.name}</CardTitle>
                {getStatusIcon(endpoint.status)}
              </div>
              <div className="text-xs text-muted-foreground">{endpoint.team}</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground truncate">
                {endpoint.url}
              </div>
              
              <div className="flex items-center justify-between">
                {getStatusBadge(endpoint.status)}
                <span className="text-xs text-muted-foreground">
                  {endpoint.responseTime > 0 ? `${endpoint.responseTime}ms` : "N/A"}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last check: {endpoint.lastCheck}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.up}</div>
              <div className="text-sm text-muted-foreground">Healthy Endpoints</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.warning}</div>
              <div className="text-sm text-muted-foreground">Warning Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{statusCounts.down}</div>
              <div className="text-sm text-muted-foreground">Down Endpoints</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EndpointDetailsModal 
        endpoint={selectedEndpoint}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
