"use client";

import Link from "next/link";
import {Button} from "../../@/components/ui/button";
import {Card, CardContent, CardTitle} from "../../@/components/ui/card";

const HomePage = () => {
    return (
        <div className="container mx-auto">
            <h1 className="text-center text-5xl py-6">Welcome to NxtEp</h1>
            <div className="px-6 grid">

                <Button
                    variant="outline"
                    className="bg-green-50 hover:bg-green-500 hover:text-white font-semibold"
                    asChild
                >
                    <Link href="/statsforvalteren">Statsforvalterens høringer</Link>
                </Button>
                <p className="py-3"></p>
                <Button
                    variant="outline"
                    className="bg-green-50 hover:bg-green-500 hover:text-white font-semibold"
                    asChild
                >
                    <Link href="/norskeUtslipp">Tillatelser fra Norske Utslipp</Link>
                </Button>

                <p className="py-3"></p>

                <Button
                    variant="outline"
                    className="bg-green-50 hover:bg-green-500 hover:text-white font-semibold"
                    asChild
                >
                    <Link href="/login">Login</Link>
                </Button>

                <p className="py-3"></p>

                <Card className="flex justify-between items-center">
                    <div>
                        <CardTitle>Personvernerklæring</CardTitle>
                        <CardContent>
                            <p>Vi tar personvern på alvor og ønsker at
                                du skal føle deg trygg når du bruker tjenestene våre.</p>
                        </CardContent>
                    </div>
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L3 5V11C3 16.52 7.03 21.74 12 23C16.97 21.74 21 16.52 21 11V5L12 2Z"
                              fill="#4CAF50"/>
                        <path
                            d="M12 12C10.34 12 9 13.34 9 15V17H15V15C15 13.34 13.66 12 12 12ZM12 14C12.55 14 13 14.45 13 15H11C11 14.45 11.45 14 12 14ZM17 8H7V10H17V8Z"
                            fill="white"/>
                    </svg>
                </Card>

            </div>
        </div>
    );
};

export default HomePage;
