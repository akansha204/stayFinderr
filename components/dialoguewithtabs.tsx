"use client";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type TabType = {
    value: string;
    label: string;
    content: React.ReactNode;
};

// Add prop type
type DialogWithTabsProps = {
    triggerLabel?: string;
    tabs: TabType[];
    onDialogOpen?: () => void;
    onDialogClose?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export function DialogWithTabs({
    triggerLabel = "Open",
    tabs,
    onDialogOpen,
    onDialogClose,
    open,
    onOpenChange
}: DialogWithTabsProps) {
    const handleOpenChange = (isOpen: boolean) => {
        if (onOpenChange) {
            onOpenChange(isOpen);
        }
        if (!isOpen && onDialogClose) {
            onDialogClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button
                    className=" 
                    hover:-translate-y-0.5 transition duration-200 inline-block text-center hover:cursor-pointer bg-primary-orange rounded-sm p-2 text-white font-bold"
                    onClick={onDialogOpen}
                >
                    {triggerLabel}
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#FFF3EF] sm:max-w-[425px]">
                {/* <DialogTitle>Sign Up</DialogTitle> */}
                <Tabs defaultValue={tabs[0].value}>
                    <TabsList className="grid w-full grid-cols-2 bg-transparent">
                        {tabs.map((tab: TabType) => (
                            <TabsTrigger key={tab.value} value={tab.value}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {tabs.map((tab: TabType) => (
                        <TabsContent key={tab.value} value={tab.value}>
                            {tab.content}
                        </TabsContent>
                    ))}
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}