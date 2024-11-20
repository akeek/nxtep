import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Define file paths
    const jsonFilePath = path.join(
      process.cwd(),
      "public",
      "data",
      "scraped.json"
    );
    const screenshotsDir = path.join(
      process.cwd(),
      "public",
      "data",
      "screenshots",
      "statsforvalteren",
      "hoeringer"
    );
    const pdfsDir = path.join(
      process.cwd(),
      "public",
      "data",
      "pdfs",
      "statsforvalteren",
      "hoeringer"
    );

    // Read the links_with_titles.json file
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

    // Extract links from the scraped data
    const extractedLinks = jsonData
      .map((item: any) => item.links.map((link: any) => link.link))
      .flat();

    // Get list of screenshot and PDF files
    const screenshots = fs.existsSync(screenshotsDir)
      ? fs.readdirSync(screenshotsDir)
      : [];
    const pdfs = fs.existsSync(pdfsDir) ? fs.readdirSync(pdfsDir) : [];

    // Prepare response data
    const responseData = {
      jsonData,
      screenshots,
      pdfs,
      links: extractedLinks,
    };

    // Return the data as JSON response
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error loading scraped data:", error);
    return NextResponse.json(
      { message: "Failed to load scraped data." },
      { status: 500 }
    );
  }
}
