import { dbConnect } from "@/lib/dbConnect";
import { LinkModel } from "@/models/Link";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        try {
            const data = await req.json();
            const { url, shorturl, expireAfterSeconds } = data;


            if (!url || !shorturl) {
                return NextResponse.json({ error: "Please fill all fields" }, { status: 500 });
            }

            const existingLink = await LinkModel.findOne({ shorten_url: shorturl });
            
            
            if (existingLink) {
                if (existingLink.expireAfterSeconds === "null") {
                    return NextResponse.json({ error: "Sorry! Url already taken.. Try another one" }, { status: 500 });
                }

                const createdDate: Date = new Date(existingLink.createdAt.toString());
                console.log(createdDate);
                
                // Add the expireAfterSeconds to createdDate
                
                const expirationTime = createdDate.getTime() + parseInt(existingLink.expireAfterSeconds) * 1000;
                const currentTime = Date.now();
                
                console.log(currentTime, expirationTime);
                if (currentTime >= expirationTime) {
                    // If expired, delete the existing link and create a new one
                    await LinkModel.deleteOne({ shorten_url: shorturl });
                }
                else{
                    return NextResponse.json({ error: "Sorry! Url already taken.. Try another one" }, { status: 500 });
                }
            }

            const link = await LinkModel.create({ url, shorten_url: shorturl, expireAfterSeconds, createdAt: new Date() });
            return NextResponse.json(link, { status: 200 });

        } catch (error) {
            console.log(error);

            return NextResponse.json({ error: "Error creating shortern link" }, { status: 500 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error connecting to Database" }, { status: 500 });
        
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        try {
            const data = await req.headers;
            // console.log(data);

            const shorturl = data.get('shorturl');
            console.log(shorturl);

            const link = await LinkModel.findOne({ shorten_url: shorturl });

            if (!link) {
                return NextResponse.json({ error: "Link not found" }, { status: 404 });
            }

            return NextResponse.json(link, { status: 200 });

        } catch (error) {
            console.log(error);
            return NextResponse.json({ error }, { status: 500 });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Error connecting to Database" }, { status: 500 });
    }
}