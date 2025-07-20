"use client";

import { useState } from "react";
import { IconTrendingUp, IconTrendingDown, IconMessageCircle, IconFiles, IconUsers, IconClock } from "@tabler/icons-react";
import { Upload, FileText, Check, X } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneFileMessage,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneRetryFile,
  DropzoneTrigger,
  InfiniteProgress,
  useDropzone,
} from "@/components/ui/dropzone";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/scroll-area";
import { User } from "lucide-react";

// Mock data for demonstration
const mockStats = {
  totalQueries: 12450,
  activeUsers: 1834,
  avgResponseTime: 1.2,
  documentsIndexed: 567,
  queriesChange: 15.2,
  usersChange: -3.1,
  responseTimeChange: -8.5,
  documentsChange: 12.8,
};

export default function AdminPage() {
  const [chatMode, setChatMode] = useState("kalenderakademik");

  const handleModeChange = (mode: string) => {
    setChatMode(mode.toLowerCase().replace(/\s/g, ''));
  };

  // Dropzone configuration
  const dropzoneProps = useDropzone({
    onDropFile: async (file) => {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success/error for demonstration
      if (Math.random() > 0.3) {
        return { status: "success", result: { fileId: crypto.randomUUID(), filename: file.name } };
      } else {
        return { status: "error", error: "Failed to upload file. Please try again." };
      }
    },
    validation: {
      accept: {
        'application/pdf': ['.pdf'],
        'text/plain': ['.txt'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      },
      maxSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
    },
    autoRetry: true,
    maxRetryCount: 3,
  });

  return (
    <SidebarProvider>
      <AppSidebar onModeChange={handleModeChange} />
      <SidebarInset className="bg-sidebar group/sidebar-inset">
        <header className="dark flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-sidebar text-sidebar-foreground relative before:absolute before:inset-y-3 before:-left-px before:w-px before:bg-gradient-to-b before:from-white/5 before:via-white/15 before:to-white/5 before:z-50">
          <SidebarTrigger className="-ms-2" />
          <div className="flex items-center gap-8 ml-auto">
            <nav className="flex items-center text-sm font-medium max-sm:hidden">
              <a
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
                href="/"
              >
                Playground
              </a>
              <a
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
                href="#"
                aria-current
              >
                Admin Dashboard
              </a>
              <a
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
                href="#"
              >
                Docs
              </a>
              <a
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
                href="#"
              >
                API Reference
              </a>
            </nav>
            <User className="h-6 w-6 text-sidebar-foreground/70" />
          </div>
        </header>
        
        <div className="flex h-[calc(100svh-4rem)] bg-[hsl(240_5%_92.16%)] md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none transition-all ease-in-out duration-300">
          <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
            <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
              {/* Header */}
              <div className="py-5 bg-background sticky top-0 z-10 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
                <div className="flex items-center justify-between gap-2">
                  <Breadcrumb>
                    <BreadcrumbList className="sm:gap-1.5">
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Admin</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 py-6 space-y-8">
                {/* Stats Cards */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">AI Chatbot Usage Statistics</h2>
                  <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-2 xl:grid-cols-4">
                    
                    {/* Total Queries Card */}
                    <Card className="@container/card">
                      <CardHeader>
                        <CardDescription>Total Queries</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          {mockStats.totalQueries.toLocaleString()}
                        </CardTitle>
                        <CardAction>
                          <Badge variant="outline">
                            <IconTrendingUp className="size-3" />
                            +{mockStats.queriesChange}%
                          </Badge>
                        </CardAction>
                      </CardHeader>
                      <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                          Strong usage growth <IconMessageCircle className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                          Student interactions this month
                        </div>
                      </CardFooter>
                    </Card>

                    {/* Active Users Card */}
                    <Card className="@container/card">
                      <CardHeader>
                        <CardDescription>Active Users</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          {mockStats.activeUsers.toLocaleString()}
                        </CardTitle>
                        <CardAction>
                          <Badge variant="outline">
                            <IconTrendingDown className="size-3" />
                            {mockStats.usersChange}%
                          </Badge>
                        </CardAction>
                      </CardHeader>
                      <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                          Weekly active students <IconUsers className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                          Engagement across campus
                        </div>
                      </CardFooter>
                    </Card>

                    {/* Average Response Time Card */}
                    <Card className="@container/card">
                      <CardHeader>
                        <CardDescription>Avg Response Time</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          {mockStats.avgResponseTime}s
                        </CardTitle>
                        <CardAction>
                          <Badge variant="outline">
                            <IconTrendingUp className="size-3" />
                            {mockStats.responseTimeChange}%
                          </Badge>
                        </CardAction>
                      </CardHeader>
                      <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                          Performance improving <IconClock className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                          Faster AI responses
                        </div>
                      </CardFooter>
                    </Card>

                    {/* Documents Indexed Card */}
                    <Card className="@container/card">
                      <CardHeader>
                        <CardDescription>Documents Indexed</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                          {mockStats.documentsIndexed.toLocaleString()}
                        </CardTitle>
                        <CardAction>
                          <Badge variant="outline">
                            <IconTrendingUp className="size-3" />
                            +{mockStats.documentsChange}%
                          </Badge>
                        </CardAction>
                      </CardHeader>
                      <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                          Knowledge base growing <IconFiles className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                          University resources added
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </section>

                {/* File Upload Section */}
                <section>
                  <h2 className="text-2xl font-semibold mb-6">RAG Document Management</h2>
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Documents</CardTitle>
                      <CardDescription>
                        Add new documents to the AI knowledge base. Supported formats: PDF, DOC, DOCX, TXT (Max 10MB each)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Dropzone {...dropzoneProps}>
                        <DropZoneArea className="min-h-[200px] border-2 border-dashed">
                          <div className="flex flex-col items-center gap-4 text-center">
                            <Upload className="size-12 text-muted-foreground" />
                            <div>
                              <DropzoneTrigger>
                                <Button>Choose Files</Button>
                              </DropzoneTrigger>
                              <p className="text-sm text-muted-foreground mt-2">
                                or drag and drop files here
                              </p>
                            </div>
                          </div>
                        </DropZoneArea>
                        
                        <DropzoneMessage />
                        <DropzoneDescription>
                          Files will be processed and added to the AI knowledge base automatically.
                        </DropzoneDescription>

                        {dropzoneProps.fileStatuses.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-medium mb-3">Uploaded Files</h4>
                            <DropzoneFileList>
                              {dropzoneProps.fileStatuses.map((file) => (
                                <DropzoneFileListItem key={file.id} file={file}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <FileText className="size-5 text-muted-foreground shrink-0" />
                                      <div className="min-w-0">
                                        <p className="font-medium truncate">{file.fileName}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          {file.status === "pending" && (
                                            <InfiniteProgress status="pending" className="w-24 h-1" />
                                          )}
                                          {file.status === "success" && (
                                            <div className="flex items-center gap-1 text-green-600">
                                              <Check className="size-4" />
                                              <span className="text-xs">Uploaded</span>
                                            </div>
                                          )}
                                          {file.status === "error" && (
                                            <div className="flex items-center gap-1 text-red-600">
                                              <X className="size-4" />
                                              <span className="text-xs">Failed</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {file.status === "error" && dropzoneProps.canRetry(file.id) && (
                                        <DropzoneRetryFile />
                                      )}
                                      <DropzoneRemoveFile />
                                    </div>
                                  </div>
                                  <DropzoneFileMessage />
                                </DropzoneFileListItem>
                              ))}
                            </DropzoneFileList>
                          </div>
                        )}
                      </Dropzone>
                    </CardContent>
                  </Card>
                </section>
              </div>
            </div>
          </ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}