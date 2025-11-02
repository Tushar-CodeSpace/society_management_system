import AppBody from "@/components/app-body";
import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function HomePage() {
    return (
        <SidebarProvider >
            <AppSidebar />
            <SidebarInset>
                <AppHeader />
                <AppBody />
            </SidebarInset>
        </SidebarProvider>
    );
}