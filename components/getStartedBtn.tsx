"use client";
import { DialogWithTabs } from "./dialoguewithtabs";
import SignUpPage from "@/app/register/page";
// Add prop type
type GetStartedButtonProps = {
    onDialogOpen?: () => void;
};
export default function GetStartedButton({ onDialogOpen }: GetStartedButtonProps) {
    const tabs = [
        {
            value: "guest",
            label: "Guest",
            content: <SignUpPage />,
        },
        {
            value: "host",
            label: "Host",
            content: <SignUpPage />,
        },
    ];
    return (
        <>
            <main>
                <DialogWithTabs triggerLabel="Get Started" tabs={tabs} onDialogOpen={onDialogOpen} />
            </main>
        </>
    );
}