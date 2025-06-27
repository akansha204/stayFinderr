"use client";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import PeopleSelector from "@/components/PeopleSelector";
import { LoginButton } from "./loginBtn";
import GetStartedButton from "./getStartedBtn";

export default function Hero() {
    const [checkInDate, setCheckInDate] = useState<Date>();
    const [checkOutDate, setCheckOutDate] = useState<Date>();
    const [location, setLocation] = useState<string>("");
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [rooms, setRooms] = useState<number>(1);

    return (
        <section className="flex justify-center items-center py-8 mt-15 bg-[#FFF8F2]">
            <div className="relative w-[90vw] max-w-5xl rounded-3xl overflow-hidden shadow-xl bg-black/70">
                {/* Background Image */}
                <Image
                    src="/stayfinder-hero.png"
                    alt="Modern House"
                    fill
                    className="object-cover object-center z-0"
                    style={{ filter: "brightness(0.7)" }}
                />
                {/* Overlay Content */}
                <div className="relative z-10 p-10 flex flex-col gap-6">
                    {/* Heading and Avatars */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-5xl md:text-6xl font-outfit-thin text-white leading-tight">
                                Find your
                            </h1>
                            {/* Avatars */}
                            <div className="flex -space-x-3">
                                <Avatar>
                                    <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" alt="User 1" />
                                    <AvatarFallback>U1</AvatarFallback>
                                </Avatar>
                                <Avatar>
                                    <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" alt="User 2" />
                                    <AvatarFallback>U2</AvatarFallback>
                                </Avatar>
                                <Avatar>
                                    <AvatarImage src="https://randomuser.me/api/portraits/men/65.jpg" alt="User 3" />
                                    <AvatarFallback>U3</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                        <span className="text-5xl md:text-6xl text-white font-playfair-italic ml-1">
                            Dream <span className="italic">Stay</span>
                        </span>
                    </div>
                    {/* Subheading */}
                    <p className="text-white text-base md:text-lg max-w-xl">
                        Crafting urban masterpieces, we redefine cityscapes by seamlessly blending modern real estate into iconic skylines
                    </p>
                    {/* Search Bar */}
                    <div className="mt-4 flex flex-col items-center">
                        <div className="flex flex-col md:flex-row bg-gradient-to-r from-neutral-700/80 to-orange-400/60 rounded-2xl overflow-hidden shadow-lg w-full max-w-3xl">
                            {/* Location */}
                            <div className="flex-1 px-6 py-5 bg-transparent flex flex-col min-w-[180px]">
                                <span className="text-white text-lg font-medium">Location</span>
                                <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger className="w-[150px] mt-2 bg-transparent ">
                                        <SelectValue placeholder="India" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Delhi">Delhi</SelectItem>
                                        <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                                        <SelectItem value="Noida">Noida</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Check-in */}
                            <div className="flex-1 px-6 py-5 bg-transparent flex flex-col min-w-[140px] border-t md:border-t-0 md:border-l border-white/20">
                                <span className="text-white text-lg font-medium">Check-in</span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="mt-1 bg-transparent text-white border-none outline-none focus:ring-0 flex items-center gap-2 text-left">
                                            <CalendarIcon className="h-4 w-4" />
                                            {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={checkInDate}
                                            onSelect={setCheckInDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {/* Check-out */}
                            <div className="flex-1 px-6 py-5 bg-transparent flex flex-col min-w-[140px] border-t md:border-t-0 md:border-l border-white/20">
                                <span className="text-white text-lg font-medium">Check-out</span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="mt-1 bg-transparent text-white border-none outline-none focus:ring-0 flex items-center gap-2 text-left">
                                            <CalendarIcon className="h-4 w-4" />
                                            {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={checkOutDate}
                                            onSelect={setCheckOutDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            {/* Peoples */}
                            <div className="flex-1 px-6 py-5 bg-transparent flex flex-col min-w-[120px] border-t md:border-t-0 md:border-l border-white/20">
                                <span className="text-white text-lg font-medium">Peoples</span>
                                <PeopleSelector
                                    adults={adults}
                                    children={children}
                                    rooms={rooms}
                                    setAdults={setAdults}
                                    setChildren={setChildren}
                                    setRooms={setRooms}
                                />
                            </div>
                            {/* Search Button */}
                            <button className="flex items-center justify-center bg-[#E3572B] hover:bg-orange-600 transition-colors px-8 md:px-6 py-5 text-white text-2xl md:rounded-none rounded-b-2xl md:rounded-r-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-start flex-col gap-1 w-full md:hidden">
                        <h2 className="font-outfit-thin text-white text-2xl">Start listing your properties </h2>
                        <GetStartedButton />
                    </div>
                </div>
            </div>
        </section>
    );
}
