const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const { Storage } = require('@google-cloud/storage');
const Firestore = require('@google-cloud/firestore');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const storage = new Storage();
const firestore = new Firestore({
  projectId: 'lerb-7790f'
});

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_SUFFIX = '_thumb';

exports.onImageUpload = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const bucketName = object.bucket;
  const bucket = storage.bucket(bucketName)
  const metadata = object.metadata;
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath, ext);
  const id = parseInt(fileName.split('.')[0]);
  const fileDir = path.dirname(filePath);
  const thumbFileDir = fileDir.replace('/images', '/thumbs');
  const userid = fileDir.split('/')[1];
  const tracker = fileDir.split('/')[2];
  const tempLocalFile = path.join(os.tmpdir(), filePath)
  const tempLocalDir = path.dirname(tempLocalFile)
  const thumbFilePath = path.normalize(path.join(thumbFileDir, `${fileName}${ext}`));
  const localThumbFilePath = path.normalize(path.join(fileDir, `thumb_${fileName}${ext}`));
  const tempLocalThumbFile = path.join(os.tmpdir(), localThumbFilePath);
  
  console.log({ filePath, userid, tracker, id });

  if (!object.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return null;
  }

  if (fileDir.endsWith('thumbs')) {
    console.log('Image is thumbnail.');
    return null;
  }

  if (metadata.autoOrient) {
    console.log('Image already oriented.');
    return null;
  }

  await mkdirp(tempLocalDir);
  // Download file from bucket.
  await bucket.file(filePath).download({destination: tempLocalFile});
  console.log('The file has been downloaded to', tempLocalFile);

  //orient
  await spawn('convert', [tempLocalFile, '-auto-orient', tempLocalFile]);
  console.log('rotated image created at', tempLocalFile);
  
  await bucket.upload(tempLocalFile, {
    destination: filePath,
    resumable: false,
    metadata: {
      metadata: {
        cacheControl: 'public, max-age=31536000',
        autoOrient: true
      }
    },
  });
  console.log('oriented image uploaded to Storage at', filePath);

  //thumbnail
  await spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], {capture: ['stdout', 'stderr']});
  console.log('thumbnail created at', tempLocalThumbFile);

  let thumbresp = await bucket.upload(tempLocalThumbFile, {
    destination: thumbFilePath,
    metadata: metadata,
    resumable: false
  });
  
  console.log('thumbnail uploaded to Storage at', thumbFilePath);  

  // Once the image has been converted delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  console.log('Deleted local file', filePath);
  fs.unlinkSync(tempLocalThumbFile);
  console.log('Deleted local file', tempLocalThumbFile);

  const remoteThumbFile = thumbresp[0];
  const thumburlResp = await remoteThumbFile.getSignedUrl({
    action: 'read',
    expires: '12-31-2050'
  });
  const thumbUrl = thumburlResp[0];
  
  console.log('got thumbnail url: ', thumbUrl);

  const ref = firestore.collection('photos').doc(userid);
  const doc = await ref.get();
  const photos = doc.data();
  const trackerPhotos = photos[tracker];
  console.log('this trackers photos: ', trackerPhotos);
  for (let i = 0; i < trackerPhotos.length; i++){
    if (trackerPhotos[i].id === id){
      console.log('found photo entry');
      trackerPhotos[i].thumbUrl = thumbUrl;
      break;
    }
  }

  let update = {};
  update[tracker] = trackerPhotos;
  console.log('update', update);

  await ref.update(update);
  console.log('added thumburl to firestore');

  return true;

})