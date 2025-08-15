import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

// Initialize the S3 client
const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECTRET_KEY,
  },
});

// Handle PUT request for file upload
export async function PUT(req) {
  const formData = await req.formData();
  const files = formData.getAll("files"); // Retrieve all files uploaded in the form
  const fileDetails = [];

  try {
    // Loop through the files and upload them one by one
    for (const file of files) {
      //uuid cannot contain special characters
      const fileName = `${uuidv4().replace(/-/g, "")}$${file.name}`;
      const fileType = file.type;

      // Convert file to Buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Create the PutObjectCommand and include the Body (file content)
      const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: fileName, // Make the file name unique
        Body: buffer,
        ContentType: fileType,
      });

      // Upload the file to S3
      await s3.send(command);

      // Generate the file URL and store it in the fileDetails array
      const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;
      fileDetails.push({ url: fileUrl, name: fileName, type: fileType });
    }

    // Return success response with the file details
    return NextResponse.json(
      {
        message: "Files uploaded successfully",
        files: fileDetails, // Return the list of file details
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { message: "File upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const body = await req.json();
  const { fileName } = body;
  console.log("fileName: ", fileName);

  if (!fileName) {
    return NextResponse.json(
      { message: "File name is required" },
      { status: 400 }
    );
  }

  try {
    // Create the DeleteObjectCommand
    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
    });

    // Delete the file from S3
    await s3.send(command);

    // Delete the file from the database
    await prisma.materialUrl.deleteMany({
      where: { name: fileName },
    });

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { message: "File deletion failed" },
      { status: 500 }
    );
  }
}
