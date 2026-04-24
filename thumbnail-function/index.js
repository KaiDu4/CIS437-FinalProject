const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const CloudConvert = require('cloudconvert');
const axios = require('axios');
const path = require('path');
const os = require('os');
const fs = require('fs');

const storage = new Storage();
const secretClient = new SecretManagerServiceClient();
const THUMBNAIL_BUCKET = 'teachshare-thumbnails';
const SUPPORTED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

async function getApiKey() {
    if (process.env.CLOUDCONVERT_API_KEY) {
        return process.env.CLOUDCONVERT_API_KEY;
    }
    const [version] = await secretClient.accessSecretVersion({
        name: 'projects/dulak-finalproject-cis437/secrets/CLOUDCONVERT_API_KEY/versions/latest'
    });
    return version.payload.data.toString('utf8');
}

functions.cloudEvent('generateThumbnail', async (cloudEvent) => {
    const file = cloudEvent.data;
    const fileName = file.name;
    const contentType = file.contentType;

    if (!SUPPORTED_TYPES.includes(contentType)) {
        console.log(`Skipping unsupported file type: ${contentType}`);
        return;
    }

    if (fileName.startsWith('thumbnails/')) {
        console.log(`Skipping thumbnail file: ${fileName}`);
        return;
    }

    console.log(`Processing: ${fileName} (${contentType})`);

    const apiKey = await getApiKey();
    const cloudConvert = new CloudConvert(apiKey);

    const baseName = path.basename(fileName, path.extname(fileName));
    const thumbFileName = `thumb_${baseName}.png`;
    const tempOutput = path.join(os.tmpdir(), thumbFileName);

    try {
        const [signedUrl] = await storage
            .bucket(file.bucket)
            .file(fileName)
            .getSignedUrl({
                action: 'read',
                expires: Date.now() + 10 * 60 * 1000
            });

        const job = await cloudConvert.jobs.create({
            tasks: {
                'import-file': {
                    operation: 'import/url',
                    url: signedUrl,
                    filename: path.basename(fileName)
                },
                'convert-to-png': {
                    operation: 'convert',
                    input: 'import-file',
                    output_format: 'png',
                    pages: '1',
                    width: 300,
                    height: 200,
                    fit: 'crop',
                    engine: 'libreoffice'
                },
                'export-file': {
                    operation: 'export/url',
                    input: 'convert-to-png'
                }
            }
        });

        const completedJob = await cloudConvert.jobs.wait(job.id);

        const exportTask = completedJob.tasks.find(t => t.name === 'export-file');
        if (!exportTask || !exportTask.result || !exportTask.result.files || !exportTask.result.files.length) {
            throw new Error('CloudConvert export produced no files');
        }

        const resultUrl = exportTask.result.files[0].url;

        const response = await axios({ url: resultUrl, method: 'GET', responseType: 'stream' });
        const writer = fs.createWriteStream(tempOutput);
        await new Promise((resolve, reject) => {
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        await storage.bucket(THUMBNAIL_BUCKET).upload(tempOutput, {
            destination: thumbFileName,
            metadata: {
                contentType: 'image/png',
                cacheControl: 'public, max-age=31536000'
            }
        });

        console.log(`Thumbnail saved: ${THUMBNAIL_BUCKET}/${thumbFileName}`);

    } catch (err) {
        console.error('Thumbnail generation failed:', err);
        throw err;

    } finally {
        if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
    }
});
