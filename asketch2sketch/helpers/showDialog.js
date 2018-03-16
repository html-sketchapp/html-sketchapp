export default function showDialog(text) {
  const alert = COSAlertWindow.new();

  alert.setMessageText('asketch2sketch');
  alert.setInformativeText(text);
  alert.addButtonWithTitle('OK');

  alert.runModal();

  return alert;
}
