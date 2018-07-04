import asketch2sketch from './asketch2sketch';

export default function paste(context) {
  const clipboardContent = NSPasteboard.generalPasteboard().stringForType(NSPasteboardTypeString);

  let clipboardJson = null;

  try {
    clipboardJson = JSON.parse(clipboardContent);
  } catch (e) {
    const alert = NSAlert.alloc().init();

    alert.setMessageText('Clipboard content is not valid JSON.');
    alert.runModal();

    return;
  }

  const asketchFiles = Array.isArray(clipboardJson) ? clipboardJson : [clipboardJson];

  asketch2sketch(context, asketchFiles);
}
