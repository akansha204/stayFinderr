"use client";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserIcon, BedIcon } from "lucide-react";

export default function PeopleSelector() {
    const [open, setOpen] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);

    const handleOk = () => setOpen(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-transparent min-w-0 focus:outline-none  transition shadow-sm"
                >
                    <span className="flex items-center gap-1 text-white text-lg font-medium">
                        <span>{adults + children}</span>
                        <UserIcon className="w-5 h-5 text-primary-orange" />
                    </span>
                    <span className="mx-1 text-gray-400">·</span>
                    <span className="flex items-center gap-1 text-white text-lg font-medium">
                        <span>{rooms}</span>
                        <BedIcon className="w-5 h-5 text-primary-orange" />
                    </span>
                </button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl p-4 w-64 bg-white/90 flex flex-col items-center gap-4 min-w-0">
                <div className="flex flex-col gap-3 w-full">
                    <PeopleRow label="Adults" value={adults} setValue={setAdults} min={1} />
                    <PeopleRow label="Children" value={children} setValue={setChildren} min={0} />
                    <PeopleRow label="Rooms" value={rooms} setValue={setRooms} min={1} />
                </div>
                <Button
                    className="w-full mt-2 bg-primary-orange text-white rounded-lg text-lg font-semibold "
                    onClick={handleOk}
                >
                    OK
                </Button>
            </DialogContent>
        </Dialog>
    );
}

function PeopleRow({ label, value, setValue, min }: { label: string; value: number; setValue: (v: number) => void; min: number }) {
    return (
        <div className="flex items-center justify-between w-full">
            <span className="text-gray-700 font-medium w-20">{label}</span>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-md border-gray-300 text-xl px-2 py-1"
                    onClick={() => setValue(Math.max(min, value - 1))}
                >
                    –
                </Button>
                <span className="w-6 text-center text-lg font-semibold">{value}</span>
                <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-md border-gray-300 text-xl px-2 py-1"
                    onClick={() => setValue(value + 1)}
                >
                    +
                </Button>
            </div>
        </div>
    );
} 