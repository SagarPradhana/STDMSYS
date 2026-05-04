"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Calendar,
  User,
  FileText,
  Pin,
  Clock,
  ChevronRight,
} from "lucide-react";
import { PageHeader, Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import { useGetNoticesQuery } from "@school-management/store";

interface Notice {
  _id: string;
  title: string;
  content: string;
  postedBy: { name: string };
  category: "general" | "exam" | "assignment" | "event" | "holiday";
  priority: "high" | "medium" | "low";
  createdAt: string;
  attachments?: { name: string; url: string }[];
  targetClasses?: string[];
}

export default function TeacherNoticesPage() {
  const { data: notices = [], isLoading } = useGetNoticesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const filteredNotices = notices.filter((n: Notice) => {
    const matchesSearch = n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || n.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "exam": return "bg-red-500/10 text-red-500";
      case "assignment": return "bg-yellow-500/10 text-yellow-500";
      case "event": return "bg-blue-500/10 text-blue-500";
      case "holiday": return "bg-green-500/10 text-green-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === "high") return "🔴";
    if (priority === "medium") return "🟡";
    return "🟢";
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notices" 
        subtitle="School announcements and updates"
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-card border rounded-xl text-sm"
        >
          <option value="all">All Categories</option>
          <option value="general">General</option>
          <option value="exam">Exam</option>
          <option value="assignment">Assignment</option>
          <option value="event">Event</option>
          <option value="holiday">Holiday</option>
        </select>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted/30 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredNotices.length > 0 ? (
            filteredNotices.map((notice: Notice, index: number) => (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedNotice(notice)}
                className={cn(
                  "bg-card rounded-xl p-5 border cursor-pointer transition-all hover:shadow-lg",
                  selectedNotice?._id === notice._id && "ring-2 ring-primary"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", getCategoryColor(notice.category))}>
                        {notice.category}
                      </span>
                      <span className="text-xs">{getPriorityIcon(notice.priority)}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{notice.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{notice.content}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{notice.postedBy?.name || "Admin"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                  {notice.attachments && notice.attachments.length > 0 && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{notice.attachments.length} attached</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No notices found</p>
            </div>
          )}
        </div>

        {selectedNotice && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-80 bg-card rounded-xl border p-5 h-fit sticky top-4"
          >
            <h3 className="font-semibold mb-4">Notice Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Title</label>
                <p className="font-medium">{selectedNotice.title}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Posted By</label>
                <p>{selectedNotice.postedBy?.name || "Admin"}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</label>
                <p>{new Date(selectedNotice.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Content</label>
                <p className="text-sm mt-1">{selectedNotice.content}</p>
              </div>
              {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Attachments</label>
                  <div className="mt-2 space-y-2">
                    {selectedNotice.attachments.map((att, i) => (
                      <a 
                        key={i} 
                        href={att.url} 
                        className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg text-sm hover:bg-muted"
                      >
                        <FileText className="w-4 h-4" />
                        {att.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setSelectedNotice(null)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}