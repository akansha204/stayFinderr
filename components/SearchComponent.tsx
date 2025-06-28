"use client";
import { useState } from "react";
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

interface SearchComponentProps {
    onSearch?: (searchParams: {
        location: string;
        checkInDate: Date | undefined;
        checkOutDate: Date | undefined;
        adults: number;
        children: number;
        rooms: number;
    }) => void;
    variant?: 'hero' | 'page';
    className?: string;
}

export default function SearchComponent({ onSearch, variant = 'page', className = '' }: SearchComponentProps) {
    const [checkInDate, setCheckInDate] = useState<Date>();
    const [checkOutDate, setCheckOutDate] = useState<Date>();
    const [location, setLocation] = useState<string>("");
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [rooms, setRooms] = useState<number>(1);

    const handleSearch = () => {
        if (onSearch) {
            onSearch({
                location,
                checkInDate,
                checkOutDate,
                adults,
                children,
                rooms
            });
        }
    };

    // Style variants
    const isHero = variant === 'hero';
    const containerBg = isHero ? 'bg-white/10 backdrop-blur-sm' : 'bg-white';
    const textColor = isHero ? 'text-white' : 'text-gray-700';
    const placeholderTextColor = isHero ? 'text-white/80' : 'text-gray-600';
    const borderColor = isHero ? 'border-white/20' : 'border-gray-200';
    const selectTriggerClass = isHero ? 'border-none shadow-none p-0 h-auto text-white' : 'border-none shadow-none p-0 h-auto text-gray-700';

    return (
        <div className={`w-full max-w-6xl mx-auto mb-8 ${className}`}>
            <div className={`${containerBg} rounded-2xl shadow-lg overflow-hidden`}>
                <div className="flex flex-col md:flex-row">
                    {/* Location */}
                    <div className={`flex-1 px-6 py-5 bg-transparent flex flex-col min-w-[200px] border-b md:border-b-0 md:border-r ${borderColor}`}>
                        <span className={`${textColor} text-lg font-medium mb-2`}>Location</span>
                        <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger className={selectTriggerClass}>
                                <SelectValue placeholder="Where are you going?" className={textColor} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="delhi">Delhi</SelectItem>
                                <SelectItem value="gurgaon">Gurgaon</SelectItem>
                                <SelectItem value="noida">Noida</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Check-in */}
                    <div className={`flex-1 px-6 py-5 bg-transparent flex flex-col min-w-[140px] border-b md:border-b-0 md:border-r ${borderColor}`}>
                        <span className={`${textColor} text-lg font-medium`}>Check-in</span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className={`mt-1 bg-transparent ${placeholderTextColor} border-none outline-none focus:ring-0 flex items-center gap-2 text-left`}>
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
                    <div className={`flex-1 px-6 py-5 bg-transparent flex flex-col min-w-[140px] border-b md:border-b-0 md:border-r ${borderColor}`}>
                        <span className={`${textColor} text-lg font-medium`}>Check-out</span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className={`mt-1 bg-transparent ${placeholderTextColor} border-none outline-none focus:ring-0 flex items-center gap-2 text-left`}>
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
                    <div className={`flex-1 px-6 py-5 bg-transparent flex flex-col min-w-[120px] border-b md:border-b-0 md:border-r ${borderColor}`}>
                        <span className={`${textColor} text-lg font-medium`}>Peoples</span>
                        <PeopleSelector
                            adults={adults}
                            children={children}
                            rooms={rooms}
                            setAdults={setAdults}
                            setChildren={setChildren}
                            setRooms={setRooms}
                            variant={variant}
                        />
                    </div>
                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="flex items-center justify-center bg-[#E3572B] hover:bg-orange-600 transition-colors px-8 md:px-6 py-5 text-white text-2xl md:rounded-none rounded-b-2xl md:rounded-r-2xl"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
