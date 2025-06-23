"use client";
import { DialogWithTabs } from "./dialoguewithtabs";
import SignUpPage from "@/app/register/page";
import { useState } from "react";

// Add prop type
type GetStartedButtonProps = {
    onDialogOpen?: () => void;
};

export default function GetStartedButton({ onDialogOpen }: GetStartedButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
    };

    const tabs = [
        {
            value: "guest",
            label: "Guest",
            content: <SignUpPage role="GUEST" onSignUpSuccess={handleDialogClose} />,
        },
        {
            value: "host",
            label: "Host",
            content: <SignUpPage role="HOST" onSignUpSuccess={handleDialogClose} />,
        },
    ];

    return (
        <>
            <main>
                <DialogWithTabs
                    triggerLabel="Get Started"
                    tabs={tabs}
                    onDialogOpen={onDialogOpen}
                    onDialogClose={handleDialogClose}
                    open={isDialogOpen}
                    onOpenChange={handleOpenChange}
                />
            </main>
        </>
    );
}