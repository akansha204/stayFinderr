"use client";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SearchComponent from "@/components/SearchComponent";
import GetStartedButton from "./getStartedBtn";
import { useRouter } from "next/navigation";



export default function Hero() {
    const router = useRouter();

    const handleSearch = (searchParams: any) => {
        // console.log('Hero search:', searchParams);

        // Create URL search parameters
        const params = new URLSearchParams();

        if (searchParams.location) {
            params.append('location', searchParams.location);
        }
        if (searchParams.checkInDate) {
            params.append('checkInDate', searchParams.checkInDate.toISOString());
        }
        if (searchParams.checkOutDate) {
            params.append('checkOutDate', searchParams.checkOutDate.toISOString());
        }
        if (searchParams.adults) {
            params.append('adults', searchParams.adults.toString());
        }
        if (searchParams.children) {
            params.append('children', searchParams.children.toString());
        }
        if (searchParams.rooms) {
            params.append('rooms', searchParams.rooms.toString());
        }

        // Navigate to listings page with search parameters
        router.push(`/listings?${params.toString()}`);
    };

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
                        Curating unforgettable stays, we transform travel into timeless experiences by seamlessly blending comfort, elegance, and local charm.                    </p>
                    {/* Search Component */}
                    <SearchComponent
                        variant="hero"
                        onSearch={handleSearch}
                        className="mt-4 max-w-4xl"
                    />
                    <div className="flex justify-start flex-col gap-1 w-full md:hidden">
                        <h2 className="font-outfit-thin text-white text-2xl">Start listing your properties </h2>
                        <GetStartedButton />
                    </div>
                </div>
            </div>
        </section>
    );
}
