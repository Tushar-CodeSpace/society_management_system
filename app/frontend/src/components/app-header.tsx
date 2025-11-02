"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import * as React from "react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function AppHeader() {
    const location = useLocation();
    const segments = location.pathname.split("/").filter(Boolean);

    return (
        <header className=" justify-between flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />

                <Breadcrumb>
                    <BreadcrumbList>
                        {/* Always start with Home */}
                        {/* <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem> */}

                        {segments.map((segment, index) => {
                            const path = "/" + segments.slice(0, index + 1).join("/");
                            const isLast = index === segments.length - 1;

                            const label = segment
                                .replace(/[-_]/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase());

                            return (
                                <React.Fragment key={path}>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>{label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link to={path}>{label}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex items-center gap-2 px-4">
                <ModeToggle />
                <Button className=" bg-transparent hover:bg-transparent text-red-300 hover:text-red-500 cursor-pointer" variant="outline" size="icon">
                    <LogOut />
                </Button>
            </div>
        </header>
    );
}
