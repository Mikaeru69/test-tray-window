//
const { app, BrowserWindow, Menu, nativeImage, Tray } = require ('electron');
if (process.platform === 'darwin')
{
    app.dock.hide ();
}
let tray = null;
let window = null;
let trayMenuTemplate =
[
    {
        role: 'quit',
        click: () => { if (process.platform === 'darwin') { app.hide (); } app.quit (); }
    }
];
function showPopUpMenu ()
{
    tray.popUpContextMenu (Menu.buildFromTemplate (trayMenuTemplate));
}
function createTray ()
{
    tray = new Tray (nativeImage.createFromDataURL ("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBJREFUeNpi/P//PwM1AAuIaGRkoMi0+v8MjEwMVAKjBo0aNGrQSDWIkVoFG0CAAQCpvAkfU74BegAAAABJRU5ErkJggg=="));
    tray.setToolTip (app.getName ());
    if (process.platform === 'darwin')
    {
        tray.setIgnoreDoubleClickEvents (true);
    }
    tray.on
    (
        'click',
        (event) =>
        {
            event.preventDefault ();
            if ((process.platform === 'darwin') ? event.ctrlKey : event.metaKey)
            {
                showPopUpMenu ();
            }
            else
            {
                if (window.isVisible ())
                {
                    if (process.platform === 'darwin')
                    {
                        app.hide ();
                    }
                    window.hide ();
                }
                else
                {
                    window.show ();
                }
            }
        }
    );
    tray.on
    (
        'right-click',
        (event) =>
        {
            showPopUpMenu ();
        }
    );
}
function createWindow ()
{
    const mainScreen = require ('electron').screen.getPrimaryDisplay ();
    const dimensions = mainScreen.workArea;
    const sceneWidth = 418;
    const sceneHeight = 700;
    window = new BrowserWindow
    (
        {
            x: dimensions.x + (dimensions.width - sceneWidth),
            y: dimensions.y + (dimensions.height - sceneHeight),
            width: sceneWidth,
            height: sceneHeight,
            show: false,
            frame: false,
            skipTaskbar: true,
            fullscreenable: false,
            resizable: false,
            transparent: false,
            webPreferences:
            {
                backgroundThrottling: false
            }
        }
    );
    window.loadURL (`file://${__dirname}/index.html`);
    window.on ('blur', () => { window.hide (); });
}
app.on
(
    'ready',
    () =>
    {
        createTray ();
        createWindow ();
    }
);
//
