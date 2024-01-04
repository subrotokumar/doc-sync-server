import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BUCKET_NAME, BUCKET_REGION } from "../../constant";

const s3Client = new S3Client({
    region: BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.CLOUD_ACCESS_TOKEN ?? "",
        secretAccessKey: process.env.CLOUD_SECRET_ACCESS_KEY ?? "",
    }
})

const getObjectURL = async (key: string) => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    })
    const url = await getSignedUrl(s3Client, command)
    return url;
}

const putObjectUrl = async (key: string, contextType: string) => {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contextType,
    })
    const url = await getSignedUrl(s3Client, command, { expiresIn: 5 * 60 })
    return url;
}
export { getObjectURL, putObjectUrl }