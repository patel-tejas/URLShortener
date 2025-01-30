import { redirect, notFound } from "next/navigation";
import axios from "axios";

export default async function page(props: { params: Promise<{ shorturl: string[] }> }) {
    const { params } = await props;

  const PRODUCTION = true;

  const URL = PRODUCTION ? "https://shortenyoururl.vercel.app" : "http://localhost:3000"
    
    let url;
    if (!(await params).shorturl) {
        return redirect("/404");
    }

    const shortUrl = (await params).shorturl[0];
    // Extract the short URL

    try {
        const response = await axios.get(`${URL}/api/shorten-url`, {
            headers: { shorturl: shortUrl },
        });

        console.log(response.data);

        if (response.status === 200) {
            url = response.data.url;
        } else {
            notFound();
        }

    } catch (error) {
        console.error("Error fetching URL:", error);
        return <p>Something went wrong</p>;
    }
    finally {
        if (url) {
            return redirect(url);
        }
        else {
            return redirect("/")
        }
    }
}
