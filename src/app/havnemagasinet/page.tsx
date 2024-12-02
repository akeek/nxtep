"use client";

import React, { useEffect, useState } from "react";
import havnemagasinetData from "../../../public/data/json/havnemagasinet.json";
import { Card, CardContent, CardTitle } from "../../../@/components/ui/card";
import Link from "next/link";

interface Havnemagasinet {
  id: number;
  link: string;
  storytitle: string;
  imgSrc: string;
  publishedTime: Date;
}

const HavnemagasinetPage: React.FC = () => {
  const [data, setData] = useState<Havnemagasinet[]>([]);

  useEffect(() => {
    const parsedData = havnemagasinetData.map((item: any) => ({
      ...item,
      publishedTime: new Date(item.publishedTime),
    }));
    setData(parsedData);
  }, []);

  return (
    <div className="container mx-auto py-3">
      <h1 className="text-center text-3xl font-bold py-5">Havnemagasinet</h1>
      <div className="grid grid-cols-2 gap-5">
        {data.map((item) => (
          <div key={item.id}>
            <Card className="">
              <CardTitle className="pt-4 pl-6 h-28">
                <Link
                  className="text-blue-500 hover:text-green-900 hover:underline"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.storytitle}
                </Link>
                <p className="text-gray-500 text-sm">
                  {item.publishedTime.toLocaleDateString()}
                </p>
              </CardTitle>
              <CardContent>
                <img
                  className="object-cover h-[250px] w-full"
                  src={item.imgSrc}
                  alt={item.storytitle}
                />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HavnemagasinetPage;
