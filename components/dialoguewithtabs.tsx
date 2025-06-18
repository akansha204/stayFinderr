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
};

export function DialogWithTabs({ triggerLabel = "Open", tabs, onDialogOpen }: DialogWithTabsProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className=" rounded-4xl px-2 p-1 btn-outline-orange text-white hover:-translate-y-0.5 transition duration-200 inline-block text-center hover:cursor-pointer"
                    onClick={onDialogOpen}
                >
                    {triggerLabel}
                </button>
            </DialogTrigger>
            <DialogContent className=" bg-[#FFF3EF] sm:max-w-[425px]">
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