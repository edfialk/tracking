const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const { Storage } = require('@google-cloud/storage');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const storage = new Storage();

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';

exports.onImageUpload = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const bucketName = object.bucket;
  const metadata = object.metadata;
  
  const fileName = path.basename(filePath);
  const fileDir = path.dirname(filePath);
  const tempLocalFile = path.join(os.tmpdir(), filePath)
  const tempLocalDir = path.dirname(tempLocalFile)
  const bucket = storage.bucket(bucketName)
  const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);

  if (!object.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  await mkdirp(tempLocalDir);
  // Download file from bucket.
  await bucket.file(filePath).download({destination: tempLocalFile});
  console.log('The file has been downloaded to', tempLocalFile);

  //orient
  if (!metadata.autoOrient) {
    await spawn('convert', [tempLocalFile, '-auto-orient', tempLocalFile]);
    console.log('rotated image created at', tempLocalFile);
    metadata.autoOrient = true;
  }

  //thumbnail
  if (!fileName.startsWith(THUMB_PREFIX)) {
    await spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
    console.log('thumbnail created at', tempLocalThumbFile);
  }

  await bucket.upload(tempLocalFile, {
    destination: filePath,
    metadata: {metadata: metadata}
  });
  console.log('image uploaded to Storage at', filePath);

  await bucket.upload(tempLocalThumbFile, {destination: thumbFilePath, metadata: metadata});
  console.log('thumbnail uploaded to Storage at', thumbFilePath);  

  // Once the image has been converted delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  console.log('Deleted local file', filePath);
  fs.unlinkSync(tempLocalThumbFile);
  console.log('Deleted local file', tempLocalThumbFile);

  return true;

})