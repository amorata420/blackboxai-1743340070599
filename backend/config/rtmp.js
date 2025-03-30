const NodeMediaServer = require('node-media-server');
const Stream = require('../models/Stream');
const ffmpeg = require('fluent-ffmpeg');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*',
    mediaroot: './media'
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
};

const nms = new NodeMediaServer(config);

nms.on('prePublish', async (id, StreamPath, args) => {
  const streamKey = StreamPath.split('/')[2];
  console.log(`[NodeEvent on prePublish] id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);

  try {
    const stream = await Stream.findOne({ streamKey });
    if (!stream) {
      const session = nms.getSession(id);
      session.reject();
      console.log('Stream key not found, rejecting connection');
      return;
    }

    // Update stream status to live
    stream.isLive = true;
    stream.startTime = new Date();
    await stream.save();
    console.log(`Stream ${stream.title} is now live`);

    // Start recording the stream
    const outputPath = `./media/recordings/${stream._id}_${new Date().toISOString()}.mp4`;
    ffmpeg()
      .input(`rtmp://localhost/live/${streamKey}`)
      .output(outputPath)
      .on('start', () => console.log(`Recording started for ${stream.title}`))
      .on('error', (err) => console.error('Recording error:', err))
      .on('end', () => console.log(`Recording finished for ${stream.title}`))
      .run();

  } catch (err) {
    console.error('Error in prePublish:', err);
  }
});

nms.on('donePublish', async (id, StreamPath, args) => {
  const streamKey = StreamPath.split('/')[2];
  console.log(`[NodeEvent on donePublish] id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);

  try {
    const stream = await Stream.findOne({ streamKey });
    if (stream) {
      stream.isLive = false;
      stream.endTime = new Date();
      await stream.save();
      console.log(`Stream ${stream.title} has ended`);
    }
  } catch (err) {
    console.error('Error in donePublish:', err);
  }
});

module.exports = nms;