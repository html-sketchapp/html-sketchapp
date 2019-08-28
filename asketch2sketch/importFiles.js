import asketch2sketch from './asketch2sketch';
import manageSymbols from './manageSymbols';
import cleanupFile from './cleanupFile';

export default function importFiles(context) {
  const panel = NSOpenPanel.openPanel();

  panel.setCanChooseDirectories(false);
  panel.setCanChooseFiles(true);
  panel.setAllowsMultipleSelection(true);
  panel.setTitle('Choose *.asketch.json files');
  panel.setPrompt('Choose');
  panel.setAllowedFileTypes(['json']);

  if (panel.runModal() !== NSModalResponseOK || panel.URLs().length === 0) {
    return;
  }

  const urls = Array.from(panel.URLs());

  const asketchFiles = urls.map(url => {
    const data = NSData.dataWithContentsOfURL(url);
    const content = NSString.alloc().initWithData_encoding_(data, NSUTF8StringEncoding);

    let asketchFile = null;

    try {
      asketchFile = JSON.parse(content);
    } catch (e) {
      const alert = NSAlert.alloc().init();

      alert.setMessageText('File is not valid JSON.');
      alert.runModal();
    }

    return asketchFile;
  });

  asketch2sketch(context, asketchFiles);

  const lastIndex = context.document.pages().length - 1;

  manageSymbols(context, lastIndex);
  cleanupFile(context, lastIndex);
}
